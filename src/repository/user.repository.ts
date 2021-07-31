import { InjectRepository } from 'typeorm-typedi-extensions';
import { getMongoRepository, MongoRepository } from "typeorm";
import { People } from "../Entity/People";
import { User } from "../Entity/User";

let userRepo = (connStr: string = 'default') => {
    return getMongoRepository(User, connStr);    
} 
let pplRepo = (connStr: string = 'default') => {
    return getMongoRepository(People, connStr);    
} 

export { userRepo, pplRepo }

