const express = require('express');
const router = express.Router();

const {register, login, me, refreshAccessToken, logout} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(authMiddleware, me);
router.route('/refreshToken').post(refreshAccessToken);
router.route('/logout').post(authMiddleware, logout);


module.exports = router;