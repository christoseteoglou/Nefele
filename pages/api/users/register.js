const bcrypt = require('bcrypt');

import { apiHandler, jwtGen } from '../../../helpers/api';
import User from '../../../models/user';

export default apiHandler({
    post: register
});

async function register(req, res) {
    // const { pass, ...user } = req.body;

    // await User.create(req.body)
    //     .then(user => {
    //         const token = jwtGen(user);
    //         return res.status(201).json({
    //             token,
    //             user: user.view(true)
    //         });
    //     }).catch((err) => {
    //         throw err;
    //     });
    let user = await (new User(req.body)).save();
    let userObj = await User.findById(user).exec();
    const token = jwtGen(user);
    return res.status(201).json({
        token,
        user: userObj.view(true)
    });
}