const express = require('express');
const router = express.Router();

const {createJob, getJob, getAllJobs, getAllJobEvents } = require('../controllers/job.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const {cachedJobs,  cacheAllJobs} = require('../middlewares/cache.middleware');

router.route('/').post(authMiddleware, createJob);
router.route('/').get(authMiddleware, cacheAllJobs, getAllJobs);
router.route('/:id').get(authMiddleware, cachedJobs, getJob);
router.route('/:id/events').get(authMiddleware, getAllJobEvents);

module.exports = router;