import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { placeOrder, cancelOrder, modifyOrder } from '../services/tradeService.js'

const router = express.Router()

// Place order
router.post('/order/place', verifyToken, async (req, res) => {
  try {
    const { symbol, quantity, price, orderType, side } = req.body
    const result = await placeOrder(req.user.brokerToken, {
      symbol,
      quantity,
      price,
      orderType,
      side
    })
    res.json({ success: true, orderId: result.orderId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Cancel order
router.post('/order/cancel', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body
    await cancelOrder(req.user.brokerToken, orderId)
    res.json({ success: true, message: 'Order cancelled' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
