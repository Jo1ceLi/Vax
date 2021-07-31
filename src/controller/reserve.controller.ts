import { Context, Next } from 'koa';
import { ReserveService } from './../service/reserve.service';
import { IReserveService } from "../service/reserve.service";
import { BaseController } from './base.controller';
import { authenticate } from './../service/auth/auth.service'; 


export class ReserveController {
    reserveService: IReserveService;
    constructor(reserveService?: IReserveService) {
        this.reserveService = new ReserveService();
        if(reserveService) {
            this.reserveService = reserveService;
        }
    }
    
    getAvaliableHospital = async (ctx: Context, next: Next) => {
        await next();
        await this.reserveService.getAvaliableHospital(ctx, next);
    }
    getAvaliableReserveTimeByHospitalId = async (ctx: Context) => {
        await this.reserveService.getAvaliableReserveTimeByHospitalId(ctx);
    }
}