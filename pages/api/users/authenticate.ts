import { NextApiResponse } from "next";
import { apiHandler, CustomApiRequest, jwtGen, Errors } from "../../../helpers/api";
import { User } from "../../../models/user";

export default apiHandler({
    post: authenticate
});

/**
 * @swagger
 * /api/users/authenticate:
 *  post:
 *    tags: [User]
 *    summary: Authenticate
 *    description: Authenticate user/pass
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
 *              password:
 *                type: string
 *            required:
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

async function authenticate(req: CustomApiRequest, res: NextApiResponse): Promise<any> {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        throw Errors.UnauthorizedError;
    }

    if (await user.authenticate(password)) {
        const token = jwtGen(user);
        return res.status(200).json({ token, user: user.view(true) });
    } else {
        // throw { name: 'UnauthorizedError' };
        throw Errors.UnauthorizedError;
    }
}