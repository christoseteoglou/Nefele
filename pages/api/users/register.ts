import { NextApiResponse } from "next";
import { apiHandler, CustomApiRequest, jwtGen } from "../../../helpers/api";
import { User } from "../../../models/user";

export default apiHandler({
    post: register
});

/**
 * 
 * @swagger
 * /api/users/register:
 *  post:
 *    tags: [User]
 *    summary: Register
 *    description: Register new User
 *    security: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              picture:
 *                type: string
 *                format: url
 *            required:
 *              - username
 *              - email
 *              - password
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  format: uuid
 *                user:
 *                  $ref: '#/components/schemas/User'
 */
async function register(req: CustomApiRequest, res: NextApiResponse): Promise<any> {
    let user = await (new User(req.body)).save();

    let userObj = await User.findById(user._id).exec();
    const token = jwtGen(user);
    return res.status(201).json({
        token,
        user: userObj.view(true)
    });
}