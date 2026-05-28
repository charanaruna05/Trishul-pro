// api/angel-login.js
// Angel One SmartAPI — Login & Token Generate
// Vercel Serverless Function

import { totp } from 'otplib';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {

    // ╔══════════════════════════════════════════╗
    // ║   यहाँ अपनी Angel One Details भरो       ║
    // ╚══════════════════════════════════════════╝

    const API_KEY     = "";   // ←  यहाँ
    const CLIENT_ID   = "";   // ← Client ID यहाँ (e.g. A12345)
    const PASSWORD    = "";   // ← Angel One Password यहाँ
    const TOTP_SECRET = "";   // ← TOTP Secret Key यहाँ

    // ▲▲▲ सिर्फ ऊपर की 4 lines में details डालो ▲▲▲

    if (!API_KEY || !CLIENT_ID || !PASSWORD || !TOTP_SECRET) {
      return res.status(500).json({ error: 'Details missing — 4 lines fill karo' });
    }

    // TOTP auto generate
    const totpCode = totp.generate(TOTP_SECRET);

    // Angel One Login
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
      return res.status(200).json({
        success: true,
        jwtToken: loginData.data.jwtToken,
        refreshToken: loginData.data.refreshToken,
        feedToken: loginData.data.feedToken,
        clientName: loginData.data.name || CLIENT_ID,
        message: 'Angel One Connected!',
      });
    } else {
      return res.status(401).json({
        success: false,
        error: loginData.message || 'Login failed',
      });
    }

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
