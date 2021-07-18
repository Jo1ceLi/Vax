import Router from 'koa-router';
import { homeRoute, loginRoute, hospitalRoute, reserveRoute } from './routeCenter';

var router = new Router();
// router
//     .get('/citizen/:id', async (ctx) => {
//         console.log(ctx.params.id);
//         ctx.response.body = ctx.params.id;
//     })
// let HomeRoute = router.routes();

const routers: Router.IMiddleware[] = [
    homeRoute, loginRoute, hospitalRoute, reserveRoute
];

routers.forEach( middleware => {
    router.use(middleware);
})

const routes = router.routes();

export { routes };