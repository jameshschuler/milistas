import { bookshelfRef } from '../index';

export const Account = bookshelfRef.model( 'Account', {
    tableName: 'account'
} );