import Router from "koa-router";
import { login, LoginService } from '../service/auth/login.service';
import { register } from '../service/auth/register.service';

var router = new Router();
router
    // .post('/signin', )
    .post('/login', login)
    .post('/register', register);

const loginRoute = router.routes();

export { loginRoute }