import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, IUser } from '../../models/user';
// const jwt = require('jsonwebtoken');
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as Errors from './errors';

export * as Errors from './errors';

const minimatch = require('minimatch');

export interface CustomApiRequest extends NextApiRequest {
    user?: IUser;
}

export type ApiHandlerFunc = (req: CustomApiRequest, res: NextApiResponse) => NextApiResponse | Promise<NextApiResponse>;

type ApiRet = (req: CustomApiRequest, res: NextApiResponse) => Promise<any>;

export interface ApiHandlerInterface {
    get?: ApiHandlerFunc,
    put?: ApiHandlerFunc,
    post?: ApiHandlerFunc,
    delete?: ApiHandlerFunc,
    patch?: ApiHandlerFunc
}

export function apiHandler(handler: ApiHandlerInterface): ApiRet {
    return async (req: CustomApiRequest, res: NextApiResponse) => {
        const method = req.method.toLowerCase();
        if (!handler[method]) return res.status(405).end(`Method ${req.method} Not Allowed`);

        try {
            await connectMongo();
            await authenticateJWT(req, res);
            await handler[method](req, res);
        } catch (err) {
            errorHandler(err, res);
        }
    };
}

// function errorHandler(err: Error | string, res: NextApiResponse) {
//     console.log(typeof err);
//     if (typeof err === 'string') {
//         const is404 = err.toLowerCase().endsWith('not found');
//         const statusCode = is404 ? 404 : 400;
//         return res.status(statusCode).json({ message: err });
//     }

//     if (err.name === 'UnauthorizedError') {
//         return res.status(401).json({ message: 'Invalid Token' });
//     }

//     // console.error(err);
//     return res.status(500).json({ message: err.message });
// }

function errorHandler(err: Errors.IError | string, res: NextApiResponse) {
    if (typeof err === 'string') {
        return res.status(500).json({ message: err });
    }
    return res.status(err.code).json(err);
}

async function authenticateJWT(req: CustomApiRequest, res: NextApiResponse) {
    let allowedGlobs = [
        '/api/users/register',
        '/api/users/authenticate'
    ];
    
    let allowed = allowedGlobs.reduce((p, c) => p = minimatch(req.url, c) ? true : p, false);
    // let allowed = [];
    if (allowed) {
        return;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw { name: 'UnauthorizedError' };

    let id = await new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET, (err: Error, id: JwtPayload) => {
            if (err) {
                rej(err);
            } else {
                res(id.sub);
            }
        });
    });

    const user = await User.findById(id).exec();
    if (!user) throw { name: 'UnauthorizedError' };
    // req.user = omit(user, 'password');
    req.user = user;
}

export function connectMongo(): Promise<typeof mongoose> {
    return mongoose.disconnect().then(() => {
        return mongoose.connect(process.env['MONGO_URI']);
    });
//     return mongoose.connect(process.env['MONGO_URI']);
}

export function closeMongo(): Promise<typeof mongoose> {
    return mongoose.connection.close();
}

export function jwtGen(user) {
    if (!user) throw 'missing user';

    return jwt.sign({ sub: user.id }, process.env['JWT_SECRET'], { expiresIn: '7d' });
}
