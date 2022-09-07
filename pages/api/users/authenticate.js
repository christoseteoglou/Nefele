const bcrypt = require('bcrypt');

import { apiHandler, jwtGen } from '../../../helpers/api';
import User from '../../../models/user';

export default apiHandler({
    post: authenticate
});

async function authenticate(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    console.log(user);
    console.log(user.password);
    console.log(password);
    console.log(bcrypt.compareSync(password, user.password));
    if (!(user && bcrypt.compareSync(password, user.password))) {
        throw 'Username or password is incorrect';
    }

    const token = jwtGen(user);

    return res.status(200).json({
        token
    });
}