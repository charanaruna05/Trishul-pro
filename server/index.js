import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import http from 'http'
import logger from './config/logger.js'
import { validateJWTSecret } from './config/env-validator.js'

// Routes
import authRoutes from './routes/auth.js'
import brokerRoutes from './routes/broker.js'
import marketRoutes from './routes/market.js'
import tradeRoutes from './routes/trade.js'
import adminRoutes from './routes/admin.js'

// Load environment variables
dotenv.config()

// Validate critical env vars
try {
  validateJWTSecret()
  logger.info('✅ Environment variables validated')
} catch (err) {
  logger.error('❌ Environment validation failed:', err.message)
  process.exit(1)
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.VITE_API_URL || 'http://localhost:5173' },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
  maxHttpBufferSize: 1e6
})

const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Request logging
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
  })
  next()
})

// Rate limiting - adjusted for polling
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health'
})
app.use('/api/', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/broker', brokerRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/trade', tradeRoutes)
app.use('/api/admin', adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path })
})

// Error handler
app.use((err, req, res, next) => {
  logger.error('Server error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  })
})

// WebSocket connection management
const connectedClients = new Map()

io.on('connection', (socket) => {
  logger.info(`🔗 Client connected: ${socket.id}`)
  connectedClients.set(socket.id, { connectedAt: Date.now(), rooms: new Set() })

  // Subscribe to market data
  socket.on('subscribe_market', (symbols) => {
    if (!Array.isArray(symbols)) {
      logger.warn(`Invalid symbols format from ${socket.id}`)
      return
    }
    socket.join('market')
    const client = connectedClients.get(socket.id)
    if (client) client.rooms.add('market')
    logger.info(`Market subscription: ${socket.id}`)
  })

  // Subscribe to portfolio updates
  socket.on('subscribe_portfolio', (clientId) => {
    if (!clientId || typeof clientId !== 'string') {
      logger.warn(`Invalid clientId from ${socket.id}`)
      return
    }
    socket.join(`portfolio_${clientId}`)
    const client = connectedClients.get(socket.id)
    if (client) client.rooms.add(`portfolio_${clientId}`)
    logger.info(`Portfolio subscription: ${socket.id} for ${clientId}`)
  })

  // Unsubscribe
  socket.on('unsubscribe', (room) => {
    socket.leave(room)
    const client = connectedClients.get(socket.id)
    if (client) client.rooms.delete(room)
    logger.info(`Unsubscribed: ${socket.id} from ${room}`)
  })

  // Connection error handler
  socket.on('error', (error) => {
    logger.error(`Socket error for ${socket.id}:`, error)
  })

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    const client = connectedClients.get(socket.id)
    if (client) {
      logger.info(`🔌 Client disconnected: ${socket.id} (duration: ${Date.now() - client.connectedAt}ms)`)
      connectedClients.delete(socket.id)
    }
  })

  // Timeout after 5 minutes of inactivity
  const timeout = setTimeout(() => {
    logger.warn(`Timeout: ${socket.id} - no activity`)
    socket.disconnect(true)
  }, 5 * 60 * 1000)

  socket.on('ping', () => {
    clearTimeout(timeout)
    setTimeout(() => {
      logger.warn(`Timeout: ${socket.id} - no activity`)
      socket.disconnect(true)
    }, 5 * 60 * 1000)
  })
})

// Export io for use in routes
export { io }

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('⏹️  Graceful shutdown initiated')
  server.close(() => {
    logger.info('✅ Server closed')
    connectedClients.clear()
    process.exit(0)
  })

  setTimeout(() => {
    logger.error('❌ Forced shutdown')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

server.listen(PORT, () => {
  logger.info(`🔱 TRISHUL PRO SERVER RUNNING ON PORT ${PORT}`)
  logger.info(`📡 WebSocket enabled at ws://localhost:${PORT}`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
