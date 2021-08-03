import 'reflect-metadata';
import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import { connectdbAndSetRouter } from './router/route';

connectdbAndSetRouter().then(routes=>{
    console.log(`connected to db`)
    const app = new Koa();
    app.use(logger())
    app.use(bodyParser());
    app.use(routes);
    let port = 3000;
    app.listen(port)
        .on('listening', () => {
        console.log(`sever started on port=${port} go to http://localhost:${port}`)
    })
});