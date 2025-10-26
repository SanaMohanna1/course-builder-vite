import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import useUserStore from '../store/useUserStore'
import { courseAPI } from '../services/api'

function Assessment() {
  const { id } = useParams()
  const { currentUser, getCourseProgress } = useUserStore()
  const [course, setCourse] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(null)

  useEffect(() => {
    const loadAssessment = async () => {
      setIsLoading(true)
      try {
        // Load course data from backend API
        const courseResponse = await courseAPI.getCourse(id)
        if (!courseResponse.success) {
          throw new Error('Course not found')
        }

        setCourse(courseResponse.data)

        // Generate assessment questions based on course content
        const questions = generateAssessmentQuestions(courseResponse.data)
        setAssessment({
          id: `assessment_${id}_${Date.now()}`,
          courseId: id,
          questions,
          timeLimit: 60, // 60 minutes
          passingScore: 70
        })
      } catch (error) {
        console.error('Failed to load assessment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessment()
  }, [id])

  const generateAssessmentQuestions = (course) => {
    // Generate questions based on course content
    const baseQuestions = [
      {
        id: 'q1',
        question: `What is the main purpose of ${course.metadata?.skills?.[0] || 'this technology'}?`,
        options: [
          'To simplify development',
          'To increase complexity',
          'To reduce performance',
          'To limit functionality'
        ],
        correctAnswer: 0,
        explanation: 'This technology is designed to simplify development processes.'
      },
      {
        id: 'q2',
        question: `Which of the following is a key feature of ${course.metadata?.skills?.[1] || 'this framework'}?`,
        options: [
          'Component-based architecture',
          'Server-side rendering only',
          'No state management',
          'Limited scalability'
        ],
        correctAnswer: 0,
        explanation: 'Component-based architecture is a fundamental feature.'
      },
      {
        id: 'q3',
        question: `What is the recommended approach for ${course.metadata?.skills?.[2] || 'state management'}?`,
        options: [
          'Use built-in state management',
          'Avoid state management',
          'Use external libraries only',
          'Manual DOM manipulation'
        ],
        correctAnswer: 0,
        explanation: 'Built-in state management is the recommended approach.'
      },
      {
        id: 'q4',
        question: `How should you handle ${course.metadata?.skills?.[3] || 'asynchronous operations'}?`,
        options: [
          'Use async/await or Promises',
          'Use only callbacks',
          'Avoid async operations',
          'Use synchronous methods only'
        ],
        correctAnswer: 0,
        explanation: 'Async/await and Promises are the modern approaches.'
      },
      {
        id: 'q5',
        question: `What is the best practice for ${course.metadata?.skills?.[4] || 'component design'}?`,
        options: [
          'Keep components small and focused',
          'Make components as large as possible',
          'Avoid component composition',
          'Use only class components'
        ],
        correctAnswer: 0,
        explanation: 'Small, focused components are easier to maintain and test.'
      }
    ]

    return baseQuestions
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Calculate score
      let correctAnswers = 0
      assessment.questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++
        }
      })

      const percentage = Math.round((correctAnswers / assessment.questions.length) * 100)
      const passed = percentage >= assessment.passingScore

      setScore({
        correct: correctAnswers,
        total: assessment.questions.length,
        percentage,
        passed
      })

      setIsCompleted(true)

      // Simulate API call to save assessment results
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Failed to submit assessment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Preparing assessment..." />
  }

  if (!course || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Not Found</h2>
          <p className="text-gray-600 mb-6">The assessment you're looking for doesn't exist.</p>
          <Link 
            to="/library"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
              score.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className="text-3xl">
                {score.passed ? '🎉' : '📚'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {score.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {score.passed 
                ? 'You have successfully completed the assessment!' 
                : 'You need more practice to pass this assessment.'
              }
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{score.correct}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{score.total}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    score.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {score.percentage}%
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
            </div>

            <div className="space-x-4">
              <Link
                to={`/feedback/${id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Provide Feedback
              </Link>
              <Link
                to="/library"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = assessment.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Assessment Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{course.title} - Assessment</h1>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label 
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                  answers[question.id] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={index}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswerSelect(question.id, index)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  answers[question.id] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentQuestion === assessment.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assessment

