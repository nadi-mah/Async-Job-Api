const { findUserByUserName, createUser } = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password.util');

const handleRegister = async (userName, password)=>{
    const user = findUserByUserName(userName);
    if(user){
        return {error: "User already exists"};
    }
    const hashedPassword = await hashPassword(password);
    const newUser = {
        id: 1,
        userName,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const result = createUser(newUser);
    if(!result){
        return {error: "Failed to create user"};
    }
    return {message: "User registered successfully", data:{
        userName,
        createdTime: newUser.createdAt
    }};
}

module.exports = {
    handleRegister
}