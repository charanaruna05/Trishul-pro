// api/angel-market.js
// Angel One SmartAPI — Live Market Data (LTP + Quote)
// Vercel Serverless Function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const API_KEY = process.env.ANGEL_API_KEY;
    const CLIENT_ID = process.env.ANGEL_CLIENT_ID;

    // JWT token request body ya query se lena
    const body = req.method === 'POST' ? req.body : {};
    const jwtToken = body.jwtToken || req.headers.authorization?.replace('Bearer ', '');
    const symbols = body.symbols || req.query.symbols;

    if (!jwtToken) {
      return res.status(401).json({ success: false, error: 'JWT token required — login first' });
    }

    // Default symbols — NSE tokens
    // Angel One ke liye symboltoken chahiye (NSE token numbers)
    const DEFAULT_EXCHANGE_TOKENS = {
      "NSE": ["26000", "26009"], // NIFTY 50, NIFTY BANK
    };

    const exchangeTokens = body.exchangeTokens || DEFAULT_EXCHANGE_TOKENS;

    // Angel One LTP API
    const ltpRes = await fetch('https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/quote/', {
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
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        mode: "FULL",
        exchangeTokens: exchangeTokens,
      }),
    });

    const ltpData = await ltpRes.json();

    if (ltpData.status === true) {
      return res.status(200).json({
        success: true,
        data: ltpData.data,
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(400).json({
        success: false,
        error: ltpData.message || 'Market data fetch failed',
        raw: ltpData,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
