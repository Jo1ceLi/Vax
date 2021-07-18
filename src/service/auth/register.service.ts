import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { Context } from "koa";
import { People } from '../../Entity/People';
import { User } from '../../Entity/User';

async function register(ctx: Context) {
    var body: RegisterInput  = JSON.parse(ctx.request.rawBody);
    const {id, email, password} = body;
    const userRepository = getRepository(User);
    const peopleRepository = getRepository(People);
    ctx.state.people = await peopleRepository.findOne({id});
    ctx.assert(ctx.state.people, 401, `People not found, please contact the gov`);
    const cryptedPassword = bcrypt.hashSync(password, 1)
    ctx.state.user = await userRepository.save(userRepository.create({
        id, email, password: cryptedPassword
    }))
    ctx.assert(ctx.state.user, 500, `Can't regisete the user`);
    ctx.body = ctx.state.user
}

interface RegisterInput
{
    id: string;
    email: string;
    password: string;
}

export { register }