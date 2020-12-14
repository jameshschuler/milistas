import { RegisterRequest } from 'src/types/request/registerRequest';
import { KoaContext, Next } from '../index';

export async function register ( cxt: KoaContext, next: Next ) {
    const request = cxt.request.body as RegisterRequest;
    console.log( request );

    cxt.response.body = {
        message: 'Hello'
    }
}