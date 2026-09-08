import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import http from 'http'

// Routes
import authRoutes from './routes/auth.js'
import brokerRoutes from './routes/broker.js'
import marketRoutes from './routes/market.js'
import tradeRoutes from './routes/trade.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.VITE_API_URL || 'http://localhost:5173' }
})

const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api/', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/broker', brokerRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/trade', tradeRoutes)
app.use('/api/admin', adminRoutes)

// WebSocket events for real-time data
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('subscribe_market', (symbols) => {
    socket.join('market')
  })
  
  socket.on('subscribe_portfolio', (clientId) => {
    socket.join(`portfolio_${clientId}`)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Export io for use in routes
export { io }

server.listen(PORT, () => {
  console.log(`🔱 TRISHUL PRO SERVER RUNNING ON PORT ${PORT}`)
  console.log(`📡 WebSocket enabled at ws://localhost:${PORT}`)
})
