import { Model, snakeCaseMappers } from 'objection';

export default class Account extends Model {
    static get columnNameMappers () {
        return snakeCaseMappers();
    }

    static get tableName () {
        return 'account';
    }
}