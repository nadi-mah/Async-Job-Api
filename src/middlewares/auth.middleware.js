const {verifyAccessToken} = require('../utils/token.util');

const {StatusCodes} = require('http-status-codes');

const requireAuth = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(" ")[1]) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "invalid token"});
    }
    const accessToken = authHeader.split(" ")[1];

    try {
        const {userId, username} = verifyAccessToken(accessToken);
        req.user = {userId, username};
        next();
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
    
}

module.exports = requireAuth