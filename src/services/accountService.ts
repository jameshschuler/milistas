import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { LoginRequest } from 'src/types/request/loginRequest';
import AccessCode from '../models/accessCode';
import Account from '../models/account';
import { AppError } from '../types/error';
import { RegisterRequest } from '../types/request/registerRequest';
import { send } from './twilioService';

require( 'dotenv' ).config();

async function getAccessCode ( username: string ) {
    if ( username === '' ) {
        throw new AppError( 'Username is required.', StatusCodes.BAD_REQUEST );
    }

    const account = await Account.query().findOne( {
        username
    } );

    if ( !account ) {
        throw new AppError( 'Account not found.', StatusCodes.NOT_FOUND );
    }

    await sendAccessCode( account.accountId, account.phoneNumber );
}

async function getAccount ( accountId: number ) {
    const account = await Account.query().findOne( {
        account_id: accountId
    } );

    if ( !account ) {
        throw new AppError( 'Account not found.', StatusCodes.NOT_FOUND );
    }

    const { firstName, lastName, phoneNumber, emailAddress, username, lastLogin } = account;

    return {
        accountId,
        firstName,
        lastName,
        phoneNumber,
        emailAddress,
        username,
        lastLogin
    }
}

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

    await verifyAccessCode( account.accountId, request.accessCode );

    const token = jwt.sign( {
        data: {
            accountId: account.accountId
        }
    }, process.env.SUPER_SECRET_SECRET!, { expiresIn: '168h' } ); // 7 days

    await Account.query()
        .findById( account.accountId )
        .patch( {
            lastLogin: dayjs().toISOString()
        } );

    return {
        accountId: account.accountId,
        token
    }
}

async function sendAccessCode ( accountId: number, phoneNumber: string, verifyAccount: boolean = false ) {
    if ( verifyAccount ) {
        const account = await Account.query().findOne( {
            account_id: accountId
        } );

        if ( !account ) {
            throw new AppError( 'Account not found.', StatusCodes.NOT_FOUND );
        }
    }

    const existingAccessCode = await AccessCode.query().findOne( {
        account_id: accountId
    } );

    if ( existingAccessCode ) {
        await AccessCode.query().delete().where( 'account_id', '=', existingAccessCode.accountId );
    }

    const accessCode = generateAccessCode().toLocaleUpperCase();

    await AccessCode.query().insert( {
        accountId,
        code: accessCode,
        expirationDate: dayjs().add( 10, 'minute' ).toISOString(),
    } );

    await send( phoneNumber, `Mi Listas Access Code. Your access code is ${accessCode}. This code expires in 10 minutes.` );
}

function generateAccessCode ( length: number = 8 ) {
    return Math.round( ( Math.pow( 36, length + 1 ) - Math.random() * Math.pow( 36, length ) ) ).toString( 36 ).slice( 1 );
}

async function verifyAccessCode ( accountId: number, requestedAccessCode: string ) {
    const accessCode = await AccessCode.query().findOne( {
        account_id: accountId
    } );

    if ( !accessCode || dayjs().isAfter( dayjs( accessCode.expirationDate ) ) ) {
        throw new AppError( 'Access code has expired.', StatusCodes.FORBIDDEN );
    }

    if ( accessCode.code !== requestedAccessCode.toLocaleUpperCase() ) {
        throw new AppError( 'Invalid access code.', StatusCodes.FORBIDDEN );
    }
}

export default {
    getAccessCode,
    getAccount,
    login,
    register
}