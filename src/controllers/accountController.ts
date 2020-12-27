import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import accountService from '../services/accountService';
import { KoaContext, Next } from '../types/koa';
import { LoginRequest, loginRequestSchema } from '../types/request/loginRequest';
import { RegisterRequest, registerRequestSchema } from '../types/request/registerRequest';

export async function register ( cxt: KoaContext, next: Next ) {
    const request = cxt.request.body as RegisterRequest;
    const result: Joi.ValidationResult = registerRequestSchema.validate( request, {
        abortEarly: false
    } );

    if ( result.error ) {
        cxt.response.status = StatusCodes.BAD_REQUEST;
        cxt.response.body = {
            errors: result.error.details.map( ( error: any ) => {
                return {
                    path: error.path[ 0 ],
                    message: error.message,
                    context: error.context
                }
            } )
        }
        return;
    }

    await accountService.register( result.value );

    cxt.response.status = StatusCodes.CREATED;
}

export async function login ( cxt: KoaContext, next: Next ) {
    const request = cxt.request.body as LoginRequest;
    const result: Joi.ValidationResult = loginRequestSchema.validate( request, {
        abortEarly: false
    } );

    if ( result.error ) {
        cxt.response.status = StatusCodes.BAD_REQUEST;
        cxt.response.body = {
            errors: result.error.details.map( ( error: any ) => {
                return {
                    path: error.path[ 0 ],
                    message: error.message,
                    context: error.context
                }
            } )
        }
        return;
    }

    await accountService.login( result.value );

    cxt.response.status = StatusCodes.OK;
}