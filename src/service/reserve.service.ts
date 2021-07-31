import { Context, Next } from "koa";
import { getMongoRepository } from "typeorm";
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

export class ReserveService implements IReserveService {
    todayZeroClock: Date;
    now: number;
    utc8Now: Date;

    constructor() {
        this.updateMetadata();
    }
    private updateMetadata = () => {
        this.todayZeroClock = new Date(new Date().toISOString().substring(0, 10));
        this.now = new Date().getUTCHours();
        this.utc8Now = new Date(new Date().setUTCHours(this.now+8));
    }
 
    getAvaliableHospital = async (ctx: Context, next: Next) => {
        this.updateMetadata();
        const skuRepo = getMongoRepository(SKU);
        const sku = await skuRepo.aggregate([
            {
                $match: {
                    date: {
                        $gte: this.todayZeroClock
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
                                        $gt: this.utc8Now
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
        const skuRepo = getMongoRepository(SKU);
        const sku = await skuRepo.aggregate([
            {
                $match: {
                    date: {
                        $gte: this.todayZeroClock
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
                        $gt: this.utc8Now
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

// TODO: There's no dynamic change

// let todayZeroClock = new Date(new Date().toISOString().substring(0, 10));
// let now = new Date().getUTCHours();
// let utc8Now = new Date(new Date().setUTCHours(now+8));
// export async function getAvaliableReserveTimeByHospitalId(ctx: Context) {
//         const hospitalId = ctx.params.hospitalId;
//         const skuRepo = getMongoRepository(SKU);
//         const sku = await skuRepo.aggregate([
//             {
//                 $match: {
//                     date: {
//                         $gte: todayZeroClock
//                     },
//                     hospital_id: new ObjectId(hospitalId),
//                     periods: {
//                         $elemMatch: {
//                             $or:[
//                             {
//                                 moderna_reservation_quota: {
//                                     $gte: 0
//                                 }
//                             },
//                             {
//                                 az_reservation_quota: {
//                                     $gt: 0
//                                 }
//                             },
//                             {
//                                 bnt_reservation_quota: {
//                                     $gt: 0
//                                 }
//                             }]
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     date: 1,
//                     "periods.time": 1,
//                     "periods.az_reservation_quota": 1,
//                     "periods.bnt_reservation_quota": 1,
//                     "periods.moderna_reservation_quota": 1,
//                 }
//             },
//             {
//                 $unwind: "$periods"
//             },
//             {
//                 $match: {
//                     'periods.time': {
//                         $gt: utc8Now
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$date',
//                     times: {
//                         $push: '$periods'
//                     }
//                 }
//             },

//             {
//                 $sort: {
//                     _id: 1
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     date: '$_id',
//                     times: 1
//                 }
//             },          
//         ]).toArray();
//         ctx.body = sku;
// }

// export async function getAvaliableHospital(ctx: Context) {
//     const skuRepo = getMongoRepository(SKU);
//     const sku = await skuRepo.aggregate([
//         {
//             $match: {
//                 date: {
//                     $gte: todayZeroClock
//                 },
//                 periods: {
//                     $elemMatch: {
//                         $and:[{
//                             $or:[
//                                 {
//                                     moderna_reservation_quota: {
//                                         $gte: 0
//                                     }
//                                 },
//                                 {
//                                     az_reservation_quota: {
//                                         $gt: 0
//                                     }
//                                 },
//                                 {
//                                     bnt_reservation_quota: {
//                                         $gt: 0
//                                     }
//                                 }]
//                         },
//                         {
//                             time: {
//                                 $gt: utc8Now
//                             }
//                         }]
                        
//                     }
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: '$hospital_id',
//                 dates: {
//                     $push: '$date'
//                 }
//             }
//         },
//         {
//             $lookup: {
//                 from: "hospital",
//                 localField: "_id",
//                 foreignField: "_id",
//                 as: "hospital_detail"
//             }
//         },
//         {
//             $unwind: '$hospital_detail'
//         },
//         {
//             $project: {
//                 hospital_name: '$hospital_detail.name',
//                 hospital_detail: 1,
//                 dates: 1,
//             }
//         },
//         {
//             $unset: ['hospital_detail.name', '_id']
//         },
//     ]).toArray();
//     ctx.body = sku;
// }