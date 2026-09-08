import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' })
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
      }
      return res.status(401).json({ error: 'Invalid token' })
    }
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

// ✅ FIXED: Now works because auth.js sets role in JWT token
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required. Your role is: ' + (req.user.role || 'unknown') })
  }
  next()
}
