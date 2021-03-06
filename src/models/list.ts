import { Model, snakeCaseMappers } from 'objection';
import Account from './account';
import ListItem from './listItem';

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
        account: {
            relation: Model.BelongsToOneRelation,
            modelClass: Account,
            join: {
                from: 'list.account_id',
                to: 'account.account_id'
            }
        },
        listItems: {
            relation: Model.HasManyRelation,
            modelClass: ListItem,
            join: {
                from: 'list.list_id',
                to: 'list_item.list_id'
            }
        }
    }
}