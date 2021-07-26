import { Priority } from './../../model/Priority';
import { userRepo as usRepo } from '../../repository/user.repository';
import { Context, Next } from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
