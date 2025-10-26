import { Link } from 'react-router-dom'
import { Star, Clock, Users, Play, Award, BookOpen } from 'lucide-react'

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
    'intermediate': 'badge-gold',
    'advanced': 'badge-red',
    'adaptive': 'badge-purple'
  }

  const courseTypeConfig = {
    'general': { label: 'Marketplace', color: 'badge-blue', icon: BookOpen },
    'personalized': { label: 'Personalized', color: 'badge-purple', icon: Award }
  }

  const typeConfig = courseTypeConfig[courseType] || courseTypeConfig['general']
  const TypeIcon = typeConfig.icon

  return (
    <div className="microservice-card">
      {/* Course Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 mr-4">
          <h3 className="microservice-card h3 mb-2">
            {title}
          </h3>
          <p className="microservice-card p text-sm">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className={`badge ${typeConfig.color} flex items-center gap-1`}>
            <TypeIcon size={12} />
            {typeConfig.label}
          </span>
          <span className={`badge ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Course Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500" />
          <span className="font-medium">{courseRating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{course.students || 0} students</span>
        </div>
      </div>

      {/* Instructor */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Instructor:</span> {instructor || 'Unknown Instructor'}
        </p>
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge badge-blue text-xs">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="badge badge-blue text-xs">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Price and Action */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isFree ? (
            <span className="text-lg font-bold text-green-600">Free</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">${coursePrice}</span>
              {coursePrice > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ${Math.round(coursePrice * 1.2)}
                </span>
              )}
            </div>
          )}
        </div>
        
        {showEnrollButton && (
          <Link
            to={`/course/${id}`}
            className="btn btn-primary flex items-center gap-2"
          >
            <Play size={16} />
            {courseType === 'personalized' ? 'Start Learning' : 'Enroll Now'}
          </Link>
        )}
      </div>
    </div>
  )
}

export default CourseCard