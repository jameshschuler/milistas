import { Model, snakeCaseMappers } from 'objection';

export default class ListType extends Model {
    static get columnNameMappers () {
        return snakeCaseMappers();
    }

    static get tableName () {
        return 'list_type';
    }

    static get idColumn () {
        return 'list_type_id';
    }

    public static relationMappings = {

    }
}