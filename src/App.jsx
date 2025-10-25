import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy } from 'react'
import useUserStore from './store/useUserStore'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './contexts/ToastContext'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const BrowseCourses = lazy(() => import('./pages/BrowseCourses'))
const StudyCourse = lazy(() => import('./pages/StudyCourse'))
const Feedback = lazy(() => import('./pages/Feedback'))
const CreateCourse = lazy(() => import('./pages/CreateCourse'))

function App() {
  const { currentUser, userRole, loginAsTrainer, loginAsLearner } = useUserStore()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auto-login as learner for demo (in production, user would come from auth microservice)
  useEffect(() => {
    if (!currentUser) {
      loginAsLearner() // Default to learner for demo
    }
  }, [currentUser, loginAsLearner])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getNavigationItems = () => {
    return [
      { href: '/', label: 'My Learning' },
      { href: '/browse', label: 'Browse Courses' },
      { href: '/library', label: 'My Library' },
      { href: '/achievements', label: 'Achievements' }
    ]
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <div className={`min-h-screen ${isDarkMode ? 'night-mode' : 'day-mode'}`} style={{ background: 'var(--bg-primary)' }}>
        {/* Animated Background */}
        <div className="bg-animation"></div>
        
        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        <header className="header">
          <div className="nav-container">
            <div className="flex items-center">
              <h1 className="logo">
                Course Builder
              </h1>
                  {currentUser && (
                    <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full" style={{ 
                      background: 'var(--accent-green)', 
                      color: 'white' 
                    }}>
                      Learner
                    </span>
                  )}
            </div>
              
            <div className="flex items-center space-x-6">
              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ display: 'none' }}
              >
                ☰
              </button>
              
              <nav className="nav-links">
                {getNavigationItems().map((item) => (
                  <Link key={item.href} to={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="theme-toggle"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
                
              {currentUser && (
                <div className="user-profile">
                  <div className="user-details">
                    <span className="user-name">Welcome, {currentUser.name}</span>
                    <span className="user-role">({userRole})</span>
                  </div>
                  
                      {/* Learner Profile Actions */}
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-secondary"
                          style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          📚 My Library
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          🏆 Achievements
                        </button>
                      </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {getNavigationItems().map((item) => (
              <Link 
                key={item.href} 
                to={item.href} 
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ 
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <main className="flex-1" style={{ marginTop: '80px' }}>
          <Suspense fallback={
            <div className="loading">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseCourses />} />
              <Route path="/library" element={<Dashboard />} />
              <Route path="/achievements" element={<Dashboard />} />
              <Route path="/course/:id" element={<StudyCourse />} />
              <Route path="/feedback/:id" element={<Feedback />} />
            </Routes>
          </Suspense>
        </main>
        
        <footer style={{ 
          background: 'var(--bg-card)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 'var(--spacing-lg) 0',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
            <p>© 2024 Course Builder. Built with Vite + React.</p>
          </div>
        </footer>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
