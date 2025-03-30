const Assessment = require('../models/Assessment');
const Course = require('../models/Course');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Submit an assessment
// @route   POST /api/assessments
// @access  Private
const submitAssessment = asyncHandler(async (req, res) => {
  const { courseId, answers } = req.body;
  
  // Get the course to validate answers
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  // Calculate score
  let score = 0;
  const processedAnswers = answers.map(answer => {
    const question = course.content.find(
      item => item._id.toString() === answer.questionId && item.type === 'quiz'
    );
    
    if (!question) return null;
    
    const isCorrect = question.questions[0].correctAnswer === answer.selectedOption;
    if (isCorrect) score++;
    
    return {
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      isCorrect,
    };
  }).filter(Boolean);
  
  // Create assessment
  const assessment = await Assessment.create({
    userId: req.user._id,
    courseId,
    score,
    answers: processedAnswers,
  });
  
  // Update user progress
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { completedCourses: courseId },
    $inc: { progress: 10 }, // Increment progress by 10% for each completed course
  });
  
  res.status(201).json(assessment);
});

// @desc    Get user's assessments
// @route   GET /api/assessments
// @access  Private
const getUserAssessments = asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({ userId: req.user._id })
    .populate('courseId', 'title');
  
  res.json(assessments);
});

module.exports = {
  submitAssessment,
  getUserAssessments,
};