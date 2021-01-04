import { Model, snakeCaseMappers } from 'objection';
import AccessCode from './accessCode';

export default class Account extends Model {
    public firstName: string;
    public lastName: string;
    public phoneNumber: string;
    public emailAddress: string;
    public isActive: boolean;
    public accountId: number;
    public username: string;
    public lastLogin: string;

    static get columnNameMappers () {
        return snakeCaseMappers();
    }

    static get tableName () {
        return 'account';
    }

    static get idColumn () {
        return 'account_id';
    }

    public static relationMappings = {
        accessCode: {
            relation: Model.HasOneRelation,
            modelClass: AccessCode,
            join: {
                from: 'account.account_id',
                to: 'access_code.access_code_id'
            }
        }
    };
}