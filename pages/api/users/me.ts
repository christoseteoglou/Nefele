import { NextApiResponse } from "next";
import { apiHandler, CustomApiRequest } from "../../../helpers/api";

export default apiHandler({
    get: getMe
});

/**
 * @swagger
 * /api/users/me:
 *  get:
 *    tags: [User]
 *    summary: Me
 *    description: Retrieves currently authenticated user's data.
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 */

async function getMe(req: CustomApiRequest, res: NextApiResponse): Promise<any> {
    return res.status(200).json({ user: req.user.view(true) });
}