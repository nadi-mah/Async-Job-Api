const users = [];

const findUserByUserName = (username)=>{
    return users.find(user => user.username === username);
}
const createUser = (newUser)=>{
    users.push(newUser);
    console.log(users);
    return true;
}
const findUserByUserId = (userId) => {
    return users.find(user => user.id === userId);
}
const saveRefreshToken = (userId, refreshToken) => {
    const index = users.findIndex(user => user.id === userId);
    if(index === -1){
        return null;
    } 

    const updatedUser = {
        ...users[index],
        refreshToken
    };
    
    users[index] = updatedUser;
    return updatedUser;

}

module.exports = {
    findUserByUserName,
    createUser,
    findUserByUserId,
    saveRefreshToken
}