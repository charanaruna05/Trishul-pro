import axios from 'axios'
import { totp } from 'otplib'
import { validateEnv } from '../config/env-validator.js'

const ANGEL_BASE_URL = 'https://apiconnect.angelone.in/rest/auth'
const SHOONYA_BASE_URL = 'https://api.shoonya.com'

export async function connectBroker(broker, credentials) {
  if (broker === 'Angel One') {
    return connectAngelOne(credentials)
  } else if (broker === 'Shoonya') {
    return connectShoonya(credentials)
  }
  throw new Error('Unsupported broker: ' + broker)
}

async function connectAngelOne(credentials) {
  try {
    // ✅ FIXED: Added environment variable validation
    const requiredEnvs = ['ANGEL_API_KEY', 'ANGEL_TOTP_SECRET']
    validateEnv(requiredEnvs)

    const totpCode = totp.generate(process.env.ANGEL_TOTP_SECRET)
    
    const response = await axios.post(
      `${ANGEL_BASE_URL}/angelbroking/user/v1/loginByPassword`,
      {
        clientcode: credentials.clientId || process.env.ANGEL_CLIENT_ID,
        password: credentials.password || process.env.ANGEL_PASSWORD,
        totp: totpCode
      },
      {
        headers: {
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          'X-ClientLocalIP': '127.0.0.1',
          'X-ClientPublicIP': '127.0.0.1',
          'X-MACAddress': '00:00:00:00:00:00',
          'X-PrivateKey': process.env.ANGEL_API_KEY
        }
      }
    )
    
    if (response.data.status === true) {
      return {
        success: true,
        token: response.data.data.jwtToken,
        message: 'Angel One connected successfully'
      }
    }
    return { success: false, message: response.data.message || 'Connection failed' }
  } catch (err) {
    console.error('Angel One connection error:', err.message)
    return { success: false, message: 'Angel One API error: ' + err.message }
  }
}

async function connectShoonya(credentials) {
  try {
    // ✅ FIXED: Added environment variable validation
    const requiredEnvs = ['SHOONYA_UID', 'SHOONYA_PASSWORD']
    validateEnv(requiredEnvs)

    const response = await axios.post(
      `${SHOONYA_BASE_URL}/api/login`,
      {
        uid: credentials.clientId || process.env.SHOONYA_UID,
        pwd: credentials.password || process.env.SHOONYA_PASSWORD,
        factor2: credentials.totp
      }
    )
    
    if (response.data.stat === 'Ok') {
      return {
        success: true,
        token: response.data.sessionid,
        message: 'Shoonya connected successfully'
      }
    }
    return { success: false, message: response.data.emsg || 'Connection failed' }
  } catch (err) {
    console.error('Shoonya connection error:', err.message)
    return { success: false, message: 'Shoonya API error: ' + err.message }
  }
}

export async function getHoldings(token) {
  try {
    if (!token) {
      throw new Error('Broker token required')
    }
    // TODO: Implement actual broker API call
    return []
  } catch (err) {
    console.error('Get holdings error:', err)
    return []
  }
}

export async function getOrders(token) {
  try {
    if (!token) {
      throw new Error('Broker token required')
    }
    // TODO: Implement actual broker API call
    return []
  } catch (err) {
    console.error('Get orders error:', err)
    return []
  }
}

export async function getPositions(token) {
  try {
    if (!token) {
      throw new Error('Broker token required')
    }
    // TODO: Implement actual broker API call
    return []
  } catch (err) {
    console.error('Get positions error:', err)
    return []
  }
}
