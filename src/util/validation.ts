import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { KoaContext } from '../types/koa';

export function validateRequestModel ( cxt: KoaContext, request: any, schema: Joi.ObjectSchema<any>, abortEarly: boolean = false ): boolean {
    const result: Joi.ValidationResult = schema.validate( request, {
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

        return false;
    }

    return true;
}