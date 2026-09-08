import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// ✅ FIXED: Now admin middleware properly validates role that we set in JWT

// Get system status
router.get('/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        brokers: ['Angel One', 'Shoonya', 'Zerodha'],
        status: 'operational',
        lastUpdate: new Date().toISOString(),
        timestamp: Date.now()
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user analytics
router.get('/analytics', verifyToken, verifyAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        activeUsers: 1234,
        totalTrades: 56789,
        platformRevenue: 'INR 5,67,890',
        uptime: '99.9%',
        lastUpdate: new Date().toISOString()
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get system logs
router.get('/logs', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { limit = 50 } = req.query
    
    res.json({
      success: true,
      data: {
        logs: [],
        total: 0,
        limit: parseInt(limit)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
