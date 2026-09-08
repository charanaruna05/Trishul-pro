import express from 'express'
import { getIndices, getSectorData, getStockData } from '../services/marketService.js'

const router = express.Router()

// Get market indices
router.get('/indices', async (req, res) => {
  try {
    const indices = await getIndices()
    res.json({ success: true, data: indices })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get sector data
router.get('/sectors', async (req, res) => {
  try {
    const sectors = await getSectorData()
    res.json({ success: true, data: sectors })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get stock data
router.get('/stock/:symbol', async (req, res) => {
  try {
    const stock = await getStockData(req.params.symbol)
    res.json({ success: true, data: stock })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
