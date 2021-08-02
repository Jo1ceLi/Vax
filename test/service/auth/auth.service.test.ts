import { mock } from 'jest-mock-extended';
import { AuthService } from '../../../src/service/auth/auth.service';
import { Container } from 'typeorm-typedi-extensions';
import { createConnection, useContainer, MongoRepository } from 'typeorm';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { User } from '../../../src/Entity/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
jest.mock('jsonwebtoken');

beforeAll(async ()=>{
    useContainer(Container);
    await createConnection();
    const verify = jwt.verify as jest.MockedFunction<(st: string)=> Record<string, unknown> | string>;
    verify.mockReturnValue({priority: 1, id: 22});
})

describe('Auth service ', () => {
    test('Test jwt verify mocked', async ()=> {
        let decoded = jwt.verify('', '') as JwtPayload;
        expect(decoded).toMatchObject({priority: 1, id: 22});
    });
    test('Test authLogin next function been called', async ()=> {
        const mockUserRepo = mock<MongoRepository<User>>();
        let mockedUser: User = {
            id: '1',
            email: "ms",
            password: ""
        }
        mockUserRepo.findOneOrFail.mockResolvedValue(mockedUser);
        let authService = new AuthService(mockUserRepo);
        let ctx = createMockContext();
        ctx.request.headers.authorization = '12341234123';
        let next = jest.fn();
        await authService.authLogin(ctx,next)
        expect(next).toBeCalled();
    });
    test('Test permitPriority priority passed', async () => {
        let authService = Container.get(AuthService);
        let ctx = createMockContext();
        ctx.request.headers.authorization = '123412341';
        let next = jest.fn(async()=>{});
        authService.permitPriority([1])(ctx, next);
        expect(ctx.state.access).toBeDefined();
        expect(ctx.state.access).toBeTruthy();
    })
})