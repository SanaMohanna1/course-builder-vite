import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import useUserStore from '../store/useUserStore'
import { courseAPI } from '../services/api'

function CourseDetails() {
  const { id } = useParams()
  const { currentUser, enrollInCourse, isEnrolled } = useUserStore()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true)
      try {
        // Load course from backend API
        const response = await courseAPI.getCourse(id)
        if (response.success) {
          setCourse(response.data)
        } else {
          throw new Error('Course not found')
        }
      } catch (error) {
        console.error('Failed to load course:', error)
        setCourse(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [id])

  const handleEnroll = async () => {
    if (!currentUser) {
      alert('Please log in to enroll in courses')
      return
    }

    setIsEnrolling(true)
    try {
      // Simulate enrollment API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      enrollInCourse(id)
      alert('Successfully enrolled in course!')
    } catch (error) {
      console.error('Enrollment failed:', error)
      alert('Failed to enroll. Please try again.')
    } finally {
      setIsEnrolling(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading course details..." />
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link 
            to="/marketplace"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  const isUserEnrolled = isEnrolled(id)
  const isPersonalized = course.courseType === 'personalized'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPersonalized 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isPersonalized ? '🎯 Personalized' : '🏪 Marketplace'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.metadata.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-800'
                      : course.metadata.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.metadata.difficulty}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-2">👨‍🏫</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span>{course.metadata.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="font-medium">{course.rating}</span>
                    <span className="ml-1">({course.students} students)</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-8 text-right">
                {isPersonalized ? (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600 mb-1">Free</div>
                    <div className="text-sm text-gray-600">AI-Powered Learning</div>
                  </div>
                ) : (
                  <div className="text-right">
                    {course.price === 0 ? (
                      <div className="text-2xl font-bold text-green-600">Free</div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-gray-900">${course.price}</div>
                        {course.price > 0 && (
                          <div className="text-sm text-gray-500 line-through">${Math.round(course.price * 1.2)}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {isUserEnrolled ? (
                <Link
                  to={`/study/${id}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                ♥ Add to Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Structure */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Course Structure</h2>
              
              {course.structure?.topics?.map((topic, topicIndex) => (
                <div key={topic.id} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {topicIndex + 1}. {topic.title}
                  </h3>
                  
                  {course.structure.modules
                    ?.filter(module => module.topicId === topic.id)
                    ?.map((module, moduleIndex) => (
                      <div key={module.id} className="ml-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {module.title}
                        </h4>
                        <div className="text-sm text-gray-600 mb-2">
                          Duration: {module.duration}
                        </div>
                        
                        {course.structure.lessons
                          ?.filter(lesson => lesson.moduleId === module.id)
                          ?.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="ml-4 flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                  {lessonIndex + 1}
                                </span>
                                <span className="text-sm text-gray-700">{lesson.title}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{lesson.duration}</span>
                                <span className="px-2 py-1 bg-gray-200 rounded">{lesson.type}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Skills You'll Learn */}
            {course.skills && course.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills You'll Learn</h2>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Be the first to review this course!</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.metadata.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effort</span>
                  <span className="font-medium">{course.metadata.effort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{course.metadata.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-medium">{course.metadata.certificate ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{course.students || 0}</span>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {course.metadata.prerequisites && course.metadata.prerequisites.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
                <ul className="space-y-2">
                  {course.metadata.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails

