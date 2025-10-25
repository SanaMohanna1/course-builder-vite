const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://course-builder-vite-gf1xqi19d-sana-mohannas-projects.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Course Builder API',
    version: '1.0.0'
  });
});

// API Routes
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: {
      courses: [
        {
          id: 'course_001',
          title: 'React Development Fundamentals',
          description: 'Master the core concepts of React, including hooks, state management, routing, and building interactive user interfaces.',
          trainer: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          skills: ['React', 'JavaScript', 'JSX', 'Hooks'],
          status: 'published',
          courseType: 'marketplace',
          metadata: {
            difficulty: 'intermediate',
            duration: '6 weeks'
          },
          feedback: {
            averageRating: 4.7,
            totalRatings: 156
          }
        },
        {
          id: 'course_006',
          title: 'Personalized React Learning Path',
          description: 'Your personalized React learning journey based on your current skills and learning goals.',
          trainer: {
            name: 'AI Learning Assistant',
            email: 'ai@coursebuilder.com'
          },
          skills: ['React', 'JavaScript', 'Personalized Learning'],
          status: 'published',
          courseType: 'personalized',
          metadata: {
            difficulty: 'adaptive',
            duration: '4-8 weeks'
          },
          feedback: {
            averageRating: 4.8,
            totalRatings: 0
          }
        }
      ]
    }
  });
});

app.get('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: {
      id,
      title: id === 'course_006' ? 'Personalized React Learning Path' : 'React Development Fundamentals',
      description: id === 'course_006' 
        ? 'Your personalized React learning journey based on your current skills and learning goals.'
        : 'Master the core concepts of React, including hooks, state management, routing, and building interactive user interfaces.',
      courseType: id === 'course_006' ? 'personalized' : 'marketplace'
    }
  });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const { id } = req.params;
  const { learnerId } = req.body;
  
  res.json({
    success: true,
    data: {
      enrollmentId: `enrollment_${Date.now()}`,
      learnerId,
      courseId: id,
      enrolledAt: new Date().toISOString(),
      status: 'active'
    }
  });
});

app.post('/api/courses/:id/feedback', (req, res) => {
  const { id } = req.params;
  const { rating, comments, learnerId } = req.body;
  
  res.json({
    success: true,
    data: {
      feedbackId: `feedback_${Date.now()}`,
      learnerId,
      courseId: id,
      rating,
      comments,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    }
  });
});

app.get('/api/user/:id/progress', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    data: {
      learnerId: id,
      totalCourses: 12,
      completedCourses: 8,
      inProgressCourses: 4,
      learningStreak: 7,
      achievements: [
        {
          id: 'achievement_001',
          title: 'React Basics Badge',
          description: 'Completed React Fundamentals course',
          earnedAt: '2024-02-15T10:00:00Z'
        }
      ]
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Course Builder API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
