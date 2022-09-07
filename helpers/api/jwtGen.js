const jwt = require('jsonwebtoken');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function jwtGen(user) {
    if (!user) throw `missing user`;

    return jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });
}