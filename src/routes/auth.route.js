const express = require('express');
const router = express.Router();

const {register, login, me} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(authMiddleware, me);


module.exports = router;