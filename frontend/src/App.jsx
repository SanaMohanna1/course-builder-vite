import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy } from 'react'
import useUserStore from './store/useUserStore'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './contexts/ToastContext'
import Container from './components/Container'

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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getNavigationItems = () => {
    return [
      { href: '/', label: 'Home' },
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/personalized', label: 'For You' },
      { href: '/library', label: 'My Library' }
    ]
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
              <Container>
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">CB</span>
                      </div>
                      <h1 className="text-xl font-bold text-gray-900">
                        Course Builder
                      </h1>
                    </Link>
                    {currentUser && (
                      <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Learner
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                      className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    
                    <nav className="hidden md:flex space-x-1">
                      {getNavigationItems().map((item) => (
                        <Link 
                          key={item.href} 
                          to={item.href} 
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    
                    {/* Dark Mode Toggle */}
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
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
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">Welcome, {currentUser.name}</div>
                          <div className="text-xs text-gray-500">({userRole})</div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to="/library"
                            className="btn btn-secondary text-xs"
                          >
                            My Library
                          </Link>
                          <Link
                            to="/achievements"
                            className="btn btn-secondary text-xs"
                          >
                            Achievements
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Container>
            </header>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-white border-b border-gray-200">
                <Container>
                  <nav className="py-2 space-y-1">
                    {getNavigationItems().map((item) => (
                      <Link 
                        key={item.href} 
                        to={item.href} 
                        className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </Container>
              </div>
            )}
            
            {/* Main Content */}
            <main className="flex-1">
              <Suspense fallback={
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p className="text-gray-600">Loading...</p>
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
            
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
              <Container>
                <div className="text-center">
                  <p className="text-gray-600">© 2024 Course Builder. Built with Vite + React.</p>
                </div>
              </Container>
            </footer>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App