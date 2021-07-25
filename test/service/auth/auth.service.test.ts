import jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken');
import { isOne } from '../../../src/service/auth/isOne.service'



const verify = jwt.verify as jest.MockedFunction<(st: string)=> Record<string, unknown> | string>
verify.mockReturnValue({priority: 1});

// const mockIsOne = isOne as jest.MockedFunction<typeof isOne>

describe('Mocking jwt verify and test', () => {
    test('Testing jwt verify match {priority: 1}', ()=>{
        expect(jwt.verify('', '')).toMatchObject({priority: 1});
    })
});

// const mockIsOne = isOne as jest.MockedFunction<(arg0: number) => boolean>
// mockIsOne.mockImplementation((k: number) => {
//     return k ===3
// })
// isOne.


// test('JWT payload priority equal 1', () => {
//     // console.log(isOne()(1) === true)
//     // expect(isOne()(3)).toBeFalsy();
//     // expect(isOne()(1)).toBeTruthy();
//     expect(isOne()(3)).toBeTruthy();
// })
