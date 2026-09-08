import express from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { totp } from 'otplib'
import { connectBroker } from '../services/brokerService.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import { validateEnv } from '../config/env-validator.js'

const router = express.Router()

// Validate JWT secret on startup
validateEnv(['JWT_SECRET'])

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, broker } = req.body
    
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, password' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    
    // TODO: Save to database
    // await db.users.create({ name, email, phone, password: hashedPassword, broker })
    
    const token = jwt.sign(
      { email, name, broker, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    )
    
    res.json({
      success: true,
      message: 'Registration successful',
      token,
      user: { name, email, broker, role: 'user' }
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, broker, clientId, totpCode } = req.body
    
    // Input validation
    if (!email || !password || !broker) {
      return res.status(400).json({ error: 'Missing credentials: email, password, broker' })
    }

    // TODO: Verify credentials from database
    // const user = await db.users.findOne({ email })
    // if (!user || !await bcryptjs.compare(password, user.password)) {
    //   return res.status(401).json({ error: 'Invalid credentials' })
    // }

    // Broker login
    const brokerResponse = await connectBroker(broker, {
      clientId,
      password,
      totp: totpCode
    })
    
    if (!brokerResponse.success) {
      return res.status(401).json({ error: brokerResponse.message })
    }
    
    const token = jwt.sign(
      { 
        email, 
        broker, 
        brokerToken: brokerResponse.token,
        role: 'user'  // ✅ FIXED: Added role to JWT
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    )
    
    res.json({
      success: true,
      token,
      brokerToken: brokerResponse.token,
      user: { email, broker, role: 'user' }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Verify token
router.post('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// Logout
router.post('/logout', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

export default router
