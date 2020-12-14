import cors from '@koa/cors';
import bookshelf from 'bookshelf';
import { StatusCodes } from 'http-status-codes';
import Knex from 'knex';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';
import { register } from './controllers/accountController';
import connectionConfig from './db';

const knex = Knex( connectionConfig );

export const bookshelfRef = bookshelf( knex );
export type KoaContext = Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>;
export type Next = () => Promise<any>;

const app = new Koa();

app.use( cors( {
    origin: '*',
    credentials: true,
    keepHeadersOnError: true
} ) );
app.use( logger() );
app.use( helmet() );
app.use( compress() );
app.use( json() );
app.use( logger() );
app.use( bodyParser() );

app.use( async function ( ctx, next ) {
    try {
        await next();
    } catch ( err ) {
        console.log( 'err', err )
        ctx.status = err.status || 500;
        ctx.type = 'json';
        ctx.body = {
            message: err.message || 'Something went wrong.',
            statusCode: err.statusCode
        };

        ctx.app.emit( 'error', err, ctx );
    }
} );

app.on( 'error', ( err, ctx: KoaContext ) => {
    console.error( 'server error', err, ctx )
} );

const router = new Router();

router.get( '/', async ( cxt, next ) => {
    cxt.body = { message: '🐨' }

    await next();
} );

router.post( '/api/v1/account/register', register );

app.use( router.routes() ).use( router.allowedMethods() );


app.use( async function pageNotFound ( ctx ) {
    ctx.status = StatusCodes.NOT_FOUND;
    ctx.body = {
        message: 'Path Not Found'
    }
} );

app.listen( 3000, () => {
    console.log( 'Server started!' );
} );