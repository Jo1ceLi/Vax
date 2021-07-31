import { Container } from 'typeorm-typedi-extensions';
import { createConnection, useContainer } from 'typeorm';
import Router from 'koa-router';
// import { homeRoute, hospitalRoute, reserveRoute } from './routeCenter';
import { homeRoute, hospitalRoute } from './routeCenter';
import {LoginRoute} from './login.route';
import { ReserveRoute } from './reserve.route';

var router = new Router();

const routers: Router.IMiddleware[] = [
    // homeRoute, hospitalRoute, reserveRoute
    homeRoute, hospitalRoute
];

routers.forEach( middleware => {
    router.use(middleware);
})

const routes = router.routes();

export { routes };


export async function connectdbAndSetRouter(): Promise<Router.IMiddleware<any, {}>> {
    useContainer(Container)
    let conn = await createConnection();
    let router = new Router();
    
    let loginRoute = Container.get(LoginRoute).router.routes();
    let reserveRoute = Container.get(ReserveRoute).router.routes();
    var routers: Router.IMiddleware[] = [
        loginRoute, reserveRoute
    ];
    routers.forEach(middleware=>{
        router.use(middleware);
    })
    

    return router.routes();
}