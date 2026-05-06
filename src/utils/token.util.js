const jwt = require('jsonwebtoken');
const AppError = require('./appError.util');
const { StatusCodes } = require('http-status-codes');

const generateAccessToken = (id, username) => {
    return jwt.sign(
        {userId: id, username: username}, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: '1d'}
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
        throw new AppError("invalid access token", StatusCodes.UNAUTHORIZED);
    }
}

const verifyRefreshToken = (token) => {
    try {
        const {userId} = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return {userId}
    } catch (error) {
        throw new AppError("invalid refresh token here", StatusCodes.UNAUTHORIZED);
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
 }