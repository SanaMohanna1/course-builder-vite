import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Container from '../components/Container'
import { courseAPI } from '../services/api'

function Home() {
  const { currentUser, enrolledCourses, getCourseProgress } = useUserStore()
  const [marketplaceCourses, setMarketplaceCourses] = useState([])
  const [personalizedCourses, setPersonalizedCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      try {
        // Load courses from backend API
        const response = await courseAPI.getCourses()
        if (response.success) {
          const allCourses = response.data
          // Filter marketplace courses (non-personalized)
          const marketplace = allCourses.filter(course => course.courseType !== 'personalized').slice(0, 3)
          // Filter personalized courses
          const personalized = allCourses.filter(course => course.courseType === 'personalized')
          
          setMarketplaceCourses(marketplace)
          setPersonalizedCourses(personalized)
        }
      } catch (error) {
        console.error('Failed to load courses:', error)
        // Fallback to empty arrays if API fails
        setMarketplaceCourses([])
        setPersonalizedCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  const enrolledCount = enrolledCourses.length
  const completedCount = enrolledCourses.filter(courseId => {
    const progress = getCourseProgress(courseId)
    return progress.progressPercentage === 100
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <Container className="py-16">
          <div className="text-center">
            <h1 className="heading-1 mb-4">
              Welcome back, {currentUser?.name || 'Learner'}!
            </h1>
            <p className="body-text-lg max-w-3xl mx-auto">
              Continue your learning journey and discover new skills to advance your career
            </p>
          </div>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCount}</p>
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
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personalized Learning */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="heading-3">Personalized Learning</h2>
                <p className="body-text">AI-powered courses tailored just for you</p>
              </div>
            </div>
            
            {personalizedCourses.length > 0 ? (
              <div className="space-y-4">
                {personalizedCourses.map(course => (
                  <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                      <span className="badge badge-purple">Personalized</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">{course.metadata.duration}</span>
                        <span>AI-Powered</span>
                      </div>
                      <Link
                        to={`/study/${course.id}`}
                        className="btn btn-primary text-sm"
                      >
                        Start Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="body-text mb-4">No personalized courses yet</p>
                <Link 
                  to="/personalized"
                  className="btn btn-primary"
                >
                  Get Personalized Courses
                </Link>
              </div>
            )}
          </div>

          {/* Marketplace */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="heading-3">Marketplace</h2>
                <p className="body-text">Discover courses from expert instructors</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {marketplaceCourses.map(course => (
                <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.description}</p>
                    </div>
                    <span className="badge badge-blue">Marketplace</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">{course.trainer.name}</span>
                      <span className="mr-4">{course.metadata.duration}</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {course.feedback.averageRating}
                      </span>
                    </div>
                    <Link
                      to={`/course/${course.id}`}
                      className="btn btn-primary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                to="/marketplace"
                className="btn btn-primary"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {enrolledCount > 0 && (
          <div className="card p-8 mt-8">
            <h2 className="heading-3 mb-6">Continue Learning</h2>
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="body-text mb-4">You have {enrolledCount} enrolled course{enrolledCount !== 1 ? 's' : ''}</p>
              <Link 
                to="/library"
                className="btn btn-success"
              >
                View My Library
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white mt-8">
          <h2 className="heading-2 text-white mb-4">Ready to Start Learning?</h2>
          <p className="body-text-lg text-blue-100 mb-8">
            Choose your learning path and begin your journey to mastery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/marketplace"
              className="btn bg-white text-blue-600 hover:bg-gray-100"
            >
              Browse Marketplace
            </Link>
            <Link 
              to="/personalized"
              className="btn bg-blue-500 hover:bg-blue-400 text-white"
            >
              Get Personalized
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Home