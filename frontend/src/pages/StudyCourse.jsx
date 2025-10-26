import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import LoadingSpinner from '../components/LoadingSpinner'
import Container from '../components/Container'
import { courseAPI } from '../services/api'

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
        const courseResponse = await courseAPI.getCourse(id)
        if (courseResponse.success) {
          setCourse(courseResponse.data)
          
          // Load lessons from backend API
          const lessonsResponse = await courseAPI.getCourseLessons(id)
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
                  {course.trainer.name}
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

        {/* Lessons */}
        {isEnrolledInCourse || isPersonalized ? (
          <div className="card p-8">
            <h2 className="heading-2 mb-6">Course Lessons</h2>
            
            {lessons.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="heading-3 mb-2">No lessons available</h3>
                <p className="body-text">Lessons will be added to this course soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Lesson {index + 1}: {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {lesson.duration}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {lesson.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="badge badge-blue">
                          {lesson.completed ? 'Completed' : 'Not Started'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {lesson.resources?.length || 0} resources available
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleLessonComplete(lesson.id)}
                          className="btn btn-primary text-sm"
                          disabled={lesson.completed}
                        >
                          {lesson.completed ? 'Completed' : 'Start Lesson'}
                        </button>
                        <button className="btn btn-secondary text-sm">
                          View Resources
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </Container>
    </div>
  )
}

export default StudyCourse