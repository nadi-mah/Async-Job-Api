const pool = require('../config/db');
// const users = [];

// const findUserByUserName = (username)=>{
//     return users.find(user => user.username === username);
// }
const findUserByUserName = async (username) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0];
}

// const findUserByUserId = (userId) => {
//     return users.find(user => user.id === userId);
// }
const findUserByUserId = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
    );
    return result.rows[0];
}

// const createUser = (newUser)=>{
//     users.push(newUser);
//     return true;
// }
const createUser = async (newUser) => {
    const result = await pool.query(
        'INSERT INTO users (id, username, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [newUser.id, newUser.username, newUser.password, newUser.createdAt, newUser.updatedAt]
    );
    return result.rows[0];
}

// const saveRefreshToken = (userId, refreshToken) => {
//     const index = users.findIndex(user => user.id === userId);
//     if(index === -1){
//         return null;
//     } 

//     const updatedUser = {
//         ...users[index],
//         refreshToken
//     };
    
//     users[index] = updatedUser;
//     return updatedUser;

// }
const saveRefreshToken = async (userId, refreshToken) => {
    const result = await pool.query(
        'UPDATE users SET refresh_token = $1, updated_at = $2 WHERE id = $3 RETURNING *',
        [refreshToken, new Date(), userId]
    );
    return result.rows[0];

}

// const removeRefreshToken = (userId) => {
//     const index = users.findIndex(user => user.id === userId);
//     if(index === -1){
//         return null;
//     } 

//     users[index] = {
//         ...users[index],
//         refreshToken: null
//     };

//     return users[index];
// }
const removeRefreshToken = async (userId) => {
    const result = await pool.query(
        'UPDATE users SET refresh_token = NULL, updated_at = $1 WHERE id = $2 RETURNING *',
        [new Date(), userId]
    );
    return result.rows[0];
    
}

module.exports = {
    findUserByUserName,
    createUser,
    findUserByUserId,
    saveRefreshToken,
    removeRefreshToken
}