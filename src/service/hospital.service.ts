import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Context, Next } from "koa";
import { Hospital } from '../Entity/Hospital';
import { SKU } from '../Entity/SKU';


@Service()
class HospitalService
{
    private hospitalRepo: MongoRepository<Hospital>;
    private SKURepo: MongoRepository<SKU>;
    constructor(@InjectRepository(Hospital) hospitalRepo: MongoRepository<Hospital>, @InjectRepository(SKU) SKURepo: MongoRepository<SKU>){
        this.hospitalRepo = hospitalRepo;
        this.SKURepo = SKURepo;
    }
    getHospitalById = async (ctx: Context, next: Next) => {
        try {
            let hospitalId = ctx.query.hospitalId;
            let hospitals = await this.hospitalRepo.aggregate([
                {
                    $match: {
                        _id: new ObjectID(hospitalId)
                    }
                },
                {
                    $project: {
                        _id: 0,
                        // vaxStock: 0
                    }
                }
            ]).toArray();
            ctx.body = hospitals;
            await next();
        }
        catch (err) {
            ctx.throw(500);
        }
    }
    getAllHospital = async (ctx: Context, next: Next) => {
        try {
            let hospitals = await this.hospitalRepo.aggregate([
            {
                $project: {
                    vaxStock: 0
                }
            }]).toArray();
            ctx.body = hospitals;
            await next();
        }
        catch(err) {
            ctx.throw(500);
        }

    }
    allocateVax = async (ctx: Context, next: Next) => {
        let body = ctx.request.body as allocateVaxBody;
        //TODO: Check request body
        try {
            let { hospitalId, vaxName, amount } = body;
            if (amount < 0 || 
                (['az', 'bnt', 'moderna'].findIndex(vax=> vax === vaxName.toLowerCase())) === -1)
            {
                ctx.throw(400);
            }
            let hospital = await this.hospitalRepo.findOneOrFail(hospitalId);
            let index = hospital.vaxStock.findIndex( vax => {
                return vax.vaxName === vaxName
            })
            if(index === -1) {
                await this.hospitalRepo.updateOne(
                    { _id: ObjectID(hospitalId)},
                    { $push: { vaxStock: { "vaxName": vaxName, "amount": amount}}}
                    )
                ctx.state.action = 'insert';
            }
            else {
                await this.hospitalRepo.updateOne(
                    { _id: ObjectID(hospitalId), "vaxStock.vaxName": vaxName },
                    { $inc: {"vaxStock.$.amount": amount}}
                    )
                ctx.state.action = 'update'
            }
            ctx.body = `${hospital.name} got ${amount} vax of ${vaxName}!! `;
            await next();
        }
        catch(err) {
            ctx.throw(err.status)
        }
    }
    arrangeVaccinationTime = async (ctx: Context, next: Next) => {
        try
        {
            let {hospitalId, vaxName, amount, date, time} = ctx.request.body as arrangeVaccinationTimeBody;
            let hospital = await this.hospitalRepo.findOne(hospitalId);
            if(!hospital) ctx.throw(400, `Not having this hospital`);
            if(hospital.vaxStock.length <= 0) {
                ctx.state.vaxStock = false;
                ctx.throw(500, `Can't find vax`);
            }
            else{
                ctx.state.vaxStock = true;
                let incProperty = this.vaxPropertySelector(vaxName, amount);
                let res = await this.SKURepo.findOneAndUpdate(
                {   hospital_id: ObjectID(hospitalId),
                    date: new Date(date),
                    periods: {$elemMatch: {time: new Date(`${date}T${time}Z`)}}}, 
                incProperty,
                {arrayFilters: [{"elem.time": new Date(`${date}T${time}Z`)}]} as any
                );
                if(!res.lastErrorObject.updatedExisting){
                    ctx.throw(400, 'SKU not existed');  
                } 
                ctx.state.finished = true;
            }
            ctx.body = `hello`
        }
        catch(err)
        {
            ctx.throw(err.status, err.message);
        }
    }
    private vaxPropertySelector (vaxName: string, amount: number): vaxIncProperty
    {
        let incProperty: vaxIncProperty;
        switch (vaxName) {
            case 'az':
                incProperty = {$inc: {"periods.$[elem].az_stock": amount}};
                break;
            case 'bnt':
                incProperty = {$inc: {"periods.$[elem].bnt_stock": amount}};    
                break;
            case 'moderna':
                incProperty = {$inc: {"periods.$[elem].moderna_stock": amount}}
                break;
            default:
                incProperty = {};
                break;
        }
        return incProperty;
    }
}
export { HospitalService };

type allocateVaxBody = {
    hospitalId: string,
    vaxName: string,
    amount: number
}

type arrangeVaccinationTimeBody = {
    hospitalId: string,
    vaxName: string,
    amount: number,
    date: string;
    time?: string;
}

type vaxIncProperty = object;