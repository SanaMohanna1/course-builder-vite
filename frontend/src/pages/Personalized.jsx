import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Container from '../components/Container'
import { courseAPI } from '../services/api'

function Personalized() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      try {
        // Load courses from backend API
        const response = await courseAPI.getCourses()
        if (response.success) {
          // Filter only personalized courses
          const personalizedCourses = response.data.filter(course => course.courseType === 'personalized')
          setCourses(personalizedCourses)
        }
      } catch (error) {
        console.error('Failed to load personalized courses:', error)
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (isLoading) {
    return <LoadingSpinner message="Loading your personalized courses..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-1 mb-4">
            Personalized Learning
          </h1>
          <p className="body-text-lg max-w-3xl mx-auto">
            AI-powered courses tailored specifically for your learning goals, 
            skill level, and career aspirations. Start learning immediately without enrollment.
          </p>
        </div>

        {/* AI Learning Path */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="heading-3">AI-Powered Learning Path</h2>
              <p className="body-text">Courses designed specifically for your learning style and goals</p>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 mb-2">How Personalized Learning Works</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI analyzes your learning patterns and preferences</li>
                  <li>• Courses adapt to your pace and skill level</li>
                  <li>• Content is customized based on your career goals</li>
                  <li>• No enrollment required - start learning immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Courses */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="heading-3 mb-2">No personalized courses available</h3>
            <p className="body-text mb-6">
              Complete your learning profile to get AI-powered course recommendations.
            </p>
            <button className="btn btn-primary">
              Complete Learning Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard 
                key={course.id}
                course={course}
                showEnrollButton={false}
                isPersonalized={true}
              />
            ))}
          </div>
        )}

        {/* Learning Benefits */}
        <div className="mt-16">
          <h2 className="heading-2 text-center mb-8">Why Choose Personalized Learning?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Faster Learning</h3>
              <p className="body-text">
                AI-optimized content delivery helps you learn more efficiently and retain information better.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Adaptive Content</h3>
              <p className="body-text">
                Course content automatically adjusts to your learning pace and preferred style.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Career-Focused</h3>
              <p className="body-text">
                Learning paths are designed to help you achieve specific career goals and milestones.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Personalized