const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  content: [
    {
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'interactive'],
        required: true,
      },
      title: String,
      url: String,
      textContent: String,
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
        },
      ],
    },
  ],
  recommendedFor: [
    {
      learningStyle: String,
      learningPace: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);