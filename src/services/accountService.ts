import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import AccessCode from '../models/accessCode';
import Account from '../models/account';
import { AppError } from '../types/error';
import { RegisterRequest } from '../types/request/registerRequest';
import { send } from './twilioService';

async function register ( request: RegisterRequest ) {
    const account = await Account.query().findOne( {
        phone_number: request.phoneNumber
    } );

    if ( account ) {
        throw new AppError( 'Account with phone number already exists.', StatusCodes.CONFLICT );
    }

    const newAccount = await Account.query().insert( {
        firstName: request.firstName,
        lastName: request.lastName,
        phoneNumber: request.phoneNumber,
        emailAddress: request.emailAddress,
        isActive: true,
    } );

    await sendAccessCode( newAccount.accountId, newAccount.phoneNumber )
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
    register,
    sendAccessCode
}