import React from 'react'

function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  color = 'var(--primary-cyan)'
}) {
  const sizeClasses = {
    small: { width: '20px', height: '20px', border: '2px' },
    medium: { width: '40px', height: '40px', border: '3px' },
    large: { width: '60px', height: '60px', border: '4px' }
  }

  const currentSize = sizeClasses[size] || sizeClasses.medium

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 'var(--spacing-md)'
    }}>
      <div 
        className="loading-spinner"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          border: `${currentSize.border} solid rgba(255, 255, 255, 0.1)`,
          borderTop: `${currentSize.border} solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {showMessage && (
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.9rem',
          textAlign: 'center',
          margin: 0
        }}>
          {message}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner


