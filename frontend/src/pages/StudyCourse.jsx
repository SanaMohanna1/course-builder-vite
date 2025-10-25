import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCourseStore from '../store/useCourseStore'
import useUserStore from '../store/useUserStore'
import LessonViewer from '../components/LessonViewer'

function StudyCourse() {
  const { id } = useParams()
  const { currentCourse, fetchCourse, isLoading } = useCourseStore()
  const { enrollInCourse, updateProgress, getCourseProgress } = useUserStore()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isEnrolled, setIsEnrolled] = useState(false)
  
  // For personalized courses, user is automatically enrolled
  const isPersonalized = currentCourse?.courseType === 'personalized'

  useEffect(() => {
    if (id) {
      fetchCourse(id)
    }
  }, [id, fetchCourse])

  // Auto-enroll in personalized courses
  useEffect(() => {
    if (isPersonalized && !isEnrolled) {
      setIsEnrolled(true)
    }
  }, [isPersonalized, isEnrolled])

  const handleEnroll = () => {
    enrollInCourse(id)
    setIsEnrolled(true)
  }

  const handleLessonComplete = (lessonId) => {
    updateProgress(id, lessonId, true)
  }

  const handleTakeTest = () => {
    // Redirect to feedback page
    window.location.href = `/feedback/${id}`
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!currentCourse) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const progress = getCourseProgress(id)
  const mockLessons = [
    {
      id: 'lesson_001',
      title: 'What is React and Why Use It?',
      content: 'React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and is now maintained by Facebook and the community. React allows you to create reusable UI components and manage the state of your application efficiently.',
      duration: '45 minutes',
      type: 'video',
      resources: [
        { type: 'video', title: 'React Introduction Video', url: '/videos/react-intro.mp4' },
        { type: 'slides', title: 'React Fundamentals Slides', url: '/slides/react-fundamentals.pdf' }
      ],
      exercises: [
        {
          id: 'exercise_001',
          type: 'quiz',
          title: 'React Basics Quiz',
          questions: [
            {
              question: 'What is React?',
              options: ['A database', 'A JavaScript library for building UIs', 'A CSS framework', 'A server-side technology'],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'lesson_002',
      title: 'Setting Up Your Development Environment',
      content: 'In this lesson, you\'ll learn how to set up a complete React development environment. We\'ll cover Node.js installation, package managers, and the tools you need to start building React applications.',
      duration: '60 minutes',
      type: 'hands-on',
      resources: [
        { type: 'setup-guide', title: 'Development Environment Setup', url: '/guides/dev-environment-setup.md' }
      ],
      exercises: [
        {
          id: 'exercise_002',
          type: 'coding',
          title: 'Create Your First React App',
          description: 'Use Create React App to create a new React application',
          starterCode: 'npx create-react-app my-first-app',
          solution: 'cd my-first-app && npm start'
        }
      ]
    },
    {
      id: 'lesson_003',
      title: 'Your First React Component',
      content: 'Now that you have your environment set up, let\'s create your first React component! We\'ll start with a simple functional component and learn about JSX syntax.',
      duration: '75 minutes',
      type: 'coding',
      resources: [
        { type: 'video', title: 'Creating React Components', url: '/videos/react-components.mp4' },
        { type: 'interactive', title: 'JSX Playground', url: '/interactive/jsx-playground' }
      ],
      exercises: [
        {
          id: 'exercise_003',
          type: 'coding',
          title: 'Build a Welcome Component',
          description: 'Create a React component that displays a welcome message',
          starterCode: 'function Welcome() {\n  // Your code here\n}',
          solution: 'function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}'
        }
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentCourse.title}</h1>
            <p className="text-gray-600 mb-4">{currentCourse.description}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>👨‍🏫 {currentCourse.trainer.name}</span>
              <span>⏱️ {currentCourse.metadata.duration}</span>
              <span>⭐ {currentCourse.feedback.averageRating}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                currentCourse.metadata.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-800'
                  : currentCourse.metadata.difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentCourse.metadata.difficulty}
              </span>
            </div>
          </div>
          {!isEnrolled && !isPersonalized ? (
            <button
              onClick={handleEnroll}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Enroll Now
            </button>
          ) : (
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-lg font-semibold text-gray-900">{progress.progressPercentage}%</div>
              {isPersonalized && (
                <div className="text-xs text-yellow-600 mt-1">🎯 Personalized Course</div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isEnrolled && !isPersonalized ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Enroll to Access Course Content</h3>
          <p className="text-yellow-700 mb-4">
            Click "Enroll Now" to start learning and access all course materials.
          </p>
        </div>
      ) : isPersonalized ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">🎯 Personalized Learning Path</h3>
          <p className="text-green-700 mb-4">
            This course is automatically available to you! It adapts to your learning style and progress.
          </p>
          <div className="flex items-center text-sm text-green-600">
            <span className="mr-2">✨</span>
            <span>AI-powered adaptive content</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              </div>
              
              <div className="p-6">
                {currentLesson < mockLessons.length ? (
                  <LessonViewer 
                    lesson={mockLessons[currentLesson]}
                    onComplete={() => {
                      handleLessonComplete(mockLessons[currentLesson].id)
                      setCurrentLesson(currentLesson + 1)
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Congratulations!</h3>
                    <p className="text-gray-600 mb-6">You've completed all lessons in this course.</p>
                    <button
                      onClick={handleTakeTest}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      Take Final Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Lessons Completed</span>
                  <span>{progress.completedLessons.length} / {mockLessons.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {progress.progressPercentage}% Complete
                </div>
              </div>
            </div>

            {/* Course Outline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Outline</h3>
              <div className="space-y-2">
                {mockLessons.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentLesson 
                        ? 'bg-blue-50 border border-blue-200' 
                        : progress.completedLessons.includes(lesson.id)
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setCurrentLesson(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-sm text-gray-600">{lesson.duration}</div>
                      </div>
                      {progress.completedLessons.includes(lesson.id) && (
                        <div className="text-green-600">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyCourse

