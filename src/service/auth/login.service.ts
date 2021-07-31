import { getMongoRepository } from 'typeorm';
import { Context } from "koa";
import { User } from '../../Entity/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { People } from '../../Entity/People';

async function login(ctx: Context) {
    var body: LoginInput = JSON.parse(ctx.request.rawBody);
    const { email, password } = body;
    const userRepository = getMongoRepository(User);
    const pplRepo = getMongoRepository(People);
    const user = await userRepository.findOne({email});
    if (user) {
        if(bcrypt.compareSync(password, user!.password)) {
            let ppl = await pplRepo.findOne({id: user.id});
            ctx.state.user = user;
            ctx.state.ppl = ppl;
            if(ppl) {
                let token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        priority: ppl?.priority
                    }, 'secret', {expiresIn: 60});
                ctx.state.token = token;
                ctx.body = `Successful login please use this token: \n ${token}`;
            }
        }
    }
    ctx.assert(ctx.state.token, 401);
}

interface LoginInput 
{
    email: string;
    password: string;
}

export { login }