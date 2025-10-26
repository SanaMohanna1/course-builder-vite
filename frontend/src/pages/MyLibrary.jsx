import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import LoadingSpinner from '../components/LoadingSpinner'
import Container from '../components/Container'
import { courseAPI } from '../services/api'

function MyLibrary() {
  const { enrolledCourses, getCourseProgress } = useUserStore()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      setIsLoading(true)
      try {
        // Load all courses from backend API
        const response = await courseAPI.getCourses()
        if (response.success) {
          // Filter to only enrolled courses
          const enrolled = response.data.filter(course => enrolledCourses.includes(course.id))
          setCourses(enrolled)
        }
      } catch (error) {
        console.error('Failed to load enrolled courses:', error)
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    loadEnrolledCourses()
  }, [enrolledCourses])

  if (isLoading) {
    return <LoadingSpinner message="Loading your library..." />
  }

  const getProgressStats = () => {
    const total = courses.length
    const completed = courses.filter(course => {
      const progress = getCourseProgress(course.id)
      return progress.progressPercentage === 100
    }).length
    const inProgress = total - completed
    
    return { total, completed, inProgress }
  }

  const stats = getProgressStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-1 mb-4">
            My Learning Library
          </h1>
          <p className="body-text-lg max-w-3xl mx-auto">
            Track your progress, continue learning, and manage your enrolled courses.
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="heading-3 mb-2">No enrolled courses</h3>
            <p className="body-text mb-6">
              Start your learning journey by enrolling in courses from the marketplace.
            </p>
            <Link to="/marketplace" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map(course => {
              const progress = getCourseProgress(course.id)
              const isCompleted = progress.progressPercentage === 100
              
              return (
                <div key={course.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="heading-4 mb-2">{course.title}</h3>
                      <p className="body-text text-sm mb-3">{course.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {course.instructor}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.metadata.duration}
                        </span>
                        <span className={`badge ${isCompleted ? 'badge-green' : 'badge-blue'}`}>
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.progressPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Last accessed: {progress.lastAccessed || 'Never'}
                    </div>
                    <div className="flex space-x-3">
                      {isCompleted ? (
                        <Link
                          to={`/feedback/${course.id}`}
                          className="btn btn-success"
                        >
                          View Certificate
                        </Link>
                      ) : (
                        <Link
                          to={`/study/${course.id}`}
                          className="btn btn-primary"
                        >
                          Continue Learning
                        </Link>
                      )}
                      <Link
                        to={`/course/${course.id}`}
                        className="btn btn-secondary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}

export default MyLibrary