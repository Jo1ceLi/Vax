import 'reflect-metadata';
import { Container } from 'typedi';
import Koa from 'koa';
import logger from 'koa-logger';
import { createConnection } from 'typeorm';
import bodyParser from 'koa-bodyparser';
import { connectdbAndSetRouter, routes } from './router/route';
import Router from 'koa-router';
// export class App {
//     private static _instance: App;
//     private static app = new Koa();
//     private static routess: Router.IMiddleware<any, {}>
//     private constructor() {
//         App.app.use(logger());
//         App.app.use(bodyParser({enableTypes: ['json', 'text', 'form']}));
//         App.app.use(routes);
//         App.app.use(App.routess);
//         App.app.use(async (ctx, next) => {
//             try {
//                 await next();
//             } catch (err) {
//                 // ctx.status = err.status || 500;
//                 // ctx.body = err.message;
//                 ctx.app.emit(`error`, err, ctx);
//             }
//         })
//         App.app.on('error', (err, ctx) => { 
//             console.log(err);
//             err.expose = true; // Dev 
//             // ctx.response.status = 410;
//         })
//         App.app.use(async (ctx, next)=>{
//             let connection = await createConnection();
//             ctx.db.connection = connection;
//             console.log(`Create connection on ${ctx.db.connection.name}`)
//             await next();
//         })
//         App.app.listen(3000);
//     }
//     static async getAPPInstance(): Promise<App> {
//         if(!App._instance) {
//             App._instance = new App();
//         }
//         App.routess = await connectdbAndSetRouter();
//         return App._instance;
        
//     }
// }

// App.getAPPInstance();

connectdbAndSetRouter().then(routes=>{
    console.log(`connected to db`)
    const app = new Koa();
    app.use(logger())
    app.use(bodyParser());
    app.use(routes);
    // app.use(async (ctx)=>{
    //     ctx.body = 'hello';
    // })
    let port = 3000;
    app.listen(port)
        .on('listening', () => {
        console.log(`sever started on port=${port} go to http://localhost:${port}`)
    })
});