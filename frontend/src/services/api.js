// Mock API service for Course Builder
// This simulates all microservice interactions

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API responses
const mockResponses = {
  courses: () => import('../mock/courses.json').then(m => m.default),
  lessons: () => import('../mock/lessons.json').then(m => m.default),
  users: () => import('../mock/users.json').then(m => m.default),
  learningPaths: () => import('../mock/learning-paths.json').then(m => m.default),
  userProgress: () => import('../mock/user-progress.json').then(m => m.default),
  achievements: () => import('../mock/achievements.json').then(m => m.default),
  skillsEngine: () => import('../mock/integrations/skills-engine.json').then(m => m.default),
  contentStudio: () => import('../mock/integrations/content-studio.json').then(m => m.default),
  assessmentReport: () => import('../mock/integrations/assessment-report.json').then(m => m.default),
}

// Course API functions
export const courseAPI = {
  // Get all courses
  async getCourses() {
    await delay(300) // Simulate network delay
    const data = await mockResponses.courses()
    return {
      success: true,
      data: data.courses
    }
  },

  // Get single course by ID
  async getCourse(id) {
    await delay(200)
    const data = await mockResponses.courses()
    const course = data.courses.find(c => c.id === id)
    return {
      success: !!course,
      data: course || null
    }
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
    await delay(800) // Skills Engine takes longer
    const skillsData = await mockResponses.skillsEngine()
    
    return {
      success: true,
      data: {
        expandedSkills: skillsData.expandedSkills
      }
    }
  }
}

// Content Studio API functions
export const contentAPI = {
  // Generate lessons from Content Studio
  async generateLessons(courseId, structure, skills) {
    await delay(1000) // Content Studio takes longest
    const contentData = await mockResponses.contentStudio()
    
    return {
      success: true,
      data: contentData.generatedContent
    }
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
    await delay(300)
    const data = await mockResponses.assessmentReport()
    return {
      success: true,
      data: data.assessmentReport
    }
  }
}

// User API functions
export const userAPI = {
  // Register learner for course
  async registerLearner(courseId, learnerId) {
    await delay(300)
    return {
      success: true,
      data: {
        enrollmentId: `enrollment_${Date.now()}`,
        learnerId,
        courseId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      }
    }
  },

  // Submit feedback
  async submitFeedback(courseId, learnerId, rating, comments) {
    await delay(250)
    return {
      success: true,
      data: {
        feedbackId: `feedback_${Date.now()}`,
        learnerId,
        courseId,
        rating,
        comments,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }
    }
  },

  // Get user progress
  async getUserProgress(learnerId) {
    await delay(200)
    const data = await mockResponses.userProgress()
    return {
      success: true,
      data: data
    }
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
    await delay(300)
    const data = await mockResponses.learningPaths()
    return {
      success: true,
      data: data.learningPaths
    }
  },

  // Get learning path by ID
  async getLearningPath(pathId) {
    await delay(200)
    const data = await mockResponses.learningPaths()
    const path = data.learningPaths.find(p => p.id === pathId)
    return {
      success: !!path,
      data: path || null
    }
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
    await delay(200)
    const data = await mockResponses.achievements()
    return {
      success: true,
      data: data.achievements
    }
  },

  // Get leaderboards
  async getLeaderboards() {
    await delay(300)
    const data = await mockResponses.achievements()
    return {
      success: true,
      data: data.leaderboards
    }
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

