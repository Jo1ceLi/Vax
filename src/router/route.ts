import { Container } from 'typeorm-typedi-extensions';
import { createConnection, useContainer } from 'typeorm';
import Router from 'koa-router';
// import { homeRoute, hospitalRoute, reserveRoute } from './routeCenter';
// import { homeRoute, hospitalRoute } from './routeCenter';
import { LoginRoute, ReserveRoute } from './index.route';



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