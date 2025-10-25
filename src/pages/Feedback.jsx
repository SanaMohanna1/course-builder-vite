import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useUserStore from '../store/useUserStore'

function Feedback() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { submitFeedback, isLoading } = useUserStore()
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await submitFeedback(id, rating, comments)
      if (result) {
        setSubmitted(true)
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-green-600 text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Feedback</h1>
          <p className="text-gray-600">
            Help us improve by sharing your experience with this course.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              How would you rate this course?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              {rating === 0 && 'Click a star to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your thoughts about the course content, instructor, or overall experience..."
            />
          </div>

          {/* What did you like? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What did you like most about this course?
            </label>
            <div className="space-y-2">
              {[
                'Clear explanations',
                'Practical exercises',
                'Good pacing',
                'Relevant content',
                'Interactive elements'
              ].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* What could be improved? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What could be improved?
            </label>
            <div className="space-y-2">
              {[
                'More examples',
                'Better explanations',
                'Additional exercises',
                'Slower pace',
                'More interactive content'
              ].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Skip Feedback
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Feedback

