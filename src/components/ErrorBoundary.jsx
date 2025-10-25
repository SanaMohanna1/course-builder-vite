import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          margin: 'var(--spacing-lg)'
        }}>
          <div className="error-icon" style={{
            fontSize: '4rem',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--accent-orange)'
          }}>
            ⚠️
          </div>
          <h2 style={{ 
            color: 'var(--text-primary)', 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: 'var(--spacing-md)'
          }}>
            Something went wrong
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--spacing-lg)',
            lineHeight: '1.6'
          }}>
            We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <button 
              onClick={this.handleRetry}
              className="btn btn-primary"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: 'var(--spacing-lg)', 
              textAlign: 'left',
              background: 'var(--bg-secondary)',
              padding: 'var(--spacing-md)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.8rem',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

