import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Context, Next } from "koa";
import { Hospital } from '../Entity/Hospital';


@Service()
class HospitalService
{
    private hospitalRepo: MongoRepository<Hospital>;
    constructor(@InjectRepository(Hospital) hospitalRepo: MongoRepository<Hospital>){
        this.hospitalRepo = hospitalRepo;
    }
    getHospitalById = async (ctx: Context, next: Next) => {
        try {
            let hospitalId = ctx.params.hospitalId;
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
            }
            else {
                await this.hospitalRepo.updateOne(
                    { _id: ObjectID(hospitalId), "vaxStock.vaxName": vaxName },
                    { $inc: {"vaxStock.$.amount": amount}}
                )
            }
            ctx.body = `${hospital.name} got ${amount} vax of ${vaxName}!! `;
            await next();
        }
        catch(err) {
            ctx.throw(err.status)
        }
    }
}
export { HospitalService };

type allocateVaxBody = {
    hospitalId: string,
    vaxName: string,
    amount: number
}