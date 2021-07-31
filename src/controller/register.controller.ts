
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { MongoRepository } from 'typeorm';
import { People } from '../Entity/People';
import { User } from '../Entity/User';

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
        const ppl = await this.pplRepo.find({});
        ctx.body = ppl;
    }
}
export {RegisterController};