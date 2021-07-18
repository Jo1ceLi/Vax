import { Period } from '../../Entity/Period';
import { ObjectID } from 'mongodb';
import { SKU } from './../../Entity/SKU';
import { getMongoManager, getMongoRepository, getRepository, Repository } from 'typeorm';
import { Context, Next } from "koa";
import { User } from '../../Entity/User';
import { People } from '../../Entity/People';

abstract class LoginService {
    
    constructor(private userRepo: Repository<User>, private pplRepo: Repository<People>) { 
        
    }
    async signIn() {
        
    }
}

class LoginService1 extends LoginService {
    constructor() {
       super(getRepository(User), getRepository(People)); 
    }
    async signIn() {

   } 
}
async function login(ctx: Context) {
    var body: LoginInput = JSON.parse(ctx.request.rawBody);
    const { email, password } = body;
    const userRepository = getRepository(User);
    const skuRepo = getMongoRepository(SKU);
    const manager = getMongoManager();
    var period = new Period();
    // period.time = new Date('2021-07-16T06:30:00Z');
    // period.az_reservation = 99;
    // period.bnt_reservation = 65;
    // period.moderna_reservation = 55;
    // period.az_stock = 99;
    // period.bnt_stock = 65;
    // period.moderna_stock = 55;
    // console.log(period);
    let skuu = new SKU();
    skuu.hospital_id = new ObjectID('60ed2ea46748c0a21cf78f61');
    skuu.date = new Date('2021-07-16');
    skuu.periods = [period, period];
    // skuu.periods.push(period)
    console.log(skuu);
    // skuRepo.create()
    // const sku = await skuRepo.save<SKU>(skuu);
    skuRepo.update({hospital_id: '60ed2ea46748c0a21cf78f61', date: new Date('2021-07-16')}, {
        periods: [period]       
    });
    // const sku = manager.create(SKU ,skuu)
    // const sku = skuRepo.create(skuu);
    // const sku = skuRepo.create({
    //     hospital_id: new ObjectID('60ed2ea46748c0a21cf78f61'),
    //     date: new Date('2021-07-16'),
    //     periods: []
    // });
    // console.log(sku);
    // await skuRepo.save(sku);
    ctx.body = `Successful created sku `

}

interface LoginInput 
{
    email: string;
    password: string;
}

export { login, LoginService }  