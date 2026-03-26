const express = require('express');
const router = express.Router();

const {createJob, getJob, getAllJobs } = require('../controllers/job.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.route('/').post(authMiddleware, createJob);
router.route('/').get(authMiddleware, getAllJobs);
router.route('/:id').get(authMiddleware, getJob);

module.exports = router;