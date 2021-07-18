import { Period } from '../../Entity/Period';
import { ObjectID } from 'mongodb';
import { SKU } from './../../Entity/SKU';
import { getMongoManager, getMongoRepository, getRepository, Repository } from 'typeorm';
import { Context, Next } from "koa";
import { User } from '../../Entity/User';
import { People } from '../../Entity/People';

async function login(ctx: Context) {
    var body: LoginInput = JSON.parse(ctx.request.rawBody);
    const { email, password } = body;
    const userRepository = getRepository(User);

    ctx.body = `Successful created sku `

}

interface LoginInput 
{
    email: string;
    password: string;
}

export { login }