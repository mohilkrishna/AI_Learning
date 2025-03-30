const express = require('express');
const router = express.Router();
const {
  submitAssessment,
  getUserAssessments,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, submitAssessment).get(protect, getUserAssessments);

module.exports = router;