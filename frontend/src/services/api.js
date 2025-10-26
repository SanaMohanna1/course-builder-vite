// API service for Course Builder
// Supports both local development (localhost) and production (mock data)

// Check if we're in development mode
const isLocal = import.meta.env.DEV;

// Backend API base URL for local development
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper function for delays (for mock operations)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API requests (local development only)
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

// Helper function to load mock data
const loadMockData = async (mockPath) => {
  try {
    const response = await import(mockPath)
    return response.default
  } catch (error) {
    console.error(`Failed to load mock data from ${mockPath}:`, error)
    return null
  }
}

// Course API functions
export const courseAPI = {
  // Get all courses
  async getCourses() {
    try {
      if (isLocal) {
        return await apiRequest('/api/courses')
      } else {
        const marketplaceData = await loadMockData('../mock/marketplace.json')
        const personalizedData = await loadMockData('../mock/personalized.json')
        
        if (!marketplaceData || !personalizedData) {
          return { success: false, data: [] }
        }
        
        const allCourses = [...marketplaceData.courses, ...personalizedData.courses]
        return { success: true, data: allCourses }
      }
    } catch (error) {
      console.error("Failed to load courses:", error)
      return { success: false, data: [] }
    }
  },

  // Get single course by ID
  async getCourse(id) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/courses/${id}`)
      } else {
        const marketplaceData = await loadMockData('../mock/marketplace.json')
        const personalizedData = await loadMockData('../mock/personalized.json')
        
        if (!marketplaceData || !personalizedData) {
          return { success: false, data: null }
        }
        
        const allCourses = [...marketplaceData.courses, ...personalizedData.courses]
        const course = allCourses.find(c => c.id === id)
        
        return { success: !!course, data: course || null }
      }
    } catch (error) {
      console.error(`Failed to load course ${id}:`, error)
      return { success: false, data: null }
    }
  },

  // Get lessons for a course
  async getCourseLessons(id) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/courses/${id}/lessons`)
      } else {
        const lessonsData = await loadMockData('../mock/lessons.json')
        
        if (!lessonsData) {
          return { success: false, data: [] }
        }
        
        // Filter lessons by course ID
        const courseLessons = lessonsData.lessons.filter(lesson => lesson.courseId === id)
        return { success: true, data: courseLessons }
      }
    } catch (error) {
      console.error(`Failed to load lessons for course ${id}:`, error)
      return { success: false, data: [] }
    }
  },

  // Create new course (mock operation)
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

  // Publish course (mock operation)
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
    try {
      if (isLocal) {
        return await apiRequest('/api/skills/expand', {
          method: 'POST',
          body: JSON.stringify({ description, generalSkills })
        })
      } else {
        await delay(800) // Simulate processing time
        return {
          success: true,
          data: {
            expandedSkills: [
              "React", "JavaScript", "JSX", "Hooks", "State Management", 
              "Component Design", "React Router", "Context API"
            ]
          }
        }
      }
    } catch (error) {
      console.error("Failed to expand skills:", error)
      return { success: false, data: { expandedSkills: [] } }
    }
  }
}

