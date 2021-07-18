import Router from 'koa-router';
import { homeRoute, loginRoute, hospitalRoute, reserveRoute } from './routeCenter';

var router = new Router();

const routers: Router.IMiddleware[] = [
    homeRoute, loginRoute, hospitalRoute, reserveRoute
];

routers.forEach( middleware => {
    router.use(middleware);
})

const routes = router.routes();

export { routes };