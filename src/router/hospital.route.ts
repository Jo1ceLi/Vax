import { Service } from 'typedi';
import Router from "koa-router";
// import { insertHospital, insertSKU } from '../service/insertSKU.service';
// import { getHospitalById, getAllHospital } from "../service/hospital.service";
import { HospitalController } from "../controller/hospital.controller";

// var router = new Router({
//     prefix: '/hospital'
// });
// router
//     // .get('/insertHospital', insertHospital)    //testing
//     .get('/insertTime', insertSKU)             //testing

//     .get('/', getAllHospital)
//     .get('/:hospitalId', getHospitalById)

// const hospitalRoute = router.routes();

// export { hospitalRoute }

@Service()
class HospitalRoute
{
    router: Router;
    hospitalController: HospitalController;
    constructor(hospitalController: HospitalController){
        this.hospitalController = hospitalController;
        this.setupRoute();
    }
    private setupRoute() {
        this.router = new Router({prefix: '/hospital'});
        this.router
            .get('/', this.hospitalController.getAllHospital)
            .post('/allocateVax', this.hospitalController.allocateVax)
            .get('/:hospitalId', this.hospitalController.getHospitalById)
    }
}
export { HospitalRoute }