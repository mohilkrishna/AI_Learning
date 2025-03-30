const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// @desc    Get personalized courses based on user's learning style and pace
// @route   GET /api/courses/personalized
// @access  Private
const getPersonalizedCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  const courses = await Course.find({
    $or: [
      { 'recommendedFor.learningStyle': user.learningStyle },
      { 'recommendedFor.learningPace': user.learningPace },
    ],
  });
  
  res.json(courses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    difficulty,
    content,
    recommendedFor,
  } = req.body;

  const course = new Course({
    title,
    description,
    category,
    difficulty,
    content,
    recommendedFor,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    difficulty,
    content,
    recommendedFor,
  } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.difficulty = difficulty || course.difficulty;
    course.content = content || course.content;
    course.recommendedFor = recommendedFor || course.recommendedFor;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

module.exports = {
  getCourses,
  getPersonalizedCourses,
  getCourseById,
  createCourse,
  updateCourse,
};