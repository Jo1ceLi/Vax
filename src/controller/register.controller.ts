import bcrypt from 'bcrypt';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { MongoRepository } from 'typeorm';
import { People } from '../Entity/People';
import { User } from '../Entity/User';
import { Context } from 'koa';

@Service()
class RegisterController
{
    @InjectRepository(User)
    private userRepo: MongoRepository<User>;
    @InjectRepository(People)
    private pplRepo: MongoRepository<People>;
    constructor(@InjectRepository(User) userRepo: MongoRepository<User>,@InjectRepository(People) pplRepo: MongoRepository<People>) {
        this.userRepo = userRepo;
        this.pplRepo = pplRepo;
    }
    async register(ctx, next) {
        let { id, email, password } = ctx.request.body;
        try {
            const ppl = await this.pplRepo.findOneOrFail({id});
            const cryptedPasswrod = bcrypt.hashSync(password, 1);
            const user = await this.userRepo.save(this.userRepo.create(
            {
                id, email, password: cryptedPasswrod
            }));
            ctx.body = `Create successful: ${user.id}`;
        }
        catch (err) {
            ctx.throw(err.message);
        }
    }
}
export {RegisterController};