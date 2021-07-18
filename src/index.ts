import 'reflect-metadata';
import Koa from 'koa';
import logger from 'koa-logger';
import { createConnection } from 'typeorm';
import { generateTaiwanID } from './service/generateTaiwanID.service';
import { generateRandomName } from './service/generateRandomName.service';
import bodyParser from 'koa-bodyparser';
import { routes } from './router/route';
import admin, { ServiceAccount } from 'firebase-admin';
import { People } from './Entity/People';
import { Priority } from './model/Priority';
// const serviceAccount: ServiceAccount = require('../vax-covid-19-firebase-adminsdk-fr1lx-9ab76a323c.json');

// export class FirebaseApp {
//     static app: admin.app.App;
//     private static _instance: FirebaseApp;
//     private constructor() {
//         FirebaseApp.app = admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount)
//         })
        
//     }
//     static getFirebaseAppInstance(): FirebaseApp {
//         if(!FirebaseApp._instance) {
//             FirebaseApp._instance = new FirebaseApp();
//         }
//         return FirebaseApp._instance;
//     }
// }

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
                ctx.status = err.status || 500;
                ctx.body = err.message;
                ctx.app.emit(`error`, err, ctx);
            }
        })
        App.app.on('error', (err, ctx) => { 
            console.log(err);
        })
        // FirebaseApp.getFirebaseAppInstance();
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
// const db = admin.firestore();
// async function findUser() {
//     console.log('finding user...')
//     try{
//         const user = await db.collection('users').get();
//         if(!user) {
//             console.log('no data');
//         }
//         user.forEach(doc=>{
//             console.log(doc.id, '=> ', doc.data())
//         })
//     }
//     catch(err){
//         console.log(err);
//     }
// }
// async function main() {
//     // await findUser();
//     createConnection().then( async connection => {
//         // let peopleRepo = connection.getRepository(People);
//         // for (let i = 0; i < 10; i++) {
//         //     let ppl = peopleRepo.create({
//         //         id: generateTaiwanID(),
//         //         name: generateRandomName(),
//         //         priority: Math.floor(Math.random()*9)+1,
//         //         vaccined: []
//         //     });
//         //     let people = await peopleRepo.save(ppl);
//         //     console.log(`People has created whose name is ${people._id} and called ${people.name}`);
//         // }
//         console.log(`Connected to mongodb ${connection.name}`)
//     })
//     .catch(err=>{
//         console.log(err);
//     });

// }
// main();



// FirebaseApp.getFirebaseAppInstance();
// findUser();