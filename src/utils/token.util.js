const jwt = require('jsonwebtoken');

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

module.exports = {
    generateAccessToken,
    generateRefreshToken
 }