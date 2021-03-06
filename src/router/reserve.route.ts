import { Service, Inject, Container } from 'typedi';
import { AuthService } from './../service/auth/auth.service';
import Router from "koa-router";
import { ReserveController } from "../controller/reserve.controller";
import { ReserveService } from "../service/reserve.service";

@Service()
class ReserveRoute {
    authService: AuthService;
    reserveService: ReserveService;
    router: Router;
    reserveControllers: ReserveController;
    constructor(authService: AuthService, reserveController: ReserveController) {
        this.authService = authService;
        this.reserveControllers = reserveController;
        this.setupRoute();
    }
    setupRoute() {
        this.router = new Router({prefix: '/reserve'});
        this.router
            .get('/', this.reserveControllers.getAvaliableHospital, 
            async (ctx, next)=>{
                await this.authService.authLogin(ctx,next);
            },
            (ctx, next)=>{
                this.authService.permitPriority([1,2,3,4,5])(ctx, next);
            })
            .get('/:hospitalId', this.reserveControllers.getAvaliableReserveTimeByHospitalId, 
            async (ctx, next)=>{
                await this.authService.authLogin(ctx,next);
            },
            (ctx, next)=>{
                this.authService.permitPriority([1,2,3,4,5])(ctx, next);
            })
            // TODO: 
            .post('/:hospitalId/:time', async(ctx, next)=>{
                console.log(ctx.params.hospitalId, ctx.params.time);
                ctx.body = `${ctx.params.hospitalId} at ${ctx.params.time}`;
                await next();
            })
    }
}
export {ReserveRoute};
