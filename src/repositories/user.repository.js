const user = [];

const findUserByUserName = (userName)=>{
    return user.find(user => user.userName === userName);
}
const createUser = (newUser)=>{
    user.push(newUser);
    console.log(user);
    return true;
}

module.exports = {
    findUserByUserName,
    createUser
}