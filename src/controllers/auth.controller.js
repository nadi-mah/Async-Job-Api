const { validateUserName, validatePassword } = require('../validators/auth.validator');
const {handleRegister} = require('../services/auth.service');

const register = async (req, res)=>{
    const {username, password} = req.body;

    // Validate UserName
    const usernameError = validateUserName(username);
    const passwordError = validatePassword(password);
    if(usernameError){
        return res.status(400).json({message: usernameError});
    }
    if(passwordError){
        return res.status(400).json({message: passwordError});
    }
    const result = await handleRegister(username, password);
    if(result?.error){
        return res.status(400).json({message: result.error});
    }
    return res.json(result);

}
const login = async (req, res)=>{
    return res.json({data: "login"});

}

module.exports = {
    register,
    login
}