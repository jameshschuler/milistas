import { StatusCodes } from 'http-status-codes';
import listService from '../services/listService';
import { KoaContext, Next } from '../types/koa';
import { CreateListRequest, createListRequestSchema } from '../types/request/createListRequest';
import { validateRequestModel } from '../util/validation';

export async function createList ( cxt: KoaContext, next: Next ) {
    const request = cxt.request.body as CreateListRequest;

    if ( !validateRequestModel( cxt, request, createListRequestSchema ) ) {
        console.log( 'return' )
        return;
    }

    await listService.createList( cxt.state?.user?.data?.accountId, request );

    cxt.response.status = StatusCodes.CREATED;
}

export async function getAllLists ( cxt: KoaContext, next: Next ) {
    const lists = await listService.getAllLists( cxt.state?.user?.data?.accountId );

    cxt.response.body = {
        lists
    }
    cxt.response.status = StatusCodes.OK;
}

export async function getList ( cxt: KoaContext, next: Next ) {
    const listId = cxt.params.id;
    const list = await listService.getList( cxt.state?.user?.data?.accountId, listId );

    cxt.response.body = {
        list
    }
    cxt.response.status = StatusCodes.OK;
}