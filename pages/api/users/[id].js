const bcrypt = require('bcrypt');
import { User } from '../../models/user';

import { apiHandler } from '../../helpers/api';

export default apiHandler({
    get: getById,
    // put: update,
    delete: _delete
});

async function getById(req, res) {
    const user = await User.findById(req.query.id).exec();

    if (!user) throw 'User Not Found';

    return res.status(200).json(omit(user, 'password'));
}

// async function update(req, res) {
//     const user = await User.findById(req.query.id).exec();

//     if (!user) throw 'User Not Found';

//     const { password, ...params } = req.body;

//     if (user.)
// }