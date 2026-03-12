const helpers = require('../utils/helpers');

async function requireAuth(req, res, next) {

    const auth_header = req.headers.authorization;

    const auth_header_splitted = auth_header.split(" ");

    try {

        if (!auth_header || auth_header_splitted[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                info: "Invalid authorization header"
            });
        }

        const user_id = +auth_header_splitted[1].split(".")[0];
        
        const token = auth_header_splitted[1].split(".")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                info: 'No token provided'
            });
        }

        const token_hash = helpers.hashSessionToken(token);

        const user = await helpers.getSessionByHashedToken(user_id, token_hash);

        if (user === undefined || user.id !== user_id) {
            return res.status(401).json({
                success: false,
                info: 'Invalid token'
            });
        }

        const expired = helpers.isExpired(user.expires_at);

        if (expired) {
            await helpers.deleteToken(user_id, token);

            return res.status(401).json({
                success: false,
                info: "Your token is expired"
            });
        }

        req.user = user;
        next();
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            info: "Database error"
        });
    };
};

module.exports = requireAuth;