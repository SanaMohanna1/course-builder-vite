import { Link } from 'react-router-dom'

function CourseCard({ 
  course,
  showEnrollButton = true,
  isPersonalized = false
}) {
  if (!course) return null

  const {
    id,
    title,
    description,
    instructor,
    metadata = {},
    rating = 0,
    price = 0,
    courseType = 'general',
    skills = []
  } = course

  const difficulty = metadata.difficulty || 'intermediate'
  const duration = metadata.duration || '4 weeks'
  const courseRating = rating || 0
  const coursePrice = price || 0
  const isFree = coursePrice === 0

  const difficultyColors = {
    'beginner': 'badge-green',
    'intermediate': 'badge-yellow',
    'advanced': 'badge-red',
    'adaptive': 'badge-purple'
  }

  const courseTypeConfig = {
    'general': { label: 'Marketplace', color: 'badge-blue' },
    'personalized': { label: 'Personalized', color: 'badge-purple' }
  }

  const typeConfig = courseTypeConfig[courseType] || courseTypeConfig['general']

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="heading-4 line-clamp-2 flex-1 mr-4">
          {title}
        </h3>
        <div className="flex flex-col gap-2">
          <span className={`badge ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
          <span className={`badge ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
      </div>

      <p className="body-text text-sm mb-4 line-clamp-3">
        {description}
      </p>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Course Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {instructor || 'Unknown Instructor'}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium">{courseRating}</span>
        </div>
      </div>

      {/* Pricing */}
      {courseType === 'general' && (
        <div className="mb-6">
          {isFree ? (
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">Free</span>
              <span className="ml-2 text-sm text-gray-500">Lifetime Access</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">${coursePrice}</span>
              {coursePrice > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ${Math.round(coursePrice * 1.2)}
                </span>
              )}
              {coursePrice > 0 && (
                <span className="badge badge-red">
                  20% off
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Link
          to={`/course/${id}`}
          className="btn btn-primary flex-1"
        >
          {courseType === 'personalized' ? 'Start Learning' : 'View Details'}
        </Link>
        
        {showEnrollButton && courseType === 'general' && (
          <button className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseCard