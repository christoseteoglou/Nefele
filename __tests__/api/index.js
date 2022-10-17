import { connectMongo, closeMongo } from '../../helpers/api';

beforeAll(done => {
    done()
});

afterAll(done => {
    closeMongo().then(done);
});

describe('MongoBD connection', () => {
    it('should connect', async () => {
        await connectMongo();

        expect(true).toBe(true);
    });
});
