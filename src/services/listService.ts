import { StatusCodes } from 'http-status-codes';
import List from '../models/list';
import ListType from '../models/listType';
import { AppError } from '../types/error';
import { CreateListRequest } from '../types/request/createListRequest';

async function createList ( accountId: number, request: CreateListRequest ) {
    await isValidListType( request.listTypeId );

    const existingList = await List.query().findOne( {
        account_id: accountId,
        name: request.name
    } );

    if ( existingList ) {
        request.name += `_${Math.floor( Math.random() * 1000 )}`;
    }

    await List.query().insert( {
        name: request.name,
        isVisible: request.isVisible,
        listTypeId: request.listTypeId,
        accountId: accountId
    } );
}

async function getAllLists ( accountId: number ) {
    const lists = await List.query().where( {
        account_id: accountId,
    } );

    return lists.map( ( { isVisible, listId, listTypeId, name, createdOn, updatedOn }: List ) => {
        return {
            listId,
            name,
            isVisible,
            listTypeId,
            createdOn,
            updatedOn,
        }
    } );
}

async function getList ( accountId: number, listId: number ) {
    const list = await List.query().findOne( {
        account_id: accountId,
        list_id: listId
    } );

    if ( !list ) {
        throw new AppError( 'List not found.', StatusCodes.NOT_FOUND );
    }

    const { isVisible, listTypeId, name, createdOn, updatedOn } = list;

    return {
        listId,
        name,
        isVisible,
        listTypeId,
        createdOn,
        updatedOn,
        listItems: []
    };
}

async function isValidListType ( listTypeId: number ) {
    const listType = await ListType.query().findById( listTypeId );

    if ( !listType ) {
        throw new AppError( 'Invalid List Type.', StatusCodes.NOT_FOUND );
    }
}

export default {
    createList,
    getAllLists,
    getList
}