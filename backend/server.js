import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoints (CRITICAL for Railway)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Course Builder Backend is running ✅',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Course Builder API'
  });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Load mock data
const loadMockData = () => {
  try {
    const coursesPath = path.join(__dirname, 'data', 'courses.json');
    const lessonsPath = path.join(__dirname, 'data', 'lessons.json');
    const usersPath = path.join(__dirname, 'data', 'users.json');
    
    const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    return {
      courses: courses.courses || courses,
      lessons: lessons.lessons || lessons,
      users: users.users || users
    };
  } catch (error) {
    console.error('Error loading mock data:', error);
    return {
      courses: [],
      lessons: [],
      users: []
    };
  }
};

const mockData = loadMockData();

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
      error: 'Failed to load courses'
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
        error: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load course'
    });
  }
});

app.get('/api/courses/:id/lessons', (req, res) => {
  try {
    const { id } = req.params;
    const lessons = mockData.lessons.filter(lesson => lesson.courseId === id);
    
    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load lessons'
    });
  }
});

app.post('/api/courses/:id/enroll', (req, res) => {
  try {
    const { id } = req.params;
    const { learnerId } = req.body;
    
    res.json({
      success: true,
      data: {
        enrollmentId: `enrollment_${Date.now()}`,
        courseId: id,
        learnerId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to enroll in course'
    });
  }
});

app.get('/api/users', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load users'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Root endpoint: http://0.0.0.0:${PORT}/`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📊 Ping check: http://0.0.0.0:${PORT}/ping`);
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

export default app;
