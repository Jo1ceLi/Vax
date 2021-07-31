import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { MongoRepository } from 'typeorm';
import { People } from '../Entity/People';
import { User } from '../Entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Service()
class LoginController
{
    @InjectRepository(User)
    private userRepo: MongoRepository<User>;
    @InjectRepository(People)
    private pplRepo: MongoRepository<People>;
    constructor(@InjectRepository(User) userRepo: MongoRepository<User>,@InjectRepository(People) pplRepo: MongoRepository<People>) {
        this.userRepo = userRepo;
        this.pplRepo = pplRepo;
    }
    async login(ctx, next) {
        await next();
        try {
            let { email, password } = ctx.request.body;
            const user = await this.userRepo.findOneOrFail({email});
            if (bcrypt.compareSync(password, user!.password)) {
                let ppl = await this.pplRepo.findOneOrFail({id: user.id});
                let token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        priority: ppl?.priority
                    }, 'secret', {expiresIn: 600000});
                ctx.body = `Successful login please use this token:\n${token}`;
            }
            else {
                ctx.body = `Incorrect password`;
            }
            
        }
        catch (err) {
            ctx.throw(err.message);
        }
    }
}
export {LoginController};