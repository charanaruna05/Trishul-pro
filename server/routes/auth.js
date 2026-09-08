import express from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { totp } from 'otplib'
import { connectBroker } from '../services/brokerService.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, broker } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    
    const token = jwt.sign(
      { email, name, broker },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    )
    
    res.json({
      success: true,
      message: 'Registration successful',
      token,
      user: { name, email, broker }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, broker, clientId, totpCode } = req.body
    
    if (!email || !password || !broker) {
      return res.status(400).json({ error: 'Missing credentials' })
    }

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
      { email, broker, brokerToken: brokerResponse.token },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    )
    
    res.json({
      success: true,
      token,
      brokerToken: brokerResponse.token,
      user: { email, broker }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Verify token
router.post('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// Logout
router.post('/logout', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Logged out' })
})

export default router
