import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import { LoginRequest } from 'src/types/request/loginRequest';
import AccessCode from '../models/accessCode';
import Account from '../models/account';
import { AppError } from '../types/error';
import { RegisterRequest } from '../types/request/registerRequest';
import { send } from './twilioService';

async function register ( request: RegisterRequest ) {
    const accountQuery = Account.query().where( {
        phone_number: request.phoneNumber,
    } ).orWhere( {
        username: request.username
    } ).first();

    const account = await accountQuery;

    if ( account ) {
        let message = '';
        if ( account.phoneNumber === request.phoneNumber ) {
            message = 'Account with phone number already exists.';
        } else if ( account.username === request.username ) {
            message = 'Account with username already exists.';
        }

        throw new AppError( message, StatusCodes.CONFLICT );
    }

    const newAccount = await Account.query().insert( {
        firstName: request.firstName,
        lastName: request.lastName,
        phoneNumber: request.phoneNumber,
        emailAddress: request.emailAddress,
        isActive: true,
        username: request.username,
    } );

    await sendAccessCode( newAccount.accountId, newAccount.phoneNumber )
}

async function login ( request: LoginRequest ) {
    const account = await Account.query().findOne( {
        username: request.username
    } );

    if ( !account ) {
        throw new AppError( 'Invalid credentials', StatusCodes.BAD_REQUEST );
    }

    await verifyAccessCode( account.accountId );
}

async function verifyAccessCode ( accountId: number ) {
    const accessCode = await AccessCode.query().findOne( {
        account_id: accountId
    } );

    console.log( accessCode );
    // TODO: need to update db column to be of interval type to properly store and retrieve iso date string
    if ( !accessCode || dayjs( accessCode.expirationDate ).isAfter( dayjs().toISOString() ) ) {
        throw new AppError( 'Access token has expired.', StatusCodes.FORBIDDEN );
    }
}

async function sendAccessCode ( accountId: number, phoneNumber: string ) {
    // TODO: make sure account exists

    const existingAccessCode = await AccessCode.query().findOne( {
        account_id: accountId
    } );

    if ( existingAccessCode ) {
        await AccessCode.query().deleteById( existingAccessCode.accountId );
    }

    const accessCode = generateAccessCode();

    await AccessCode.query().insert( {
        accountId,
        code: accessCode,
        expirationDate: dayjs().add( 5, 'minute' ).toISOString(),
    } );

    await send( phoneNumber, `Mi Listas Access Code. Your access code is ${accessCode}. This code expires in 10 minutes.` );
}

function generateAccessCode ( length: number = 8 ) {
    return Math.round( ( Math.pow( 36, length + 1 ) - Math.random() * Math.pow( 36, length ) ) ).toString( 36 ).slice( 1 );
}

export default {
    login,
    register,
    sendAccessCode
}