import React, { useState } from 'react'
import axios from 'axios'

const axiosInstance = axios.create({
  timeout: 10000
})

function Login({ setAuth, setUser }) {
  const [formData, setFormData] = useState({
    fullName: 'Charan',
    phone: '9800000000',
    email: 'charan@trishul.ai',
    password: 'demo123',
    broker: 'Shoonya'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
        broker: formData.broker
      })
      
      if (response.data.success) {
        localStorage.setItem('tp_token', response.data.token)
        localStorage.setItem('tp_user', JSON.stringify({ name: formData.fullName, broker: formData.broker }))
        setAuth(true)
        setUser({ name: formData.fullName, broker: formData.broker })
      } else {
        setError('Login failed: ' + (response.data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = err.code === 'ECONNABORTED' 
        ? 'Connection timeout - server not responding'
        : err.response?.data?.error || err.message || 'Login failed'
      setError(errorMsg)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="phone-frame">
      <div style={styles.header}>
        <div style={styles.title}>🔱 MAA AADISHAKTI</div>
        <div style={styles.subtitle}>TRISHUL PRO</div>
      </div>
      <form onSubmit={handleLogin} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          disabled={loading}
        />
        <select
          name="broker"
          value={formData.broker}
          onChange={handleChange}
          style={styles.input}
          disabled={loading}
        >
          <option>Shoonya</option>
          <option>Angel One</option>
          <option>Zerodha</option>
        </select>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'LOGGING IN...' : '🔱 LOGIN'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  header: {
    textAlign: 'center',
    padding: '20px',
    borderBottom: '2px solid var(--gold)',
    background: 'rgba(245,197,24,0.05)'
  },
  title: {
    fontSize: '24px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '2px',
    fontFamily: "'Orbitron', sans-serif"
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--dim)',
    marginTop: '8px'
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    overflowY: 'auto'
  },
  error: {
    background: 'rgba(255, 61, 61, 0.1)',
    border: '1px solid var(--red)',
    color: 'var(--red)',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '11px',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid var(--bordergold)',
    padding: '10px 12px',
    color: 'var(--text)',
    fontSize: '13px',
    outline: 'none',
    borderRadius: '4px'
  },
  button: {
    width: '100%',
    background: 'linear-gradient(135deg, var(--gold2), var(--gold))',
    color: '#000',
    border: 'none',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '1px',
    borderRadius: '4px',
    marginTop: '12px'
  }
}

export default Login
