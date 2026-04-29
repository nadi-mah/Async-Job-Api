const express = require('express');
const router = express.Router();

const {createJob, getJob, getAllJobs, getAllJobEvents } = require('../controllers/job.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const jobCacheMiddleware = require('../middlewares/cache.middleware');

router.route('/').post(authMiddleware, createJob);
router.route('/').get(authMiddleware, getAllJobs);
router.route('/:id').get(authMiddleware, jobCacheMiddleware, getJob);
router.route('/:id/events').get(authMiddleware, getAllJobEvents);

module.exports = router;