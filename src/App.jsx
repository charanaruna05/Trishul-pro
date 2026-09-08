import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Signal from './pages/Signal'
import Power from './pages/Power'
import Chart from './pages/Chart'
import Watchlist from './pages/Watchlist'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('tp_token')
    if (token) {
      setIsAuthenticated(true)
      setUser(JSON.parse(localStorage.getItem('tp_user')))
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setAuth={setIsAuthenticated} setUser={setUser} />} />
        {isAuthenticated && (
          <>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/signal" element={<Signal />} />
            <Route path="/power" element={<Power />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/admin" element={<Admin />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
