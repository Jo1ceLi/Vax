import { ObjectID } from 'mongodb';
import bcrypt from 'bcrypt';
import { getMongoRepository } from 'typeorm';
import { Context } from "koa";
import { Hospital } from '../Entity/Hospital';


async function getHospitalById(ctx: Context) {
    const hospitalId = ctx.params.hospitalId;
    var hospitalRepo = getMongoRepository(Hospital);
    const hospital = await hospitalRepo.aggregate([{
        $match: {
            _id: new ObjectID(hospitalId)
        }
    }]).toArray();
    
    console.log(hospital);
    ctx.body = hospital
}
async function getAllHospital(ctx: Context) {
    var hospitalRepo = getMongoRepository(Hospital);
    const hospitals = await hospitalRepo.find();
    ctx.body = hospitals;
}

export { getHospitalById, getAllHospital }