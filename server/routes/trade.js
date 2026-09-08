import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { placeOrder, cancelOrder, modifyOrder } from '../services/tradeService.js'

const router = express.Router()

// Validate trade order input
function validateOrderInput(order) {
  const { symbol, quantity, price, orderType, side } = order
  
  if (!symbol || symbol.trim().length === 0) {
    return 'Symbol is required'
  }
  if (!quantity || quantity <= 0) {
    return 'Quantity must be greater than 0'
  }
  if (!price || price <= 0) {
    return 'Price must be greater than 0'
  }
  if (!orderType || !['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'].includes(orderType)) {
    return 'Invalid orderType. Must be MARKET, LIMIT, STOP, or STOP_LIMIT'
  }
  if (!side || !['BUY', 'SELL'].includes(side)) {
    return 'Side must be BUY or SELL'
  }
  return null
}

// Place order
router.post('/order/place', verifyToken, async (req, res) => {
  try {
    const { symbol, quantity, price, orderType, side } = req.body
    
    // ✅ FIXED: Input validation
    const validationError = validateOrderInput(req.body)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const result = await placeOrder(req.user.brokerToken, {
      symbol,
      quantity,
      price,
      orderType,
      side
    })
    
    res.json({ success: true, orderId: result.orderId })
  } catch (err) {
    console.error('Place order error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Cancel order
router.post('/order/cancel', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body
    
    // ✅ FIXED: Input validation
    if (!orderId || orderId.trim().length === 0) {
      return res.status(400).json({ error: 'Order ID is required' })
    }

    await cancelOrder(req.user.brokerToken, orderId)
    res.json({ success: true, message: 'Order cancelled successfully' })
  } catch (err) {
    console.error('Cancel order error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Modify order - ✅ FIXED: Added missing route for imported function
router.post('/order/modify', verifyToken, async (req, res) => {
  try {
    const { orderId, modifications } = req.body
    
    if (!orderId || orderId.trim().length === 0) {
      return res.status(400).json({ error: 'Order ID is required' })
    }

    const result = await modifyOrder(req.user.brokerToken, orderId, modifications)
    res.json({ success: true, data: result })
  } catch (err) {
    console.error('Modify order error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
