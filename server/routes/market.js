import express from 'express'
import logger from '../config/logger.js'

const router = express.Router()

// Get market indices
router.get('/indices', async (req, res) => {
  try {
    const indices = [
      { name: 'NIFTY 50', value: 24150, change: 145, percent: 0.61 },
      { name: 'BANK NIFTY', value: 51320, change: 280, percent: 0.55 },
      { name: 'SENSEX', value: 79850, change: 420, percent: 0.53 }
    ]
    res.json({ success: true, data: indices })
  } catch (err) {
    logger.error('Get indices error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Get sector data
router.get('/sectors', async (req, res) => {
  try {
    const sectors = [
      { name: 'REALTY', up: 9, down: 0 },
      { name: 'BANKING', up: 8, down: 1 },
      { name: 'IT', up: 7, down: 2 },
      { name: 'AUTO', up: 6, down: 1 },
      { name: 'FINANCE', up: 5, down: 1 },
      { name: 'CHEMICAL', up: 6, down: 2 }
    ]
    res.json({ success: true, data: sectors })
  } catch (err) {
    logger.error('Get sectors error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Get stock data
router.get('/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' })
    }

    const stock = {
      symbol: symbol.toUpperCase(),
      price: 1234.50,
      change: 23.45,
      percent: 1.95
    }
    res.json({ success: true, data: stock })
  } catch (err) {
    logger.error('Get stock error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
