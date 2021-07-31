import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { Context, Next } from "koa";
import { MongoRepository } from "typeorm";
import { SKU } from "../Entity/SKU";
import { ObjectId } from 'mongodb';


export interface IReserveService
{
    todayZeroClock: Date;
    now: number;
    utc8Now: Date;

    getAvaliableReserveTimeByHospitalId(ctx: Context)
    getAvaliableHospital(ctx: Context, next: Next)
}
@Service()
export class ReserveService {
    private dateTimeMetaData: DatetimeMetaData = {numberOfNowUTCHour: 0, utc8Now: new Date(), todayZeroClock: new Date()};

    @InjectRepository(SKU)
    private skuRepo: MongoRepository<SKU>
    constructor(@InjectRepository(SKU) skuRepo: MongoRepository<SKU>) {
        this.skuRepo = skuRepo;
        this.updateMetadata();
    }
    private updateMetadata = () => {
        this.dateTimeMetaData.todayZeroClock = new Date(new Date().toISOString().substring(0, 10));
        this.dateTimeMetaData.numberOfNowUTCHour = new Date().getUTCHours();
        this.dateTimeMetaData.utc8Now = new Date(new Date().setUTCHours(this.dateTimeMetaData.numberOfNowUTCHour + 8));
    }
 
    getAvaliableHospital = async (ctx: Context, next: Next) => {
        this.updateMetadata();
        const sku = await this.skuRepo.aggregate([
            {
                $match: {
                    date: {
                        $gte: this.dateTimeMetaData.todayZeroClock
                    },
                    periods: {
                        $elemMatch: {
                            $and:[{
                                $or:[
                                    {
                                        moderna_reservation_quota: {
                                            $gte: 0
                                        }
                                    },
                                    {
                                        az_reservation_quota: {
                                            $gt: 0
                                        }
                                    },
                                    {
                                        bnt_reservation_quota: {
                                            $gt: 0
                                        }
                                    }]
                                },
                                {
                                    time: {
                                        $gt: this.dateTimeMetaData.utc8Now
                                    }
                                }]
                                
                            }
                    }
                }
            },
            {
                $group: {
                    _id: '$hospital_id',
                    dates: {
                        $push: '$date'
                    }
                }
            },
            {
                $lookup: {
                    from: "hospital",
                    localField: "_id",
                    foreignField: "_id",
                    as: "hospital_detail"
                }
            },
            {
                $unwind: '$hospital_detail'
            },
            {
                $project: {
                    hospital_name: '$hospital_detail.name',
                    hospital_detail: 1,
                    dates: 1,
                }
            },
            {
                $unset: ['hospital_detail.name', '_id']
            },
        ]).toArray();
        ctx.body = sku;
    }

    getAvaliableReserveTimeByHospitalId = async (ctx: Context) => {
        this.updateMetadata();
        const hospitalId = ctx.params.hospitalId;
        const sku = await this.skuRepo.aggregate([
            {
                $match: {
                    date: {
                        $gte: this.dateTimeMetaData.todayZeroClock
                    },
                    hospital_id: new ObjectId(hospitalId),
                    periods: {
                        $elemMatch: {
                            $or:[
                            {
                                moderna_reservation_quota: {
                                    $gte: 0
                                }
                            },
                            {
                                az_reservation_quota: {
                                    $gt: 0
                                }
                            },
                            {
                                bnt_reservation_quota: {
                                    $gt: 0
                                }
                            }]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    "periods.time": 1,
                    "periods.az_reservation_quota": 1,
                    "periods.bnt_reservation_quota": 1,
                    "periods.moderna_reservation_quota": 1,
                }
            },
            {
                $unwind: "$periods"
            },
            {
                $match: {
                    'periods.time': {
                        $gt: this.dateTimeMetaData.utc8Now
                    }
                }
            },
            {
                $group: {
                    _id: '$date',
                    times: {
                        $push: '$periods'
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    times: 1
                }
            },          
        ]).toArray();
        ctx.body = sku;
    }
}
interface DatetimeMetaData
{
    todayZeroClock: Date;
    numberOfNowUTCHour: number;
    utc8Now: Date;
}