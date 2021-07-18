import Router from "koa-router";
import { getAvaliableReserveTimeByHospitalId, getAvaliableHospital } from "../service/reserve.service";

var router = new Router({
    prefix: `/reserve`
});
router
    .get('/', getAvaliableHospital)
    .get('/:hospitalId', getAvaliableReserveTimeByHospitalId)


const reserveRoute = router.routes();

export { reserveRoute }