import { createMocks } from 'node-mocks-http';
import register from '../../pages/api/users/register';
import authenticate from '../../pages/api/users/authenticate';
import getById from '../../pages/api/users/[id]';
import getMe from '../../pages/api/users/me';
const chance = require('chance').Chance();

const userObj = {
    email: chance.email(),
    username: chance.last() + '#' + chance.natural({ max: 9999}).toString().padStart(4, '0'),
    password: chance.word({ length: 8 })
};

let token;
let meID;
let realUser;

function mockReqRes(opts) {
    const optsDefault = { method: 'GET' };
    const { req, res } = createMocks({ ...optsDefault, ...opts});
    req.headers = {
        ...req.headers,
        'Content-Type': 'application/json',
    };

    
    return { req, res };
}

describe('/api/users/register API Endpoint', () => {
    // afterAll(jestAfterAll);

    it('should return a successful response', async () => {
        const { req, res } = mockReqRes({ method: 'POST', body: userObj, url: '/api/users/register'});
        await register(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
        expect(res._isJSON()).toBe(true);
        expect(res._getJSONData()).toHaveProperty('token');
        expect(res._getJSONData()).toHaveProperty('user');
        expect(res._getJSONData()).toHaveProperty('user.email');
        expect(res._getJSONData()).toHaveProperty('user.picture');
    });

//     it('should return a 500 error', async () => {
//         const { req, res } = mockReqRes({ method: 'POST', body: {}, url: '/api/users/register'});
//         await register(req, res);

//         expect(res.statusCode).toBe(500);
//     });

    it('should return a 405 error', async () => {
        const { req, res } = mockReqRes({ method: 'GET', path: '/api/users/register'});
        await register(req, res);

        expect(res.statusCode).toBe(405);
    });
});

describe('/api/users/authenticate API Endpoint', () => {

    it('should return a successful response', async () => {
        const { req, res } = mockReqRes({ method: 'POST', body: userObj, url: '/api/users/authenticate'});
        await authenticate(req, res);
        
        token = res._getJSONData().token;

        expect(res.statusCode).toBe(200);
        expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
        expect(res._isJSON()).toBe(true);
        expect(res._getJSONData()).toHaveProperty('token');
        expect(res._getJSONData()).toHaveProperty('user');
        expect(res._getJSONData()).toHaveProperty('user.email');
        expect(res._getJSONData()).toHaveProperty('user.picture');
        realUser = res._getJSONData().user;
    });

    it('should cause 401 error', async () => {
        const newObj = { ...userObj, password: userObj.password + 'a' };
        const { req, res } = mockReqRes({ method: 'POST', body: newObj, url: '/api/users/authenticate'});
        await authenticate(req, res);
        // console.log(res._getJSONData());
        expect(res.statusCode).toBe(401);
    });

    it('should cause 401 error', async() => {
        const newObj = { ...userObj, password: userObj.password + 'a' };
        newObj.email += 'a';
        const { req, res } = mockReqRes({ method: 'POST', body: newObj, url: '/api/users/authenticate'});
        await authenticate(req, res);

        expect(res.statusCode).toBe(401);
    });
});

describe('/api/users/me API Endpoint', () => {
    it('should return a successful response', async () => {
        const { req, res } = mockReqRes({ method: 'GET', url: '/api/users/me', headers: {
            'Authorization': 'Bearer ' + token
        }});
        await getMe(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toHaveProperty('user');
        expect(res._getJSONData()).toHaveProperty('user.email');
        expect(res._getJSONData()).toHaveProperty('user.username');
        expect(res._getJSONData()).toHaveProperty('user.picture');
//         expect(res._getJSONData()).toHaveProperty('user.createdAt');
//         expect(res._getJSONData()).toHaveProperty('user.updatedAt');
        expect(res._getJSONData()).toHaveProperty('user.id');

        meID = res._getJSONData().user.id;
    });

//     it('should return a ___ error', async () => {
//         const { req, res } = mockReqRes({ method: 'GET', url: '/api/users/me', headers: {
//             'Authorization': 'Bearer ' + token + 'asdf'
//         }});
//         await getMe(req, res);
//         expect(res.statusCode).toBe(500);
//     })
});

describe('/api/users/[id] API Endpoint', () => {
//     it('should return a successful response', async () => {
//         const { req, res } = mockReqRes({ method: 'GET', url: '/api/users/'+meID, query: { id: meID }, headers: {
//             'Authorization': 'Bearer ' + token
//         }});
//         await getById(req, res);

//         expect(res.statusCode).toBe(200);
//         expect(res._getJSONData()).toHaveProperty('username');
//         expect(res._getJSONData()).toHaveProperty('picture');
//         expect(res._getJSONData()).toHaveProperty('createdAt');
//         expect(res._getJSONData()).toHaveProperty('updatedAt');
//         expect(res._getJSONData()).toHaveProperty('id');
//     });

//     it('should give a 404 error', async () => {
//         let queryID = (parseInt(meID, 16) - 5).toString(16);
//         const { req, res } = mockReqRes({ method: 'GET', url: '/api/users/'+queryID, query: { id: queryID}, headers: {
//             'Authorization': 'Bearer ' + token
//         }});

//         await getById(req, res);

//         expect(res.statusCode).toBe(404);
//     });
});
