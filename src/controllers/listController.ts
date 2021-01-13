import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import listService from '../services/listService';
import { KoaContext, Next } from '../types/koa';
import { CreateListRequest, createListRequestSchema } from '../types/request/createListRequest';

export async function createList ( cxt: KoaContext, next: Next ) {
    const request = cxt.request.body as CreateListRequest;
    const result: Joi.ValidationResult = createListRequestSchema.validate( request, {
        abortEarly: false
    } );

    // TODO: move to util file?
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

    await listService.createList( cxt.state?.user?.data?.accountId, request );

    cxt.response.status = StatusCodes.CREATED;
}