import { Account } from '../models/account';
import { RegisterRequest } from '../types/request/registerRequest';

async function register ( request: RegisterRequest ) {
    Account.where( { 'phone_number': request.phoneNumber } );
}

export default {
    register
}