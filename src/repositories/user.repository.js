const user = [];

const findUserByUserName = (username)=>{
    return user.find(user => user.username === username);
}
const createUser = (newUser)=>{
    user.push(newUser);
    console.log(user);
    return true;
}
const findUserByUserId = (userId) => {
    return user.find(user => user.id === userId);
}

module.exports = {
    findUserByUserName,
    createUser,
    findUserByUserId
}