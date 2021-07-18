import Router from "koa-router";
import { login } from '../service/auth/login.service';
import { register } from '../service/auth/register.service';

var router = new Router();
router
    .post('/login', login)
    .post('/register', register);

const loginRoute = router.routes();

export { loginRoute }