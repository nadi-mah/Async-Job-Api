const user = [];

const findUserByUserName = (username)=>{
    return user.find(user => user.username === username);
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