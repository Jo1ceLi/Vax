import Router from "koa-router";
import { insertHospital, insertSKU } from '../service/insertSKU.service';
import { getHospitalById, getAllHospital } from "../service/hospital.service";

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