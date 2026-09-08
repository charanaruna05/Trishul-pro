import React, { useState } from 'react'
import axios from 'axios'

function Login({ setAuth, setUser }) {
  const [formData, setFormData] = useState({
    fullName: 'Charan',
    phone: '9800000000',
    email: 'charan@trishul.ai',
    password: 'demo123',
    broker: 'Shoonya'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
        broker: formData.broker
      })
      if (response.data.success) {
        localStorage.setItem('tp_token', response.data.token)
        localStorage.setItem('tp_user', JSON.stringify({ name: formData.fullName, broker: formData.broker }))
        setAuth(true)
        setUser({ name: formData.fullName, broker: formData.broker })
      }
    } catch (err) {
      alert('Login failed: ' + err.message)
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
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        <select
          name="broker"
          value={formData.broker}
          onChange={handleChange}
          style={styles.input}
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
