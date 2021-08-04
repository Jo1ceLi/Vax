import { Service } from 'typedi';
import { Context, Next } from 'koa';
import { HospitalService } from './../service/hospital.service';

@Service()
class HospitalController {
    private hospitalService: HospitalService;
    constructor(hospitalService: HospitalService) {
        this.hospitalService = hospitalService;
    }
    getHospitalById = async (ctx: Context, next: Next) => {
        await this.hospitalService.getHospitalById(ctx, next);
    }
    getAllHospital = async (ctx: Context, next: Next) => {
        await this.hospitalService.getAllHospital(ctx, next);
    }
    allocateVax = async (ctx: Context, next: Next) => {
        await this.hospitalService.allocateVax(ctx, next);
    }
}

export { HospitalController }