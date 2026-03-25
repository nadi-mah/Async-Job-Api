const validateUserName = (userName)=>{
    if(!userName){
        return {error: "UserName is required"};
    }
    if(userName.length < 3 || userName.length > 20){
        return {error: "UserName must be between 3 and 20 characters long"};
    }
    return null;
}

const validatePassword = (password)=>{
    if(!password){
        return {error: "Password is required"};
    }
    if(password.length < 8 || password.length > 20){
        return {error: "Password must be between 8 and 20 characters long"};
    }
    return null;
}

module.exports = {
    validateUserName,
    validatePassword
}