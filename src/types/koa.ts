import Koa from 'koa';
import Router from 'koa-router';

export type KoaContext = Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>;
export type Next = () => Promise<any>;