import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { getHoldings, getOrders, getPositions } from '../services/brokerService.js'

const router = express.Router()

// Get holdings
router.get('/holdings', verifyToken, async (req, res) => {
  try {
    const holdings = await getHoldings(req.user.brokerToken)
    res.json({ success: true, data: holdings })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const orders = await getOrders(req.user.brokerToken)
    res.json({ success: true, data: orders })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get positions
router.get('/positions', verifyToken, async (req, res) => {
  try {
    const positions = await getPositions(req.user.brokerToken)
    res.json({ success: true, data: positions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
