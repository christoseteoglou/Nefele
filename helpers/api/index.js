import mongoose from 'mongoose';
import User from '../../models/user';
const jwt = require('jsonwebtoken');
const minimatch = require('minimatch');

export function apiHandler(handler) {
    return async (req, res) => {
        const method = req.method.toLowerCase();
        if (!handler[method]) return res.status(405).end(`Method ${req.method} Not Allowed`);

        try {
            await connectMongo();
            await authenticateJWT(req, res);
            await handler[method](req, res);
        } catch (err) {
            errorHandler(err, res);
        }
    }
}

function errorHandler(err, res) {
    console.log(typeof err);
    if (typeof err === 'string') {
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // console.error(err);
    return res.status(500).json({ message: err.message });
}

async function authenticateJWT(req, res) {
    let allowedGlobs = [
        '/api/users/register',
        '/api/users/authenticate'
    ];
    
    let allowed = allowedGlobs.reduce((p, c) => p = minimatch(req.path, c) ? true : p, false);

    if (allowed) {
        return;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw { name: 'UnauthorizedError' };

    let id = await new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, id) => {
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
    req.user = user.view(true);
}

export function connectMongo() {
    return mongoose.connect(process.env['MONGO_URI']);
}

export function jwtGen(user) {
    if (!user) throw `missing user`;

    return jwt.sign({ sub: user.id }, process.env['JWT_SECRET'], { expiresIn: '7d' });
}

// export function omit(obj, ...keys) {
//     let newObj = {};
//     for (let k in obj) {
//         console.log(k);
//         console.log(keys.indexOf(k));
//         if (keys.indexOf(k) === -1) newObj[k] = obj[k];
//     }
//     return newObj;
// }