import { StatusCodes } from 'http-status-codes';
import AccessCode from '../models/accessCode';
import Account from '../models/account';
import { AppError } from '../types/error';
import { RegisterRequest } from '../types/request/registerRequest';

async function register ( request: RegisterRequest ) {
    const account = await Account.query().findOne( {
        phone_number: request.phoneNumber
    } );

    if ( account ) {
        throw new AppError( 'Account with phone number already exists.', StatusCodes.CONFLICT );
    }

    await Account.query().insert( {
        firstName: request.firstName,
        lastName: request.lastName,
        phoneNumber: request.phoneNumber,
        emailAddress: request.emailAddress,
        isActive: true,
    } );
}

async function sendAccessCode ( accountId: number, phoneNumber: string ) {
    const existingAccessCode = await AccessCode.query().findOne( {
        account_id: accountId
    } );

    if ( existingAccessCode ) {
        await AccessCode.query().deleteById( existingAccessCode.accountId );
    }

    // const code = '';
    // generate code
    // send code to user's phone
}

export default {
    register,
    sendAccessCode
}