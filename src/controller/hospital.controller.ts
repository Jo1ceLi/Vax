import { Service } from 'typedi';
import { Context, Next } from 'koa';
import { HospitalService } from './../service/hospital.service';
import { AuthService } from '../service/auth/auth.service';
import { Role } from '../Entity/User';
@Service()
class HospitalController {
    private hospitalService: HospitalService;
    private authService: AuthService;
    constructor(hospitalService: HospitalService, authService: AuthService) {
        this.hospitalService = hospitalService;
        this.authService = authService;
    }
    getHospitalById = async (ctx: Context, next: Next) => {
        await this.hospitalService.getHospitalById(ctx, next);
    }
    getAllHospital = async (ctx: Context, next: Next) => {
        await this.hospitalService.getAllHospital(ctx, next);
    }
    allocateVax = async (ctx: Context, next: Next) => {
        this.authService.authRole([Role.Admin, Role.GovernmentSupervisor])(ctx, next);
        await this.hospitalService.allocateVax(ctx, next);
    }
}

export { HospitalController }