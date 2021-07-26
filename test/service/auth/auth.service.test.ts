import { getMongoRepository, createConnection, MongoRepository } from 'typeorm';
import { permit, authenticate } from '../../../src/service/auth/auth.service';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { userRepo } from '../../../src/repository/user.repository';
import { User } from '../../../src/Entity/User';
import jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken');

beforeAll(async ()=>{
    const dbEnvs = ['prod', 'default'];
    let mockUser = { 
        _id: '33',
        id: '22',
        email: 'gg',
        password: '**'
    } as User
    for(let env=0; env < dbEnvs.length; env++)
    {
        const conn = await createConnection(dbEnvs[env]);
        jest.spyOn(userRepo(conn.name), 'findOne').mockResolvedValue(mockUser);
    }

    const verify = jwt.verify as jest.MockedFunction<(st: string)=> Record<string, unknown> | string>;
    verify.mockReturnValue({priority: 1, id: 22});

})

describe('Mocking jwt verify and test', () => {
    const ctx = createMockContext();
    test('Testing jwt verify match {priority: 1}', ()=>{
        expect(jwt.verify('', '')).toMatchObject({priority: 1, id: 22});
    })
    test('Permit priority 1 to access', () => {
        ctx.request.headers.authorization = '12341234123';
        permit([1,2,3,4,5])(ctx, async()=>{});
        expect(ctx.state.access).toBeTruthy();
    })
    test('Priority 6 can not access', () => {
        const verify = jwt.verify as jest.MockedFunction<(st: string)=> Record<string, unknown> | string>;
        verify.mockReturnValue({priority: 6, id: 22});
        ctx.request.headers.authorization = '12341234123';
        permit([1,2,3,4,5])(ctx, async()=>{});
        expect(ctx.state.access).toBeFalsy();
    })
});

describe('Testing authenticate function works', () => {
    test('userRepo findOne return {user: `mock`}', async () => {
        const user = await userRepo().findOne();
        expect(user).toMatchObject({ 
            _id: '33',
            id: '22',
            email: 'gg',
            password: '**'
        });
    })
})
describe('Authenticate ', () => {
    test('Hit the ctx.assert ', async () => {
        let ctx = createMockContext();
        const assert = jest.spyOn(ctx, 'assert');
        await authenticate(ctx, async()=>{});
        expect(assert).toHaveBeenCalled();
    })
    test('Hit userRepo.findOne', async () => {
        let ctx = createMockContext();
        const findOne = jest.spyOn(userRepo(), 'findOne');
        await authenticate(ctx, async()=>{});
        expect(findOne).toHaveBeenCalled();
    })
    test('Check ctx.state.user value correct', async () => {
        let ctx = createMockContext();
        ctx.request.headers.authorization = 'anything'
        await authenticate(ctx, async ()=>{});
        expect(ctx.state.user).toMatchObject({ 
            _id: '33',
            id: '22',
            email: 'gg',
            password: '**'
        });
    })
})
