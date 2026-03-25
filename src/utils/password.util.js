const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const hashPassword = async (password)=>{
    return await bcrypt.hash(password, 10);
}

module.exports = {
    hashPassword
}