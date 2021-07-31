import { homeRoute } from './home.route';
import { Container } from 'typedi';
// import { loginRoute } from './login.route';
import { hospitalRoute } from './hospital.route';
// import { reserveRoute } from './reserve.route';

import { getManager, getMongoRepository, createConnection } from 'typeorm';
import { User } from '../Entity/User';
import { People } from '../Entity/People';
import Router from 'koa-router';


// export { homeRoute, hospitalRoute, reserveRoute } 
export { homeRoute, hospitalRoute } 