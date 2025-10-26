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

// Get course topics
app.get('/api/courses/:id/topics', (req, res) => {
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
      data: course.topics || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load topics'
    });
  }
});

// Get topic modules
app.get('/api/courses/:courseId/topics/:topicId/modules', (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const course = mockData.courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const topic = course.topics?.find(t => t.id === topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }
    
    res.json({
      success: true,
      data: topic.modules || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load modules'
    });
  }
});

// Get module lessons
app.get('/api/courses/:courseId/topics/:topicId/modules/:moduleId/lessons', (req, res) => {
  try {
    const { courseId, topicId, moduleId } = req.params;
    const course = mockData.courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const topic = course.topics?.find(t => t.id === topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }
    
    const module = topic.modules?.find(m => m.id === moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }
    
    res.json({
      success: true,
      data: module.lessons || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load lessons'
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
    const course = mockData.courses.find(c => c.id === id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    // Flatten all lessons from all topics and modules
    const allLessons = [];
    course.topics?.forEach(topic => {
      topic.modules?.forEach(module => {
        if (module.lessons) {
          allLessons.push(...module.lessons);
        }
      });
    });
    
    res.json({
      success: true,
      data: allLessons
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

// Feedback endpoint
app.post('/api/courses/:id/feedback', (req, res) => {
  try {
    const { id } = req.params;
    const { learnerId, rating, comments } = req.body;
    
    // Validate input
    if (!learnerId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: learnerId and rating are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    res.json({
      success: true,
      data: {
        feedbackId: `feedback_${Date.now()}`,
        courseId: id,
        learnerId,
        rating,
        comments: comments || '',
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// User progress endpoint
app.get('/api/user/:id/progress', (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      data: {
        learnerId: id,
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
        lastAccessed: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load user progress'
    });
  }
});

// User achievements endpoint
app.get('/api/user/:id/achievements', (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load user achievements'
    });
  }
});

// Learning paths endpoint
app.get('/api/learning-paths', (req, res) => {
  try {
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load learning paths'
    });
  }
});

// Update lesson progress endpoint
app.put('/api/user/:id/progress', (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, lessonId, completed } = req.body;
    
    res.json({
      success: true,
      data: {
        learnerId: id,
        courseId,
        lessonId,
        completed,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update lesson progress'
    });
  }
});

// Update lesson progress endpoint (specific for lessons)
app.put('/api/lessons/:lessonId/progress', (req, res) => {
  try {
    const { lessonId } = req.params;
    const { learnerId, courseId, completed } = req.body;
    
    res.json({
      success: true,
      data: {
        learnerId,
        courseId,
        lessonId,
        completed,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update lesson progress'
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
