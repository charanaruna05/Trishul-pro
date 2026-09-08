/**
 * Environment Variable Validator
 * ✅ NEW FILE: Validates required environment variables
 */

export function validateEnv(requiredEnvs = []) {
  const missing = requiredEnvs.filter(env => !process.env[env])
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`)
    console.warn(`Please set these in your .env file`)
    
    // For development, we continue; for production, we might want to throw
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
  
  return missing.length === 0
}

export function validateJWTSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  if (process.env.JWT_SECRET.length < 10) {
    throw new Error('JWT_SECRET must be at least 10 characters long')
  }
}
