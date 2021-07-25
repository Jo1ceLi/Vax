import Router from "koa-router";
import { authenticate, permit } from "../service/auth/auth.service"; 
import { BaseController } from "../controller/base.controller";
import { ReserveController } from "../controller/reserve.controller";
import { IReserveService, ReserveService } from "../service/reserve.service";
import { Priority } from "../model/Priority";

class ReserveRoute {
    reserveService: IReserveService;
    router: Router;
    reserveControllers: ReserveController;
    constructor() {
        this.reserveControllers = new ReserveController();
        this.setupRoute();
    }
    setupRoute() {
        this.router = new Router({prefix: '/reserve'});
        this.router
            .get('/', permit([1,2,3,4,5]), authenticate, this.reserveControllers.getAvaliableHospital)
            .get('/:hospitalId', this.reserveControllers.getAvaliableReserveTimeByHospitalId)
            .post('/:hospitalId/:time', async(ctx, next)=>{
                console.log(ctx.params.hospitalId, ctx.params.time);
                ctx.body = `${ctx.params.hospitalId} at ${ctx.params.time}`;
                await next();
            })
    }
}
const reserveRoute = new ReserveRoute().router.routes()
export { reserveRoute }