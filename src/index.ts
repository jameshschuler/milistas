import Knex from 'knex';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';
import { Model } from 'objection';
import config from './db';

const knex = Knex( config );

Model.knex( knex );

const app = new Koa();
const router = new Router();

router.get( '/', async ( cxt, next ) => {
    cxt.body = { message: '🐨' }

    await next();
} );

app.use( logger() );
app.use( helmet() );
app.use( compress() );
app.use( json() );
app.use( logger() );
app.use( bodyParser() );

app.use( router.routes() ).use( router.allowedMethods() );

app.listen( 3000, () => {
    console.log( 'Server started!' )
} );