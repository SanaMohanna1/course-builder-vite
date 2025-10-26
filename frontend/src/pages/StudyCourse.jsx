import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import LoadingSpinner from '../components/LoadingSpinner'
import Container from '../components/Container'
import CourseStructure from '../components/CourseStructure'
import api from '../services/api'

function StudyCourse() {
  const { id } = useParams()
  const { currentUser, enrollInCourse, isEnrolled, getCourseProgress, updateCourseProgress } = useUserStore()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourseData = async () => {
      setIsLoading(true)
      try {
        // Load course data from backend API
        const courseResponse = await api.course.getCourse(id)
        if (courseResponse.success) {
          setCourse(courseResponse.data)
          
          // Load lessons from backend API
          const lessonsResponse = await api.course.getCourseLessons(id)
          if (lessonsResponse.success) {
            setLessons(lessonsResponse.data)
          }
        }
      } catch (error) {
        console.error('Failed to load course data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourseData()
  }, [id])

  const handleEnroll = () => {
    if (course) {
      enrollInCourse(course.id)
    }
  }

  const handleLessonComplete = (lessonId) => {
    const progress = getCourseProgress(id)
    const newProgress = Math.min(progress.progressPercentage + (100 / lessons.length), 100)
    updateCourseProgress(id, newProgress, new Date().toISOString())
  }

  const handleTakeExam = () => {
    // Navigate to assessment page
    window.location.href = `/assessment/${id}`
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading course..." />
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <div className="text-center">
            <h1 className="heading-1 mb-4">Course Not Found</h1>
            <p className="body-text mb-6">The course you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const progress = getCourseProgress(id)
  const isEnrolledInCourse = isEnrolled(id)
  const isPersonalized = course.courseType === 'personalized'

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Course Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="heading-1 mb-4">{course.title}</h1>
              <p className="body-text-lg mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
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
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.metadata.difficulty}
                </span>
              </div>
            </div>
            
            <div className="ml-6">
              <span className={`badge ${isPersonalized ? 'badge-purple' : 'badge-blue'}`}>
                {isPersonalized ? 'Personalized' : 'Marketplace'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Course Progress</span>
              <span>{progress.progressPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isEnrolledInCourse && !isPersonalized ? (
            <div className="text-center py-8">
              <h3 className="heading-3 mb-4">Enroll to Start Learning</h3>
              <p className="body-text mb-6">
                Join this course to access all lessons, resources, and assessments.
              </p>
              <button onClick={handleEnroll} className="btn btn-primary">
                Enroll Now
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {isPersonalized ? 'AI-Powered Learning' : 'Enrolled Course'}
              </div>
              <div className="flex space-x-3">
                <button onClick={handleTakeExam} className="btn btn-success">
                  Take Exam
                </button>
                <Link to={`/course/${id}`} className="btn btn-secondary">
                  Course Details
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Course Structure */}
        {isEnrolledInCourse || isPersonalized ? (
          <CourseStructure courseId={id} />
        ) : null}
      </Container>
    </div>
  )
}

export default StudyCourse