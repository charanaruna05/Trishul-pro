import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Signal from './pages/Signal'
import Power from './pages/Power'
import Chart from './pages/Chart'
import Watchlist from './pages/Watchlist'
import Admin from './pages/Admin'
import './index.css'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    try {
      const token = localStorage.getItem('tp_token')
      const userData = localStorage.getItem('tp_user')
      
      if (token && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
      localStorage.removeItem('tp_token')
      localStorage.removeItem('tp_user')
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Login setAuth={setIsAuthenticated} setUser={setUser} />} 
        />
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/signal" element={<Signal />} />
            <Route path="/power" element={<Power />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/admin" element={<Admin user={user} />} />
          </>
        ) : null}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
