// API service for Course Builder
// Connects to Railway backend API

// Backend API base URL
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper function for delays (for mock operations)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Course API functions
export const courseAPI = {
  // Get all courses
  async getCourses() {
    return await apiRequest('/api/courses')
  },

  // Get single course by ID
  async getCourse(id) {
    return await apiRequest(`/api/courses/${id}`)
  },

  // Get lessons for a course
  async getCourseLessons(id) {
    return await apiRequest(`/api/courses/${id}/lessons`)
  },

  // Create new course
  async createCourse(courseData) {
    await delay(500)
    const newCourse = {
      id: `course_${Date.now()}`,
      ...courseData,
      status: 'draft',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    }
    return {
      success: true,
      data: newCourse
    }
  },

  // Publish course
  async publishCourse(id, publishMode = 'immediate') {
    await delay(600)
    return {
      success: true,
      data: {
        courseId: id,
        status: 'published',
        publishedAt: new Date().toISOString(),
        publishMode
      }
    }
  }
}

// Skills Engine API functions
export const skillsAPI = {
  // Expand skills using Skills Engine
  async expandSkills(description, generalSkills = []) {
    return await apiRequest('/api/skills/expand', {
      method: 'POST',
      body: JSON.stringify({ description, generalSkills })
    })
  }
}

// Content Studio API functions
export const contentAPI = {
  // Generate lessons from Content Studio
  async generateLessons(courseId, structure, skills) {
    return await apiRequest('/api/content/generate', {
      method: 'POST',
      body: JSON.stringify({ courseId, structure, skills })
    })
  }
}

// Assessment API functions
export const assessmentAPI = {
  // Start assessment
  async startAssessment(learnerId, courseId, coverageMap) {
    await delay(500)
    return {
      success: true,
      data: {
        assessmentId: `assessment_${Date.now()}`,
        learnerId,
        courseId,
        status: 'started',
        startedAt: new Date().toISOString(),
        estimatedDuration: '60 minutes',
        questions: 25
      }
    }
  },

  // Get assessment report
  async getAssessmentReport(assessmentId) {
    return await apiRequest(`/api/assessment/${assessmentId}/report`)
  }
}

// User API functions
export const userAPI = {
  // Register learner for course
  async registerLearner(courseId, learnerId) {
    return await apiRequest(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ learnerId })
    })
  },

  // Submit feedback
  async submitFeedback(courseId, learnerId, rating, comments) {
    return await apiRequest(`/api/courses/${courseId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ learnerId, rating, comments })
    })
  },

  // Get user progress
  async getUserProgress(learnerId) {
    return await apiRequest(`/api/user/${learnerId}/progress`)
  },

  // Get user achievements
  async getUserAchievements(learnerId) {
    return await apiRequest(`/api/user/${learnerId}/achievements`)
  },

  // Update lesson progress
  async updateLessonProgress(learnerId, courseId, lessonId, completed) {
    await delay(150)
    return {
      success: true,
      data: {
        learnerId,
        courseId,
        lessonId,
        completed,
        updatedAt: new Date().toISOString()
      }
    }
  }
}

// Learning Paths API functions
export const learningPathsAPI = {
  // Get all learning paths
  async getLearningPaths() {
    return await apiRequest('/api/learning-paths')
  },

  // Get learning path by ID
  async getLearningPath(pathId) {
    return await apiRequest(`/api/learning-paths/${pathId}`)
  },

  // Enroll in learning path
  async enrollInPath(pathId, learnerId) {
    await delay(400)
    return {
      success: true,
      data: {
        enrollmentId: `path_enrollment_${Date.now()}`,
        pathId,
        learnerId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      }
    }
  }
}

// Achievements API functions
export const achievementsAPI = {
  // Get user achievements
  async getUserAchievements(learnerId) {
    return await apiRequest(`/api/user/${learnerId}/achievements`)
  },

  // Get leaderboards
  async getLeaderboards() {
    return await apiRequest('/api/achievements/leaderboards')
  },

  // Award achievement
  async awardAchievement(learnerId, achievementId) {
    await delay(150)
    return {
      success: true,
      data: {
        learnerId,
        achievementId,
        awardedAt: new Date().toISOString()
      }
    }
  }
}

// Export all APIs
export default {
  course: courseAPI,
  skills: skillsAPI,
  content: contentAPI,
  assessment: assessmentAPI,
  user: userAPI,
  learningPaths: learningPathsAPI,
  achievements: achievementsAPI
}