// Content Studio API functions
export const contentAPI = {
  // Generate lessons from Content Studio
  async generateLessons(courseId, structure, skills) {
    try {
      if (isLocal) {
        return await apiRequest('/api/content/generate', {
          method: 'POST',
          body: JSON.stringify({ courseId, structure, skills })
        })
      } else {
        await delay(1000) // Simulate processing time
        return {
          success: true,
          data: {
            generatedContent: {
              lessons: [
                {
                  id: `lesson_${Date.now()}`,
                  title: "Generated Lesson 1",
                  description: "AI-generated lesson content",
                  duration: "45 minutes",
                  type: "video"
                }
              ]
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate lessons:", error)
      return { success: false, data: { generatedContent: { lessons: [] } } }
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
    try {
      if (isLocal) {
        return await apiRequest(`/api/assessment/${assessmentId}/report`)
      } else {
        await delay(300)
        return {
          success: true,
          data: {
            assessmentId,
            score: 85,
            totalQuestions: 25,
            correctAnswers: 21,
            completedAt: new Date().toISOString(),
            feedback: "Great job! You have a solid understanding of the concepts."
          }
        }
      }
    } catch (error) {
      console.error(`Failed to load assessment report ${assessmentId}:`, error)
      return { success: false, data: null }
    }
  }
}

// User API functions
export const userAPI = {
  // Register learner for course
  async registerLearner(courseId, learnerId) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/courses/${courseId}/enroll`, {
          method: 'POST',
          body: JSON.stringify({ learnerId })
        })
      } else {
        await delay(200)
        return {
          success: true,
          data: {
            enrollmentId: `enrollment_${Date.now()}`,
            courseId,
            learnerId,
            enrolledAt: new Date().toISOString(),
            status: 'active'
          }
        }
      }
    } catch (error) {
      console.error(`Failed to register learner for course ${courseId}:`, error)
      return { success: false, data: null }
    }
  },

  // Submit feedback
  async submitFeedback(courseId, learnerId, rating, comments) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/courses/${courseId}/feedback`, {
          method: 'POST',
          body: JSON.stringify({ learnerId, rating, comments })
        })
      } else {
        await delay(300)
        return {
          success: true,
          data: {
            feedbackId: `feedback_${Date.now()}`,
            courseId,
            learnerId,
            rating,
            comments,
            submittedAt: new Date().toISOString()
          }
        }
      }
    } catch (error) {
      console.error(`Failed to submit feedback for course ${courseId}:`, error)
      return { success: false, data: null }
    }
  },

  // Get user progress
  async getUserProgress(learnerId) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/user/${learnerId}/progress`)
      } else {
        const progressData = await loadMockData('../mock/user-progress.json')
        
        if (!progressData) {
          return { success: false, data: null }
        }
        
        const userProgress = progressData.progress[learnerId] || null
        return { success: true, data: userProgress }
      }
    } catch (error) {
      console.error(`Failed to load user progress for ${learnerId}:`, error)
      return { success: false, data: null }
    }
  },

  // Get user achievements
  async getUserAchievements(learnerId) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/user/${learnerId}/achievements`)
      } else {
        const achievementsData = await loadMockData('../mock/achievements.json')
        
        if (!achievementsData) {
          return { success: false, data: [] }
        }
        
        return { success: true, data: achievementsData.achievements }
      }
    } catch (error) {
      console.error(`Failed to load user achievements for ${learnerId}:`, error)
      return { success: false, data: [] }
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
    try {
      if (isLocal) {
        return await apiRequest('/api/learning-paths')
      } else {
        const pathsData = await loadMockData('../mock/learning-paths.json')
        
        if (!pathsData) {
          return { success: false, data: [] }
        }
        
        return { success: true, data: pathsData.learningPaths }
      }
    } catch (error) {
      console.error("Failed to load learning paths:", error)
      return { success: false, data: [] }
    }
  },

  // Get learning path by ID
  async getLearningPath(pathId) {
    try {
      if (isLocal) {
        return await apiRequest(`/api/learning-paths/${pathId}`)
      } else {
        const pathsData = await loadMockData('../mock/learning-paths.json')
        
        if (!pathsData) {
          return { success: false, data: null }
        }
        
        const path = pathsData.learningPaths.find(p => p.id === pathId)
        return { success: !!path, data: path || null }
      }
    } catch (error) {
      console.error(`Failed to load learning path ${pathId}:`, error)
      return { success: false, data: null }
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
    try {
      if (isLocal) {
        return await apiRequest(`/api/user/${learnerId}/achievements`)
      } else {
        const achievementsData = await loadMockData('../mock/achievements.json')
        
        if (!achievementsData) {
          return { success: false, data: [] }
        }
        
        return { success: true, data: achievementsData.achievements }
      }
    } catch (error) {
      console.error(`Failed to load user achievements for ${learnerId}:`, error)
      return { success: false, data: [] }
    }
  },

  // Get leaderboards
  async getLeaderboards() {
    try {
      if (isLocal) {
        return await apiRequest('/api/achievements/leaderboards')
      } else {
        const achievementsData = await loadMockData('../mock/achievements.json')
        
        if (!achievementsData) {
          return { success: false, data: [] }
        }
        
        return { success: true, data: achievementsData.leaderboards }
      }
    } catch (error) {
      console.error("Failed to load leaderboards:", error)
      return { success: false, data: [] }
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