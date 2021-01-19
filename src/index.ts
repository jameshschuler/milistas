import cors from '@koa/cors';
import { StatusCodes } from 'http-status-codes';
import Knex from 'knex';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import json from 'koa-json';
import jwt from 'koa-jwt';
import logger from 'koa-logger';
import Router from 'koa-router';
import { Model } from 'objection';
import { getAccessCode, getAccount, login, register } from './controllers/accountController';
import { createList, getAllLists, getList } from './controllers/listController';
import connectionConfig from './db';
import { KoaContext } from './types/koa';

require( 'dotenv' ).config();

const knex = Knex( connectionConfig );
Model.knex( knex );

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
app.use( bodyParser() );

// TODO: rate limiting

app.use( async function ( ctx, next ) {
    try {
        await next();
    } catch ( err ) {
        console.log( 'err', err );
        if ( err.status === 401 ) {
            ctx.status = 401;

            const message = err.originalError ? err.originalError.message : err.message;
            ctx.body = {
                message: message || 'Protected resource, use Authorization header to get access',
                statusCode: err.statusCode
            }
        } else {
            ctx.status = err.statusCode || 500;
            ctx.type = 'json';
            ctx.body = {
                message: err.message || 'Something went wrong.',
                statusCode: err.statusCode
            };
        }

        ctx.app.emit( 'error', err, ctx );
    }
} );

app.use( jwt( {
    secret: process.env.SUPER_SECRET_SECRET!
} ).unless( {
    path: [ '/api/v1/account/login', '/api/v1/account/register', '/api/v1/account/accessCode' ]
} ) );

app.on( 'error', ( err, ctx: KoaContext ) => {
    // console.error( 'server error', err, ctx )
} );

const router = new Router();

router.get( '/', async ( cxt, next ) => {
    cxt.body = { message: '🐨' }

    await next();
} );

router.post( '/api/v1/account/register', register );
router.post( '/api/v1/account/login', login );
router.get( '/api/v1/account', getAccount );

router.post( '/api/v1/account/accessCode', getAccessCode );

router.post( '/api/v1/list', createList );
router.get( '/api/v1/list', getAllLists );
router.get( '/api/v1/list/:id', getList );

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