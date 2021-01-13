import { Model, snakeCaseMappers } from 'objection';

export default class List extends Model {
    accountId: number;
    createdOn: number;
    isVisible: boolean;
    listId: number;
    listTypeId: number;
    name: string;
    updatedOn: string;

    static get columnNameMappers () {
        return snakeCaseMappers();
    }

    static get tableName () {
        return 'list';
    }

    static get idColumn () {
        return 'list_id';
    }

    public static relationMappings = {

    }
}