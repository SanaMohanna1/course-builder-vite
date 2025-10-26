import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseAPI } from '../services/api'
import { useUserStore } from '../store/useUserStore'
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
  Share2
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
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [rating, setRating] = useState(0)
  
  // Progress tracking
  const [progress, setProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    console.log('LessonPage mounted with courseId:', courseId, 'lessonId:', lessonId)
    loadCourseData()
  }, [courseId, lessonId])

  useEffect(() => {
    // Track time spent on lesson
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      const [courseResponse, lessonsResponse] = await Promise.all([
        courseAPI.getCourse(courseId),
        courseAPI.getCourseLessons(courseId)
      ])
      
      if (courseResponse.success) {
        setCourse(courseResponse.data)
      }
      
      if (lessonsResponse.success) {
        const lessonsData = lessonsResponse.data
        setLessons(lessonsData)
        const currentLesson = lessonsData.find(l => l.id === lessonId)
        if (currentLesson) {
          setLesson(currentLesson)
          // Simulate video duration based on lesson duration
          const durationMinutes = parseInt(currentLesson.duration) || 30
          setDuration(durationMinutes * 60)
        } else {
          setError('Lesson not found')
        }
      }
    } catch (err) {
      setError('Failed to load lesson data')
      console.error('Error loading lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress)
    setCurrentTime((newProgress / 100) * duration)
  }

  const handleCompleteLesson = async () => {
    try {
      setIsCompleted(true)
      // Update progress in backend
      await courseAPI.updateLessonProgressById(lessonId, 'learner_001', courseId, true)
      // Update local progress
      updateCourseProgress(courseId, progress, new Date().toISOString())
      
      // Move to next lesson or course completion
      const currentIndex = lessons.findIndex(l => l.id === lessonId)
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1]
        navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
      } else {
        // Course completed
        navigate(`/course/${courseId}/complete`)
      }
    } catch (err) {
      console.error('Error completing lesson:', err)
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested lesson could not be found.'}</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    )
  }

  const currentIndex = lessons.findIndex(l => l.id === lessonId)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < lessons.length - 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Course
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{course?.title}</h1>
              <p className="text-sm text-gray-500">Lesson {currentIndex + 1} of {lessons.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg ${bookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="bg-black relative">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {lesson.type === 'video' ? (
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm text-gray-400">Duration: {lesson.duration}</p>
                </div>
              ) : (
                <div className="text-center text-white p-8">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                  <p className="text-gray-300">Interactive Lesson Content</p>
                </div>
              )}
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-blue-400"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <div className="flex-1">
                  <div className="bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                
                <button
                  onClick={handleVolumeToggle}
                  className="text-white hover:text-blue-400"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button className="text-white hover:text-blue-400">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {lesson.type === 'video' ? 'Video Lesson' : 'Interactive Lesson'}
                    </div>
                    {isCompleted && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson Description */}
              <div className="prose max-w-none mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">{lesson.content}</p>
                </div>
              </div>

              {/* Resources */}
              {lesson.resources && lesson.resources.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lesson.resources.map((resource) => (
                      <div key={resource.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{resource.title}</h4>
                            <p className="text-sm text-gray-500 mb-3 capitalize">{resource.type}</p>
                            {resource.content && (
                              <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded border overflow-x-auto">
                                {resource.content}
                              </pre>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                  </button>
                </div>
                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes about this lesson..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={!hasPrevious}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNextLesson}
                    disabled={!hasNext}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Question
                  </button>
                  
                  <button
                    onClick={handleCompleteLesson}
                    disabled={isCompleted}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Structure */}
        <div className="w-80 bg-white border-l border-gray-200">
          <CourseStructure courseId={courseId} currentLessonId={lessonId} />
        </div>
      </div>
    </div>
  )
}

export default LessonPage
