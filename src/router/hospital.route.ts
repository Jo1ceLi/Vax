import Router from "koa-router";
import { insertHospital, insertSKU } from '../service/insertSKU.service';
import { getHospitalById, getAllHospital } from "../service/hospital.service";
import { getAvaliableReserveTimeByHospitalId, getAvaliableHospital } from "../service/reserve.service";
import { Context } from "koa";
import { getMongoRepository } from "typeorm";
import { ObjectId } from 'mongodb';
import { SKU } from "../Entity/SKU";

var router = new Router({
    prefix: '/hospital'
});
router
// .get('/insertHospital', insertHospital)    testing
    .get('/insertTime', insertSKU)             //testing

    .get('/', getAllHospital)
    .get('/:hospitalId', getHospitalById)

const hospitalRoute = router.routes();

export { hospitalRoute }