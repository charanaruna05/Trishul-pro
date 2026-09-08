import React, { useEffect, useState } from 'react'
import './App.css'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>⚠️  Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('login')

  useEffect(() => {
    try {
      const token = localStorage.getItem('tp_token')
      const userData = localStorage.getItem('tp_user')
      
      if (token && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
        setCurrentPage('home')
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
      localStorage.removeItem('tp_token')
      localStorage.removeItem('tp_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('tp_token')
    localStorage.removeItem('tp_user')
    setIsAuthenticated(false)
    setUser(null)
    setCurrentPage('login')
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  const Login = React.lazy(() => import('./pages/Login'))
  const Home = React.lazy(() => import('./pages/Home'))
  const Signal = React.lazy(() => import('./pages/Signal'))
  const Power = React.lazy(() => import('./pages/Power'))
  const Chart = React.lazy(() => import('./pages/Chart'))
  const Watchlist = React.lazy(() => import('./pages/Watchlist'))
  const Admin = React.lazy(() => import('./pages/Admin'))

  const renderPage = () => {
    if (!isAuthenticated) return <Login setAuth={setIsAuthenticated} setUser={setUser} />

    switch (currentPage) {
      case 'home':
        return <Home user={user} />
      case 'signal':
        return <Signal />
      case 'power':
        return <Power />
      case 'chart':
        return <Chart />
      case 'watchlist':
        return <Watchlist />
      case 'admin':
        return <Admin user={user} />
      default:
        return <Home user={user} />
    }
  }

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div className="loading"><div className="spinner"></div></div>}>
        {renderPage()}
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default App
