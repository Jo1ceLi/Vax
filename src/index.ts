import 'reflect-metadata';
import Koa from 'koa';
import logger from 'koa-logger';
import { createConnection } from 'typeorm';
import bodyParser from 'koa-bodyparser';
import { routes } from './router/route';
export class App {
    private static _instance: App;
    private static app = new Koa();
    private constructor() {
        App.app.use(logger());
        App.app.use(bodyParser({enableTypes: ['json', 'text', 'form']}));
        App.app.use(routes);
        App.app.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                // ctx.status = err.status || 500;
                // ctx.body = err.message;
                ctx.app.emit(`error`, err, ctx);
            }
        })
        App.app.on('error', (err, ctx) => { 
            console.log(err);
            err.expose = true; // Dev 
            // ctx.response.status = 410;
        })
        createConnection().then(connection=>{
            console.log(`Successful create connection ${connection.name}`);
        })
        App.app.listen(3000);
    }
    static getAPPInstance(): App {
        if(!App._instance) {
            App._instance = new App();
        }
        return App._instance;
        
    }
}

App.getAPPInstance();