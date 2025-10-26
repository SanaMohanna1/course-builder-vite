const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Load mock data
const loadMockData = () => {
  try {
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'courses.json'), 'utf8'));
    const lessons = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'lessons.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));
    const achievements = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'achievements.json'), 'utf8'));
    const userProgress = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'user-progress.json'), 'utf8'));
    const learningPaths = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'learning-paths.json'), 'utf8'));
    
    return {
      courses: courses.courses,
      lessons: lessons.lessons,
      users: users.users,
      achievements: achievements.achievements,
      userProgress: userProgress,
      learningPaths: learningPaths.learningPaths
    };
  } catch (error) {
    console.error('Error loading mock data:', error);
    return {
      courses: [],
      lessons: [],
      users: [],
      achievements: [],
      userProgress: {},
      learningPaths: []
    };
  }
};

const mockData = loadMockData();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'https://course-builder-vite-gf1xqi19d-sana-mohannas-projects.vercel.app', // your Vercel frontend
  'http://localhost:5173', // local dev
];
// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'Course Builder API',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});


// API Routes
app.get('/api/courses', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses',
      message: error.message
    });
  }
});

app.get('/api/courses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const course = mockData.courses.find(c => c.id === id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        message: `Course with ID ${id} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course',
      message: error.message
    });
  }
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

// Get lessons for a course
app.get('/api/courses/:id/lessons', (req, res) => {
  try {
    const { id } = req.params;
    const course = mockData.courses.find(c => c.id === id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        message: `Course with ID ${id} does not exist`
      });
    }
    
    // Filter lessons for this course
    const courseLessons = mockData.lessons.filter(lesson => lesson.courseId === id);
    
    res.json({
      success: true,
      data: courseLessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lessons',
      message: error.message
    });
  }
});

// Get user progress
app.get('/api/user/:id/progress', (req, res) => {
  try {
    const { id } = req.params;
    const userProgress = mockData.userProgress[id] || mockData.userProgress.default;
    
    res.json({
      success: true,
      data: userProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user progress',
      message: error.message
    });
  }
});

// Get user achievements
app.get('/api/user/:id/achievements', (req, res) => {
  try {
    const { id } = req.params;
    const userAchievements = mockData.achievements.filter(achievement => 
      achievement.earnedBy === id || achievement.earnedBy === 'default'
    );
    
    res.json({
      success: true,
      data: userAchievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements',
      message: error.message
    });
  }
});

// Get learning paths
app.get('/api/learning-paths', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.learningPaths
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning paths',
      message: error.message
    });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Course Builder API running on port ${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Mock data loaded: ${Object.keys(mockData).length} collections`);
});

// Handle server errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
