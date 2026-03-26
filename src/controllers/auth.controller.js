const { validateUserName, validatePassword } = require('../validators/auth.validator');
const {handleRegister, handleLogin, handleMe, handleRefreshToken, handleLogout} = require('../services/auth.service');

const {StatusCodes} = require('http-status-codes');

const register = async (req, res)=>{
    try {
        const {username, password} = req.body;

        // Validation
        const usernameError = validateUserName(username);
        const passwordError = validatePassword(password);
        if(usernameError){
            return res.status(StatusCodes.BAD_REQUEST).json({message: usernameError});
        }
        if(passwordError){
            return res.status(StatusCodes.BAD_REQUEST).json({message: passwordError});
        }

        // Service
        const result = await handleRegister(username, password);
        return res.status(StatusCodes.CREATED).json(result);
        
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
    

}
const login = async (req, res)=>{
    try {
        const {username, password} = req.body;

        // Validation
        const usernameError = validateUserName(username);
        const passwordError = validatePassword(password);
    
        if(usernameError){
            return res.status(StatusCodes.BAD_REQUEST).json({message: usernameError});
        }
        if(passwordError){
            return res.status(StatusCodes.BAD_REQUEST).json({message: passwordError});
        }
    
        // Service
        const result = await handleLogin(username, password);
        return res.status(StatusCodes.OK).json(result);

    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }


}
const me = async (req, res) => {
    try {
        const {userId} = req.user;

        const result = await handleMe(userId);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }

}
const refreshToken = async (req, res) => {
    try {
        const {refreshToken}= req.body;

        if(!refreshToken){
            return res.status(StatusCodes.BAD_REQUEST).json({message: "No refresh token"});
        }
        const result = await handleRefreshToken(refreshToken);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }


}
const logout = async (req, res) => {
    try {
        const {userId} = req.user;

        const result = await handleLogout(userId);
        return res.status(StatusCodes.OK).json(result);
        
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}
module.exports = {
    register,
    login, 
    me,
    refreshToken,
    logout
}