import { connectMongo } from '../../helpers/api';

describe('MongoBD connection', () => {
    it('should connect', async () => {
        await connectMongo();

        expect(true).toBe(true);
    });
});