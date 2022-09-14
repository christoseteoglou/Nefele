import bcrypt from 'bcrypt';

import { User } from '../../../models/user';

import { apiHandler } from '../../../helpers/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default apiHandler({
    get: getById
});

/**
 * 
 * @swagger
 * /api/users/{id}:
 *  get:
 *    tags: [User]
 *    summary: Get User Blah
 *    description: Get User by ID
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of user to return
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '401':
 *        description: Bad Token
 *  
 */
async function getById(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const user = await User.findById(req.query.id).exec();

    if (!user) throw 'User Not Found';

    return res.status(200).json(user.view(false));
}