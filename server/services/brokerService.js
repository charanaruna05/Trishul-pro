import axios from 'axios'
import { totp } from 'otplib'

const ANGEL_BASE_URL = 'https://apiconnect.angelone.in/rest/auth'
const SHOONYA_BASE_URL = 'https://api.shoonya.com'

export async function connectBroker(broker, credentials) {
  if (broker === 'Angel One') {
    return connectAngelOne(credentials)
  } else if (broker === 'Shoonya') {
    return connectShoonya(credentials)
  }
  throw new Error('Unsupported broker')
}

async function connectAngelOne(credentials) {
  try {
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
        message: 'Angel One connected'
      }
    }
    return { success: false, message: response.data.message }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

async function connectShoonya(credentials) {
  try {
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
        message: 'Shoonya connected'
      }
    }
    return { success: false, message: response.data.emsg }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export async function getHoldings(token) {
  // Implement actual broker API call
  return []
}

export async function getOrders(token) {
  return []
}

export async function getPositions(token) {
  return []
}
