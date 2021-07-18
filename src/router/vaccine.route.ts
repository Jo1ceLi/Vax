import Router from "koa-router";
import { insertHospital, insertSKU } from '../service/insertSKU.service';
import { getHospitalById } from "../service/hospital.service";
import { Context } from "koa";
import { getMongoRepository } from "typeorm";
import { ObjectId } from 'mongodb';
import { SKU } from "../Entity/SKU";

var router = new Router();
// router
    // .get('/reserve/:hospitalId', async (ctx: Context) => {
    //     const hospitalId = ctx.params.hospitalId;
    //     const skuRepo = getMongoRepository(SKU);
    //     const sku = await skuRepo.aggregate([
    //         {
    //             $match: {
    //                 hospital_id: new ObjectId(hospitalId)
    //             }
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 date: 1,
    //                 time: 1
    //             }
    //         }
    //     ]).toArray();
    //     ctx.body = sku;
    // })
    // .get('/:hospitalId/:date', insertHospital)

const vaccineRoute = router.routes();

export { vaccineRoute }