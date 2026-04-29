const express = require('express');
const router = express.Router();

const {register, login, me, refreshAccessToken, logout} = require('../controllers/auth.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { createRateLimiter } = require('../middlewares/rateLimit.middleware');

const authRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
    keyPrefix: 'rate-limit:auth'
  });

router.route('/register').post(authRateLimiter, register);
router.route('/login').post(authRateLimiter, login);
router.route('/me').get(authMiddleware, me);
router.route('/refreshToken').post(authRateLimiter, refreshAccessToken);
router.route('/logout').post(authMiddleware, logout);


module.exports = router;