import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import useUserStore from '../store/useUserStore'
import CourseStructure from '../components/CourseStructure'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Download, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageCircle,
  Bookmark,
  Share2,
  ArrowLeft
} from 'lucide-react'

function LessonPage() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { updateCourseProgress } = useUserStore()
  
  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Video/Media state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Lesson state
  const [isCompleted, setIsCompleted] = useState(false)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    console.log('LessonPage mounted with courseId:', courseId, 'lessonId:', lessonId)
    // Reset lesson state when navigating to a new lesson
    setIsCompleted(false)
    setExerciseCompleted(false)
    setRating(0)
    setNotes('')
    setBookmarked(false)
    loadCourseData()
  }, [courseId, lessonId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      // Load course data
      const courseResponse = await api.course.getCourse(courseId)
      if (courseResponse.success) {
        setCourse(courseResponse.data)
      }
      
      // Load lessons
      const lessonsResponse = await api.course.getCourseLessons(courseId)
      if (lessonsResponse.success) {
        setLessons(lessonsResponse.data)
        
        // Find current lesson
        const currentLesson = lessonsResponse.data.find(l => l.id === lessonId)
        if (currentLesson) {
          setLesson(currentLesson)
        } else {
          setError('Lesson not found')
        }
      }
    } catch (error) {
      console.error('Error loading course data:', error)
      setError('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleCompleteLesson = async () => {
    try {
      await api.user.updateLessonProgressById(lessonId, 'learner_001', courseId, true)
      setIsCompleted(true)
      
      // Update course progress
      const progress = Math.min(((lessons.findIndex(l => l.id === lessonId) + 1) / lessons.length) * 100, 100)
      updateCourseProgress(courseId, progress, new Date().toISOString())
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const handlePreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1]
      navigate(`/course/${courseId}/lesson/${prevLesson.id}`)
    }
  }

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }

  const handleExerciseSubmit = () => {
    // Mark exercise as completed
    setExerciseCompleted(true)
    // You could add API call here to save exercise completion
    console.log('Exercise submitted and marked as completed')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="service-icon mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
            <BookOpen size={32} />
          </div>
          <h1 className="hero-content h1 mb-4" style={{ color: 'var(--text-primary)' }}>Lesson Not Found</h1>
          <p className="hero-content p mb-6" style={{ color: 'var(--text-secondary)' }}>{error || 'The lesson you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate(`/study/${courseId}`)}
            className="btn btn-primary"
          >
            Back to Course
          </button>
        </div>
      </div>
    )
  }

  const currentIndex = lessons.findIndex(l => l.id === lessonId)
  const progress = ((currentTime / duration) * 100) || 0
  
  // Check if all lessons are completed (for exam access)
  const completedLessons = lessons.filter(lesson => lesson.completed).length
  const allLessonsCompleted = completedLessons === lessons.length

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-tertiary)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/study/${courseId}`)}
                className="flex items-center transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Course
              </button>
              <div className="h-6 w-px" style={{ background: 'var(--bg-tertiary)' }}></div>
              <div>
                <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{course?.title}</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Lesson {currentIndex + 1} of {lessons.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
                style={{ 
                  background: bookmarked ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                  color: bookmarked ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Bookmark size={20} />
              </button>
              <button 
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative microservice-card">
          <div className="aspect-video flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
            {lesson.type === 'video' ? (
              <div className="text-center" style={{ color: 'var(--text-primary)' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
                  <Play size={32} style={{ color: 'white' }} />
                </div>
                <p className="text-lg font-semibold">Video Player</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Duration: {lesson.duration}</p>
              </div>
            ) : (
              <div className="text-center p-8" style={{ color: 'var(--text-primary)' }}>
                <BookOpen size={64} className="mx-auto mb-4" style={{ color: 'var(--primary-cyan)' }} />
                <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Interactive Lesson Content</p>
              </div>
            )}
          </div>
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <div className="flex-1">
                <div className="bg-gray-600 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progress}%`,
                      background: 'var(--gradient-primary)'
                    }}
                  ></div>
                </div>
              </div>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              <button
                onClick={handleVolumeToggle}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <button className="text-white hover:text-cyan-400 transition-colors">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 p-8" style={{ minHeight: '70vh' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <h2 className="hero-content h1 mb-2" style={{ color: 'var(--text-primary)' }}>{lesson.title}</h2>
                <div className="flex items-center space-x-4 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {lesson.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    {lesson.type === 'video' ? 'Video Lesson' : 'Interactive Lesson'}
                  </div>
                </div>
                
                {/* Course Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Course Progress
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {completedLessons} of {lessons.length} lessons completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2" style={{ background: 'var(--bg-tertiary)' }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(completedLessons / lessons.length) * 100}%`,
                        background: allLessonsCompleted ? 'var(--accent-green)' : 'var(--gradient-primary)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rate this lesson:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                      style={{ color: star <= rating ? 'var(--accent-gold)' : 'var(--text-muted)' }}
                    >
                      <Star size={16} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lesson Description */}
            <div className="microservice-card mb-6">
              <h3 className="microservice-card h3 mb-4" style={{ color: 'var(--text-primary)' }}>Lesson Overview</h3>
              <p className="microservice-card p" style={{ color: 'var(--text-secondary)' }}>
                {lesson.description || 'This lesson covers important concepts and practical applications.'}
              </p>
            </div>

            {/* Lesson Content */}
            <div className="microservice-card mb-8">
              <h3 className="microservice-card h3 mb-6" style={{ color: 'var(--text-primary)' }}>Lesson Content</h3>
              <div className="prose max-w-none text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {lesson.content || 'Lesson content will be displayed here. This could include text, images, code examples, and interactive elements.'}
              </div>
            </div>

            {/* Exercise Section */}
            {lesson.exercise && (
              <div className="microservice-card mb-8">
                <h3 className="microservice-card h3 mb-6" style={{ color: 'var(--text-primary)' }}>
                  <BookOpen className="inline mr-2" size={20} />
                  Exercise
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" style={{ 
                  background: 'var(--bg-secondary)', 
                  borderColor: 'var(--primary-cyan)',
                  borderWidth: '1px'
                }}>
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {lesson.exercise.title || 'Practice Exercise'}
                  </h4>
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {lesson.exercise.description || 'Complete this exercise to reinforce your learning.'}
                  </p>
                  <div className="space-y-3">
                    {lesson.exercise.questions?.map((question, index) => (
                      <div key={index} className="border rounded-lg p-4" style={{ 
                        borderColor: 'var(--bg-tertiary)',
                        background: 'var(--bg-card)'
                      }}>
                        <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`question-${index}`}
                                className="text-blue-600"
                              />
                              <span style={{ color: 'var(--text-secondary)' }}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    {exerciseCompleted ? (
                      <div className="flex items-center gap-2 text-green-600" style={{ color: 'var(--accent-green)' }}>
                        <CheckCircle size={20} />
                        <span className="font-medium">Exercise Completed!</span>
                      </div>
                    ) : (
                      <button 
                        onClick={handleExerciseSubmit}
                        className="btn btn-primary"
                      >
                        Submit Exercise
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <div className="microservice-card mb-8">
                <h3 className="microservice-card h3 mb-6" style={{ color: 'var(--text-primary)' }}>Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.resources.map((resource, index) => (
                    <div key={index} className="floating-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                            <Download size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{resource.name}</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{resource.type}</p>
                          </div>
                        </div>
                        <button className="transition-colors" style={{ color: 'var(--primary-cyan)' }}>
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="microservice-card mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="microservice-card h3" style={{ color: 'var(--text-primary)' }}>Notes</h3>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center space-x-2 transition-colors"
                  style={{ color: 'var(--primary-cyan)' }}
                >
                  <MessageCircle size={16} />
                  <span>{showNotes ? 'Hide Notes' : 'Show Notes'}</span>
                </button>
              </div>
              
              {showNotes && (
                <div className="floating-card">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes here..."
                    className="w-full h-32 resize-none border-none outline-none"
                    style={{ 
                      background: 'transparent',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousLesson}
                disabled={currentIndex === 0}
                className="btn btn-secondary flex items-center gap-2"
                style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              
              <button
                onClick={handleCompleteLesson}
                disabled={isCompleted}
                className={`btn ${isCompleted ? 'btn-success' : 'btn-primary'} flex items-center gap-2`}
                style={{ opacity: isCompleted ? 0.7 : 1 }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Completed</span>
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </button>
              
              {/* Show Next button or Exam button based on completion status */}
              {currentIndex === lessons.length - 1 && allLessonsCompleted ? (
                <button
                  onClick={() => navigate(`/assessment/${courseId}`)}
                  className="btn btn-primary flex items-center gap-2"
                  style={{ background: 'var(--accent-gold)', border: 'none' }}
                >
                  <BookOpen size={16} />
                  <span>Take Final Exam</span>
                </button>
              ) : (
                <button
                  onClick={handleNextLesson}
                  disabled={currentIndex === lessons.length - 1 && !allLessonsCompleted}
                  className="btn btn-primary flex items-center gap-2"
                  style={{ opacity: currentIndex === lessons.length - 1 && !allLessonsCompleted ? 0.5 : 1 }}
                >
                  <span>{currentIndex === lessons.length - 1 ? 'Complete All Lessons First' : 'Next Lesson'}</span>
                  <ChevronRight size={16} />
                </button>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Course Structure */}
      <div className="w-80 border-l" style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-tertiary)' }}>
        <CourseStructure courseId={courseId} currentLessonId={lessonId} />
      </div>
    </div>
  )
}

export default LessonPage