// api/angel-login.js
// Angel One SmartAPI — Login & Token Generate
// Vercel Serverless Function

import { totp } from 'otplib';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const API_KEY      = process.env.ANGEL_API_KEY;
    const CLIENT_ID    = process.env.ANGEL_CLIENT_ID;
    const PASSWORD     = process.env.ANGEL_PASSWORD;
    const TOTP_SECRET  = process.env.ANGEL_TOTP_SECRET;

    if (!API_KEY || !CLIENT_ID || !PASSWORD || !TOTP_SECRET) {
      return res.status(500).json({ error: 'Server config missing — check Vercel env vars' });
    }

    // Generate TOTP code
    const totpCode = totp.generate(TOTP_SECRET);

    // Angel One SmartAPI login
    const loginRes = await fetch('https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '127.0.0.1',
        'X-ClientPublicIP': '127.0.0.1',
        'X-MACAddress': '00:00:00:00:00:00',
        'X-PrivateKey': API_KEY,
      },
      body: JSON.stringify({
        clientcode: CLIENT_ID,
        password: PASSWORD,
        totp: totpCode,
      }),
    });

    const loginData = await loginRes.json();

    if (loginData.status === true && loginData.data?.jwtToken) {
      // Token milgaya — save karo
      return res.status(200).json({
        success: true,
        jwtToken: loginData.data.jwtToken,
        refreshToken: loginData.data.refreshToken,
        feedToken: loginData.data.feedToken,
        clientName: loginData.data.name || CLIENT_ID,
        message: 'Angel One login successful',
      });
    } else {
      return res.status(401).json({
        success: false,
        error: loginData.message || 'Login failed',
        raw: loginData,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
