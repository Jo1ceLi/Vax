import { mock } from 'jest-mock-extended';
import { Container as container } from 'typedi'; 
import { Container } from 'typeorm-typedi-extensions';
import { HospitalService } from '../../src/service/hospital.service';
import { createConnection, useContainer, MongoRepository, UpdateWriteOpResult, FindAndModifyWriteOpResultObject } from 'typeorm';
import { Hospital } from '../../src/Entity/Hospital';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { SKU } from '../../src/Entity/SKU';


beforeAll(async ()=>{
    useContainer(Container);
    await createConnection();
})

describe('Arrange Vaccine time test ', () => {
    let mockHospitalRepo = mock<MongoRepository<Hospital>>();
    let mockSKURepo = mock<MongoRepository<SKU>>();
    let hospitalService = new HospitalService(mockHospitalRepo, mockSKURepo);
    let mockHospital0: Hospital = {
        city: 'mockCity',
        district: 'mockDis',
        name: 'mockName',
        tel: 'mockTel',
        vaxStock: [],
        _id: 'mockId'
    };
    let mockHospital1: Hospital = {
        city: 'mockCity',
        district: 'mockDis',
        name: 'mockName',
        tel: 'mockTel',
        vaxStock: [{
            vaxName: 'AZ',
            amount: 10
        }],
        _id: 'mockId'
    };
    let mockFindAndModifyWriteOpResultObject: FindAndModifyWriteOpResultObject = {
        lastErrorObject: {
            updatedExisting: true
        },
        ok: 1
    };
    mockHospitalRepo.findOne
        .mockResolvedValueOnce(mockHospital0)
        .mockResolvedValueOnce(mockHospital1);
    mockSKURepo.findOneAndUpdate
        .mockResolvedValue(mockFindAndModifyWriteOpResultObject)
    
    test('Arrange without vax', async()=>{
        let ctx = createMockContext();
        ctx.request.body = {hospitalId: '1', vaxName: 'az', amount: '20', date: '', time: ''};

        let spyCtxThrow = jest.spyOn(ctx, 'throw');
        let next = jest.fn();
        await hospitalService.arrangeVaccinationTime(ctx, next);
        expect(mockHospitalRepo.findOne).toBeCalled();
        expect(ctx.state.vaxStock).toBeFalsy();
        expect(spyCtxThrow).toBeCalled();
    })
    test('Arrange with vax and called next fn', async()=>{
        let ctx = createMockContext();
        ctx.request.body = {hospitalId: '123456789123', vaxName: 'az', amount: '20', date: '', time: ''};
        let spyCtxThrow = jest.spyOn(ctx, 'throw');
        let next = jest.fn();
        await hospitalService.arrangeVaccinationTime(ctx, next);
        expect(mockHospitalRepo.findOne).toBeCalled();
        expect(ctx.state.vaxStock).toBeTruthy();
        expect(spyCtxThrow).not.toBeCalled();
        expect(ctx.state.finished).toBeTruthy();
        expect(ctx.body).toBe('hello');
    })
})
describe('allocateVax test', () => {
    let mockHospitalRepo = mock<MongoRepository<Hospital>>();
    let mockSKURepo = mock<MongoRepository<SKU>>();
    let hospitalService = new HospitalService(mockHospitalRepo, mockSKURepo);
    let mockHospital: Hospital = 
    {
        city: 'ti',
        district: 'di',
        name: 'na',
        tel: '09',
        vaxStock: [{
            vaxName: 'az',
            amount: 1
        }],
        _id: '11'
    }
    let mockUpdateWriteOpResult = mock<UpdateWriteOpResult>();
    mockHospitalRepo.findOneOrFail.mockResolvedValue(mockHospital);
    // mockHospitalRepo.updateOne.mockImplementation();
    mockHospitalRepo.updateOne.mockResolvedValue(mockUpdateWriteOpResult);
    let mockHosRepoUpdate = jest.spyOn(mockHospitalRepo, 'updateOne');
    test('allocate vax with wrong vaxName', async()=>{
        let ctx = createMockContext();
        ctx.request.body = { hospitalId: '123456789456', vaxName: 'azz', amount: 99 };
        let spyCtxThrow = jest.spyOn(ctx, 'throw');
        let next = jest.fn();
        await hospitalService.allocateVax(ctx, next);
        expect(spyCtxThrow).toBeCalled();
    })
    test('allocate vax with correct and existed vaxName', async()=>{
        let ctx = createMockContext();
        ctx.request.body = { hospitalId: '123456789456', vaxName: 'az', amount: 99 };
        let spyCtxThrow = jest.spyOn(ctx, 'throw');
        
        let next = jest.fn();
        await hospitalService.allocateVax(ctx, next);
        expect(mockHospitalRepo.findOneOrFail).toBeCalled();
        expect(mockHosRepoUpdate).toBeCalled();
        expect(spyCtxThrow).not.toBeCalled();
        expect(next).toBeCalled();
        expect(ctx.state.action).toBe(`update`);
    })
    test('allocate vax with correct but not existed vaxName', async()=>{
        let ctx = createMockContext();
        ctx.request.body = { hospitalId: '123456789456', vaxName: 'moderna', amount: 99 };
        let spyCtxThrow = jest.spyOn(ctx, 'throw');
        
        let next = jest.fn();
        await hospitalService.allocateVax(ctx, next);
        expect(mockHospitalRepo.findOneOrFail).toBeCalled();
        expect(mockHosRepoUpdate).toBeCalled();
        expect(spyCtxThrow).not.toBeCalled();
        expect(next).toBeCalled();
        expect(ctx.state.action).toBe(`insert`);
    })
})
describe('getAllHospital Test', () => {
    let mockHospitalRepo = mock<MongoRepository<Hospital>>();
    let mockSKURepo = mock<MongoRepository<SKU>>();
    let hospitalService = new HospitalService(mockHospitalRepo, mockSKURepo);
    let spyOnAggregate = jest.spyOn(mockHospitalRepo, 'aggregate');
    test('Testing hospital aggregate been called', async ()=>{
        let ctx = createMockContext();
        let next = jest.fn();
        await hospitalService.getAllHospital(ctx, next);
        expect(spyOnAggregate).toBeCalled();
    })
})
describe('getHospitalById Test', () => {
    let mockHospitalRepo = mock<MongoRepository<Hospital>>();
    let mockSKURepo = mock<MongoRepository<SKU>>();
    let hospitalService = new HospitalService(mockHospitalRepo, mockSKURepo);
    let spyOnAggregate = jest.spyOn(mockHospitalRepo, 'aggregate');
    test('Testing hospital aggregate been called', async()=>{
        let ctx = createMockContext();
        ctx.query.hospitalId = '1234';
        let next = jest.fn();
        await hospitalService.getHospitalById(ctx, next);
        expect(ctx.query.hospitalId).toBeDefined();
        expect(spyOnAggregate).toBeDefined();
    })
})
describe('vaxPropertySelector Test', () => {
    let mockHospitalRepo = mock<MongoRepository<Hospital>>();
    let mockSKURepo = mock<MongoRepository<SKU>>();
    let hospitalService = new HospitalService(mockHospitalRepo, mockSKURepo);
    let hospitalSvcProto = Object.getPrototypeOf(hospitalService);
    test('using vaxName = az, amount = 5', ()=>{
        let property = hospitalSvcProto.vaxPropertySelector("az", 5);
        expect(property).toMatchObject({$inc: {"periods.$[elem].az_stock": 5}});
    })
    test('using vaxName = zzz, amount = 5', ()=>{
        let property = hospitalSvcProto.vaxPropertySelector("az", 5);
        expect(property).toMatchObject({});
    })
    
})