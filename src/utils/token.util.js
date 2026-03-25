const jwt = require('jsonwebtoken');
const AppError = require('./appError.util');
const { StatusCodes } = require('http-status-codes');

const generateAccessToken = (id, username) => {
    return jwt.sign(
        {userId: id, username: username}, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: '15m'}
    );
}

const generateRefreshToken = (id) => {
    return jwt.sign(
        {userId: id}, 
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'})
}

const verifyAccessToken = (token) => {
    try {
        const {userId, username} = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return {userId, username}
    } catch (error) {
        throw new AppError("invalid token", StatusCodes.UNAUTHORIZED);
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
 }