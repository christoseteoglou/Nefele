import { createMocks } from 'node-mocks-http';
import register from '../../../../pages/api/users/register';
import casual from 'casual';
import mongoose from 'mongoose';

describe('/api/users/register API Endpoint', () => {
    afterAll(async () => {
        // await mongoose.connection.db.dropDatabase();
        for (let k in mongoose.connection.collections) {
            await mongoose.connection.collections[k].drop();
        }
        await mongoose.connection.close();
        return;
    })

    const userObj = {
        email: casual.email,
        password: casual.password
    };

    function mockReqRes(opts) {
        const optsDefault = { method: 'GET' };
        const { req, res } = createMocks({ ...optsDefault, ...opts});
        req.headers = {
            'Content-Type': 'application/json',
        };
        return { req, res };
    }

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
});