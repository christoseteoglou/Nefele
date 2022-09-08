import { apiHandler } from "../../../helpers/api";

export default apiHandler({
    get: getMe
});

async function getMe(req, res) {
    return res.status(200).json({ user: req.user });
}