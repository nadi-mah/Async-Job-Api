const { 
    findUserByUserName, 
    createUser, 
    findUserByUserId, 
    saveRefreshToken,
    removeRefreshToken} = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token.util');
const AppError = require('../utils/appError.util');

const { v4: uuidv4 } = require('uuid')
const {StatusCodes} = require('http-status-codes');

const handleRegister = async (username, password)=>{
    const user = findUserByUserName(username);
    if(user){
        throw new AppError("User already exists", StatusCodes.CONFLICT);
    }
    const hashedPassword = await hashPassword(password);
    const newUser = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const result = createUser(newUser);
    if(!result){
        throw new AppError("Failed to create user", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return {
        message: "User registered successfully", 
        data:{
            username,
            createdTime: newUser.createdAt
        }};
}

const handleLogin = async (username, password)=>{
    const user = findUserByUserName(username);
    if(!user){
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
        throw new AppError("Invalid password", StatusCodes.BAD_REQUEST);
    }
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = generateRefreshToken(user.id);

    const updatedUser = saveRefreshToken(user.id, refreshToken);
    if(!updatedUser){
        throw new AppError("Failed to update user", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return {
        message: "User logged in successfully", 
        data:{
            accessToken, 
            refreshToken,
            user: {id: user.id, username: user.username}
        }
    }
}

const handleMe = async (userId) => {
    const user = findUserByUserId(userId);
    if(!user){
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return {data: {
        id: userId,
        username: user.username
    }};
}

const handleRefreshToken = async (refreshToken) => {
    const {userId} = verifyRefreshToken(refreshToken);

    const user = findUserByUserId(userId);
    if(!user){
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    if(user.refreshToken !== refreshToken){
        throw new AppError("invalid refresh token", StatusCodes.UNAUTHORIZED);
    }

    const newAccessToken = generateAccessToken(userId, user.username);

    return {
        message: "New accessToken generated successfully",
        data: {
            accessToken: newAccessToken
        }
    }

    

}

const handleLogout = async (userId) => {
    const user = removeRefreshToken(userId);
    if(!user){
        throw new AppError("fail to delete refresh token", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return {
        message: "user logged out successfully"
    }
}
module.exports = {
    handleRegister,
    handleLogin,
    handleMe,
    handleRefreshToken,
    handleLogout
}