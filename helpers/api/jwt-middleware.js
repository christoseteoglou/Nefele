const { expressjwt: jwt } = require("express-jwt");
const util = require('util');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function jwtMiddleware(req, res) {
    const middleware = jwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256']}).unless({
        path: [
            '/api/users/register',
            '/api/users/authenticate' 
        ]
    });

    return util.promisify(middleware)(req, res);
}