import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { Priority } from './../../model/Priority';
import { userRepo as usRepo } from '../../repository/user.repository';
import { Context, Next } from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../../Entity/User';

@Service()
class AuthService
{
    @InjectRepository(User)
    private userRepo: MongoRepository<User>;
    constructor(@InjectRepository(User) userRepo: MongoRepository<User>){
        this.userRepo = userRepo;
    }
    authLogin = async (ctx: Context, next) => {
        ctx.assert(ctx.request.headers.authorization, 401);
        let token = ctx.request.headers.authorization;
        try {
            let decoded = jwt.verify(token!, 'secret') as JwtPayload;
            let user = await this.userRepo.findOneOrFail({id: decoded.id});
            ctx.state.user_id = user.id;
            console.log('You could pass')
            await next();
        }
        catch (err) {
            ctx.throw(err.message);
        }
    }
    permitPriority = (allowedPriorities: Priority[]) => {
        return (ctx: Context, next: Next) =>{
            let token = ctx.request.headers.authorization;
            if (token) {
                ctx.state.access = false;
                let decoded = jwt.verify(token, 'secret') as JwtPayload;
                if(allowedPriorities.includes(decoded.priority)) {
                    ctx.state.access = true;
                    console.log(`Pass the priority check`)
                }
            }
            ctx.assert.equal(ctx.state.access, true, 401);
        } 
    }
}
export {AuthService};
let authenticate = async (ctx: Context, next: Next) => {
    try {
        let token = ctx.request.headers.authorization;
        if (token) {
            let decoded = jwt.verify(token, 'secret') as JwtPayload;
            let userRepo = usRepo('prod');
            // let userRepo = getMongoRepository(User);
            let user = await userRepo.findOne({id: decoded.id});
            ctx.state.user = user;
        }
        ctx.assert(ctx.state.user, 401);
        await next();
    }
    catch(err) {
        ctx.status = 401;
    }
}

let permit = (allowedPriorities: Priority[]) => {
    return async(ctx: Context, next: Next) =>{
        let token = ctx.request.headers.authorization;
        if (token) {
            ctx.state.access = false;
            let decoded = jwt.verify(token, 'secret') as JwtPayload;
            if(allowedPriorities.includes(decoded.priority)) {
                ctx.state.access = true;
            }
        }
        ctx.assert.equal(ctx.state.access, true, 401);
        await next();
    }
}
export { authenticate, permit };
