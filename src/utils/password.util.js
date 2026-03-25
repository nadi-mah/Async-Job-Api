const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const hashPassword = async (password)=>{
    return await bcrypt.hash(password, 10);
}
const comparePassword = async (password, hashedPassword)=>{
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
}