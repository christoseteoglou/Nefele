import { errorHandler, jwtMiddleware, connectMongo } from './';

export function apiHandler(handler) {
    return async (req, res) => {
        const method = req.method.toLowerCase();
        if (!handler[method]) return res.status(405).end(`Method ${req.method} Not Allowed`);

        try {
            console.log('CONNECTING MONGODB');
            await connectMongo();
            console.log('MONGODB CONNECTED');
            await jwtMiddleware(req, res);
            await handler[method](req, res);
        } catch (err) {
            errorHandler(err, res);
        }
    }
}