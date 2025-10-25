import { Link } from 'react-router-dom'

function CourseCard({ 
  id, 
  title, 
  description, 
  trainer, 
  difficulty = 'intermediate', 
  duration = '4 weeks', 
  rating = 4.5,
  status = 'published',
  skills = [],
  courseType = 'marketplace'
}) {
  const difficultyColors = {
    'beginner': { bg: 'var(--accent-green)', text: 'white' },
    'intermediate': { bg: 'var(--accent-gold)', text: 'white' },
    'advanced': { bg: 'var(--accent-orange)', text: 'white' }
  }

  const statusColors = {
    'published': { bg: 'var(--accent-green)', text: 'white' },
    'draft': { bg: 'var(--accent-gold)', text: 'white' },
    'archived': { bg: 'var(--text-muted)', text: 'white' }
  }

  const courseTypeColors = {
    'marketplace': { bg: 'var(--accent-green)', text: 'white', icon: '🏪' },
    'personalized': { bg: 'var(--accent-gold)', text: 'white', icon: '🎯' }
  }

  return (
    <div className="course-card" style={{
      background: 'var(--gradient-card)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: 'var(--spacing-lg)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hover Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
        transition: 'left 0.5s ease'
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
        <h3 style={{ 
          color: 'var(--text-primary)', 
          fontSize: '1.1rem', 
          fontWeight: '600',
          lineHeight: '1.4',
          flex: 1,
          marginRight: 'var(--spacing-sm)'
        }}>
          {title}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', alignItems: 'flex-end' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            background: courseTypeColors[courseType].bg,
            color: courseTypeColors[courseType].text
          }}>
            {courseTypeColors[courseType].icon} {courseType === 'personalized' ? 'Personalized' : 'Marketplace'}
          </span>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            background: difficultyColors[difficulty].bg,
            color: difficultyColors[difficulty].text
          }}>
            {difficulty}
          </span>
          <span style={{
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontWeight: '500',
            background: statusColors[status].bg,
            color: statusColors[status].text
          }}>
            {status}
          </span>
        </div>
      </div>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: 'var(--spacing-md)',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {description}
      </p>

      {/* Skills Tags */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} style={{
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span style={{
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)'
              }}>
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span>👨‍🏫 {trainer}</span>
          <span>•</span>
          <span>⏱️ {duration}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <span style={{ color: 'var(--accent-gold)' }}>⭐</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>{rating}</span>
        </div>
      </div>
      
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              {courseType === 'personalized' ? (
                <Link 
                  to={`/course/${id}`}
                  className="btn btn-primary"
                  style={{ fontSize: '0.9rem', padding: 'var(--spacing-xs) var(--spacing-md)' }}
                >
                  Start Learning
                </Link>
              ) : (
                <Link 
                  to={`/course/${id}`}
                  className="btn btn-primary"
                  style={{ fontSize: '0.9rem', padding: 'var(--spacing-xs) var(--spacing-md)' }}
                >
                  Enroll Now
                </Link>
              )}
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.9rem', padding: 'var(--spacing-xs) var(--spacing-md)' }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Add to favorites functionality
                }}
              >
                ♥
              </button>
            </div>
          </div>
    </div>
  )
}

export default CourseCard
