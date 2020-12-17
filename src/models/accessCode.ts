import { Model, snakeCaseMappers } from 'objection';
import Account from './account';

export default class AccessCode extends Model {
    public accountId: number;
    public accessCodeId: number;
    public code: string;
    public expirationDate: string;

    static get columnNameMappers () {
        return snakeCaseMappers();
    }

    static get tableName () {
        return 'access_code';
    }

    static get idColumn () {
        return 'access_code_id';
    }

    public relationMappings = {
        account: {
            relation: Model.BelongsToOneRelation,
            modelClass: Account,
            join: {
                from: 'access_code.account_id',
                to: 'account.account_id'
            }
        }
    }
}