import { Hospital } from '../Entity/Hospital';
import { SKU } from './../Entity/SKU';
import { getMongoRepository } from "typeorm";
import { ObjectID } from 'mongodb';
import { Period } from '../Entity/Period';
import { Context } from 'koa';
import { time } from 'console';

export async function insertSKU(ctx: Context) {
    const skuRepo = getMongoRepository(SKU);
    const date = '2021-07-24';
    var startTime = new Date(date+'T06:00:00Z');

    for(let times=0; times < 5; times++) {
        var periods: Period[] = [];
        for(let i = 0; i<24; i++) {
            var period = new Period();
            period.time = startTime;
            period.az_reservation_quota = Math.floor(Math.random() * 10);
            period.bnt_reservation_quota = Math.floor(Math.random() * 10);
            period.moderna_reservation_quota = Math.floor(Math.random() * 10);
            period.az_stock = Math.floor(Math.random() * 10) + period.az_reservation_quota;
            period.bnt_stock = Math.floor(Math.random() * 10) + period.bnt_reservation_quota;
            period.moderna_stock = Math.floor(Math.random() * 10) + period.moderna_reservation_quota;
            period.time = new Date(startTime.setMinutes(startTime.getMinutes() + 30 * i ));
            startTime = new Date(date + 'T06:00:00Z');
            periods.push(period);
        }
        const ramdomId = ids[Math.floor(Math.random()*(10-times))];
        ids.splice(ids.indexOf(ramdomId), 1);
        console.log(ramdomId);
        const sku = await skuRepo.save({
            hospital_id: new ObjectID(ramdomId),
            date: new Date(date),
            periods
        })
    }
    
    
    ctx.body = `Created x times`;
}

export async function insertHospital() {
    const hospitalRepo = getMongoRepository(Hospital);
    for (let i = 0; i < tels.length; i++) {
        const hos = await hospitalRepo.save(
            hospitalRepo.create({
                name: names[i],
                city: cities[i],
                district: disincts[i],
                tel: tels[i]
            })
        )
        console.log(`Hosptial ${hos.name} inserted!`);
    }
}

var ids = ["60ed2ea46748c0a21cf78f61",
"60f26c10aef5e5a65d983371",
"60f26c10aef5e5a65d983372",
"60f26c10aef5e5a65d983373",
"60f26c10aef5e5a65d983374",
"60f26c10aef5e5a65d983375",
"60f26c10aef5e5a65d983376",
"60f26c10aef5e5a65d983377",
"60f26c10aef5e5a65d983378",
"60f26c10aef5e5a65d983379"
]

const cities = ["臺北市",
    "臺北市",
    "臺北市",
    "臺北市",
    "臺北市",
    "臺北市",
    "臺北市",
    "新北市",
    "臺中市",
    "臺中市",
    "臺中市",
    "彰化縣",
    "臺南市",
    "臺南市",
    "高雄市",
    "高雄市",
    "高雄市",
    "花蓮縣" 
]

const names = ["三軍總醫院附設民眾診療服務處及其汀州院區",
    "臺北榮民總醫院",
    "長庚醫療財團法人台北長庚紀念醫院 長庚醫療財團法人林口長庚紀念醫院",
    "國泰醫療財團法人國泰綜合醫院 國泰醫療財團法人汐止國泰綜合醫院(僅精神科)",
    "台灣基督長老教會馬偕醫療財團法人馬偕紀念醫院 台灣基督長老教會馬偕醫療財團法人淡水馬偕紀念醫院",
    "新光醫療財團法人新光吳火獅紀念醫院",
    "臺北市立萬芳醫院－委託財團法人臺北醫學大學辦理",
    "醫療財團法人徐元智先生醫藥基金會亞東紀念醫院",
    "臺中榮民總醫院",
    "中山醫學大學附設醫院",
    "中國醫藥大學附設醫院",
    "彰化基督教醫療財團法人彰化基督教醫院及其中華路院區",
    "國立成功大學醫學院附設醫院",
    "奇美醫療財團法人奇美醫院及其台南分院",
    "高雄榮民總醫院",
    "長庚醫療財團法人高雄長庚紀念醫院",
    "財團法人私立高雄醫學大學附設中和紀念醫院",
    "佛教慈濟醫療財團法人花蓮慈濟醫院"
]

const disincts = ["內湖區",
    "北投區",
    "松山區",
    "大安區",
    "中山區",
    "士林區",
    "文山區",
    "板橋區",
    "西屯區",
    "南區",
    "北區",
    "彰化市",
    "北區",
    "永康區",
    "左營區",
    "鳥松區",
    "三民區",
    "花蓮市",
]

const tels = ["02-87923311",
    "02-28712121",
    "02-27135211",
    "02-27082121",
    "02-25433535",
    "02-28332211",
    "02-29307930",
    "02-89667000",
    "04-23592525",
    "04-24739595",
    "04-22052121",
    "04-7238595",
    "06-2353535",
    "06-2812811",
    "07-3422121",
    "07-7317123",
    "07-3121101",
    "03-8561825"
]