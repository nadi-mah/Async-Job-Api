const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const {getDeadLetterJobs, getDeadJob, replayDeadJob} = require('../controllers/deadLetter.controller');
const {cacheAllDeadJobs, cacheDeadJobs} = require('../middlewares/cache.middleware');

router.route('/').get(authMiddleware, cacheAllDeadJobs, getDeadLetterJobs);
router.route('/:id').get(authMiddleware, cacheDeadJobs, getDeadJob);
router.route('/:id/replay').post(authMiddleware, replayDeadJob);

module.exports = router;