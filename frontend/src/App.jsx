import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy } from 'react'
import useUserStore from './store/useUserStore'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './contexts/ToastContext'
import Container from './components/Container'
import { Sun, Moon, Menu, X, User, BookOpen, Home as HomeIcon, ShoppingBag, Sparkles, Library } from 'lucide-react'

// Lazy load learner-focused pages
const Home = lazy(() => import('./pages/Home'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const Personalized = lazy(() => import('./pages/Personalized'))
const CourseDetails = lazy(() => import('./pages/CourseDetails'))
const StudyCourse = lazy(() => import('./pages/StudyCourse'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const Assessment = lazy(() => import('./pages/Assessment'))
const Feedback = lazy(() => import('./pages/Feedback'))
const MyLibrary = lazy(() => import('./pages/MyLibrary'))

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

  // Apply theme class to document element
  useEffect(() => {
    const themeClass = isDarkMode ? 'night-mode' : 'day-mode'
    document.documentElement.className = themeClass
    document.body.className = themeClass
  }, [isDarkMode])

  // Set initial theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const getNavigationItems = () => {
    return [
      { href: '/', label: 'Home', icon: HomeIcon },
      { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
      { href: '/personalized', label: 'For You', icon: Sparkles },
      { href: '/library', label: 'My Library', icon: Library }
    ]
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <div className={`min-h-screen ${isDarkMode ? 'night-mode' : 'day-mode'}`}>
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

            {/* Header */}
            <header className="header">
              <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="logo">
                  <img 
                    src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"} 
                    alt="Course Builder" 
                  />
                  <div className="text-container">
                    <span className="brand-name">
                      Course Builder
                    </span>
                    <span className="brand-subtitle">
                      by EDUCORE AI
                    </span>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex">
                  <ul className="nav-links">
                    {getNavigationItems().map((item) => {
                      const IconComponent = item.icon
                      return (
                        <li key={item.href}>
                          <Link to={item.href}>
                            <IconComponent size={16} />
                            {item.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>

                {/* Header Controls */}
                <div className="header-controls">
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="theme-toggle"
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>

                  {/* User Profile */}
                  {currentUser && (
                    <div className="user-profile">
                      <div className={`user-avatar ${userRole}`}>
                        <User size={20} />
                      </div>
                      <div className="user-details">
                        <div className="user-name">{currentUser.name}</div>
                        <div className="user-role">{userRole}</div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden theme-toggle"
                    aria-label="Toggle mobile menu"
                  >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {isMobileMenuOpen && (
                <div className="md:hidden" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--bg-tertiary)' }}>
                  <nav className="container py-4">
                    <ul className="space-y-2">
                      {getNavigationItems().map((item) => {
                        const IconComponent = item.icon
                        return (
                          <li key={item.href}>
                            <Link
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                              style={{ 
                                color: 'var(--text-primary)',
                                ':hover': { background: 'var(--bg-secondary)' }
                              }}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <IconComponent size={20} />
                              {item.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </div>
              )}
            </header>

            {/* Main Content */}
            <main className="pt-20">
              <Suspense fallback={
                <div className="loading">
                  <div className="loading-spinner"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/personalized" element={<Personalized />} />
                  <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
                  <Route path="/course/:id" element={<CourseDetails />} />
                  <Route path="/study/:id" element={<StudyCourse />} />
                  <Route path="/assessment/:id" element={<Assessment />} />
                  <Route path="/feedback/:id" element={<Feedback />} />
                  <Route path="/library" element={<MyLibrary />} />
                </Routes>
              </Suspense>
            </main>

            {/* Contextual Chatbot */}
            <div className="chatbot-widget visible">
              <button className="chatbot-toggle" aria-label="Open chatbot">
                <div className="chatbot-avatar">
                  <User size={24} />
                </div>
              </button>
            </div>

            {/* Accessibility Controls */}
            <button className="accessibility-toggle" aria-label="Accessibility controls">
              <User size={20} />
            </button>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App