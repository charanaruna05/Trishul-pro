import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Get system status
router.get('/status', verifyToken, verifyAdmin, async (req, res) => {
  res.json({
    success: true,
    data: {
      brokers: ['Angel One', 'Shoonya', 'Zerodha'],
      status: 'operational',
      lastUpdate: new Date().toISOString()
    }
  })
})

// Get user analytics
router.get('/analytics', verifyToken, verifyAdmin, async (req, res) => {
  res.json({
    success: true,
    data: {
      activeUsers: 1234,
      totalTrades: 56789,
      platformRevenue: 'INR 5,67,890'
    }
  })
})

export default router
