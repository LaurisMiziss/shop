const helpers = require('../utils/helpers');

async function requireAuth(req, res, next) {

    const authHeader = req.headers.authorization;

    try {

        if (!authHeader || authHeader.slice(0, 7) !== "Bearer ") {
            return res.status(401).json({
                success: false,
                info: "Invalid authorization header"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                info: 'No token provided'
            });
        }

        const user = await helpers.getSessionByToken(token);

        if (user === undefined) {
            return res.status(401).json({
                success: false,
                info: 'Invalid token'
            });
        }

        const expired = helpers.isExpired(user.expires_at);

        if (expired) {
            await helpers.deleteToken(token);

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