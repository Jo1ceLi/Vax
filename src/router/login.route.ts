import { Service } from 'typedi';
import Router from "koa-router";
import {LoginController} from "../controller/login.controller";
import { login } from '../service/auth/login.service';
import { register } from '../service/auth/register.service';
import { RegisterController } from '../controller/register.controller';

var router = new Router();
router
    .post('/login', login)
    .post('/register', register);

const loginRoute = router.routes();

export { loginRoute }

@Service()
class LoginRoute
{
    loginController: LoginController;
    registerController: RegisterController;
    router = new Router();
    constructor(loginController: LoginController, registerController: RegisterController) {
        this.loginController = loginController;
        this.registerController = registerController;
        this.router
            .post('/login', async (ctx, next)=>{
                await this.loginController.login(ctx, next);
            })
            .post('/register', async(ctx, next) => {
                await this.registerController.register(ctx, next);
                await next();
            })
    }
}
export {LoginRoute}