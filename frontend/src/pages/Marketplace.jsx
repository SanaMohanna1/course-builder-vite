import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Container from '../components/Container'
import { courseAPI } from '../services/api'

function Marketplace() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('title')

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      try {
        // Load courses from backend API
        const response = await courseAPI.getCourses()
        if (response.success) {
          // Filter only marketplace courses (non-personalized)
          const marketplaceCourses = response.data.filter(course => course.courseType !== 'personalized')
          setCourses(marketplaceCourses)
        }
      } catch (error) {
        console.error('Failed to load courses:', error)
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDifficulty = filterDifficulty === 'all' || course.metadata.difficulty === filterDifficulty
    
    return matchesSearch && matchesDifficulty
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    } else if (sortBy === 'price') {
      return a.price - b.price
    }
    return 0
  })

  if (isLoading) {
    return <LoadingSpinner message="Loading marketplace courses..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-1 mb-4">
            Course Marketplace
          </h1>
          <p className="body-text-lg max-w-3xl mx-auto">
            Discover and enroll in courses created by expert instructors. 
            Build your skills with structured learning paths and earn certificates.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Courses
              </label>
              <input
                type="text"
                placeholder="Search courses, skills, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="select"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select"
              >
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="heading-3 mb-2">No courses found</h3>
            <p className="body-text">
              Try adjusting your search terms or filters to find more courses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id}
                course={course}
                showEnrollButton={true}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Marketplace