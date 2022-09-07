import mongoose from 'mongoose';

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
        console.log('blah');
    }
}

export function errorHandler(err, res) {
    if (typeof (err) === 'string') {
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    console.error(err);
    return res.status(500).json({ message: err.message });
}

export function jwtMiddleware(req, res) {
    const { expressjwt: jwt } = require('express-jwt');
    const util = require('util');
    const middleware = jwt({ secret: process.env['JWT_SECRET'], algorithms: ['HS256']}).unless({
        path: [
            '/api/users/register',
            '/api/users/authenticate' 
        ]
    });

    return util.promisify(middleware)(req, res);
}

export function connectMongo() {
    mongoose.connect(process.env['MONGO_URI']);
}

export function jwtGen(user) {
    if (!user) throw `missing user`;

    const jwt = require('jsonwebtoken');

    return jwt.sign({ sub: user.id }, process.env['JWT_SECRET'], { expiresIn: '7d' });
}