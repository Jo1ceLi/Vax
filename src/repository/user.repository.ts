import { getMongoRepository } from "typeorm";
import { User } from "../Entity/User";

let userRepo = (connStr: string = 'default') => {
    return getMongoRepository(User, connStr);    
} 

export { userRepo }

