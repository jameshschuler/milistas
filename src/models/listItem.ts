import { Model, snakeCaseMappers } from 'objection';
import Account from './account';
import List from './list';

export default class ListItem extends Model {
    accountId: number;
    createdOn: number;
    isVisible: boolean;
    listId: number;
    title: string;
    updatedOn: string;
    value: string;

    static get columnNameMappers () {
        return snakeCaseMappers();
    }

    static get tableName () {
        return 'list_item';
    }

    static get idColumn () {
        return 'list_item_id';
    }

    public static relationMappings = {
        account: {
            relation: Model.BelongsToOneRelation,
            modelClass: Account,
            join: {
                from: 'list_item.account_id',
                to: 'account.account_id'
            }
        },
        list: {
            relation: Model.BelongsToOneRelation,
            modelClass: List,
            join: {
                from: 'list_item.list_id',
                to: 'list.list_id'
            }
        }
    }
}