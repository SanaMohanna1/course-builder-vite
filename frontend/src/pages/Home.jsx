import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useCourseStore from '../store/useCourseStore'
import useUserStore from '../store/useUserStore'
import CourseCard from '../components/CourseCard'

function Home() {
  const { courses, fetchCourses, isLoading } = useCourseStore()
  const { currentUser } = useUserStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [activeTab, setActiveTab] = useState('learning') // 'learning', 'recommended', 'trending'

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesDifficulty = filterDifficulty === 'all' || course.metadata.difficulty === filterDifficulty
      
      return matchesSearch && matchesDifficulty
    })

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'rating':
          return b.feedback.averageRating - a.feedback.averageRating
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return difficultyOrder[a.metadata.difficulty] - difficultyOrder[b.metadata.difficulty]
        case 'duration':
          return a.metadata.duration.localeCompare(b.metadata.duration)
        default:
          return 0
      }
    })

    return filtered
  }, [courses, searchTerm, filterDifficulty, sortBy])

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    )
  }

  // LEARNER-FOCUSED HOME PAGE
  return (
    <div className="personalized-dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-md)' }}>
            Welcome back, {currentUser?.name || 'Learner'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Continue your learning journey and discover new skills
          </p>
        </div>

        {/* Learning Stats */}
        <div className="dashboard-grid" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div className="dashboard-card">
            <div className="flex items-center">
              <div className="dashboard-icon" style={{ background: 'var(--gradient-primary)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div style={{ marginLeft: 'var(--spacing-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Courses Enrolled</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>12</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center">
              <div className="dashboard-icon" style={{ background: 'var(--gradient-secondary)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ marginLeft: 'var(--spacing-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Completed</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>8</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center">
              <div className="dashboard-icon" style={{ background: 'var(--gradient-accent)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ marginLeft: 'var(--spacing-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>In Progress</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>4</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center">
              <div className="dashboard-icon" style={{ background: 'var(--gradient-accent)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div style={{ marginLeft: 'var(--spacing-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Learning Streak</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ 
            padding: 'var(--spacing-lg)', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              {[
                { id: 'learning', label: 'My Learning', icon: '📚' },
                { id: 'recommended', label: 'Recommended', icon: '⭐' },
                { id: 'trending', label: 'Trending', icon: '🔥' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: '8px',
                    background: activeTab === tab.id ? 'var(--primary-cyan)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
              <div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          <div style={{ padding: 'var(--spacing-lg)' }}>
            {activeTab === 'learning' && (
              <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)' }}>
                  Continue Learning
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                  {filteredCourses.slice(0, 6).map(course => (
                    <div key={course.id} style={{
                      background: 'var(--gradient-card)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: 'var(--spacing-lg)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', flex: 1 }}>
                          {course.title}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', alignItems: 'flex-end' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: course.courseType === 'personalized' ? 'var(--accent-gold)' : 'var(--accent-green)',
                            color: 'white'
                          }}>
                            {course.courseType === 'personalized' ? '🎯 Personalized' : '🏪 Marketplace'}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: 'var(--accent-gold)',
                            color: 'white'
                          }}>
                            In Progress
                          </span>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>
                        {course.description}
                      </p>
                      <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Progress</span>
                          <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: '500' }}>65%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: '65%', height: '100%', background: 'var(--gradient-primary)', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          <span>⏱️ {course.metadata.duration}</span>
                          <span>•</span>
                          <span>⭐ {course.feedback.averageRating}</span>
                        </div>
                            <Link to={`/course/${course.id}`} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: 'var(--spacing-xs) var(--spacing-md)' }}>
                              {course.courseType === 'personalized' ? 'Start Learning' : 'Continue'}
                            </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recommended' && (
              <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)' }}>
                  Recommended for You
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                  {filteredCourses.map(course => (
                    <CourseCard 
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      trainer={course.trainer.name}
                      difficulty={course.metadata.difficulty}
                      duration={course.metadata.duration}
                      rating={course.feedback.averageRating}
                      skills={course.skills}
                      status="published"
                      courseType={course.courseType}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trending' && (
              <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)' }}>
                  Trending Courses
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                  {filteredCourses.map(course => (
                    <CourseCard 
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      trainer={course.trainer.name}
                      difficulty={course.metadata.difficulty}
                      duration={course.metadata.duration}
                      rating={course.feedback.averageRating}
                      skills={course.skills}
                      status="published"
                      courseType={course.courseType}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
