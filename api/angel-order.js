// api/angel-order.js
// Angel One SmartAPI — Place / Cancel / Modify Orders
// Vercel Serverless Function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const API_KEY = process.env.ANGEL_API_KEY;
    const body = req.body;

    const jwtToken = body.jwtToken || req.headers.authorization?.replace('Bearer ', '');
    if (!jwtToken) {
      return res.status(401).json({ success: false, error: 'JWT token required — login first' });
    }

    const action = body.action || 'place'; // place | cancel | modify | book

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': '127.0.0.1',
      'X-ClientPublicIP': '127.0.0.1',
      'X-MACAddress': '00:00:00:00:00:00',
      'X-PrivateKey': API_KEY,
      'Authorization': `Bearer ${jwtToken}`,
    };

    let url, orderBody;

    if (action === 'place') {
      // ── ORDER PLACE ──
      // Required: symbol, token, qty, side (BUY/SELL), orderType, productType
      url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder';
      orderBody = {
        variety:          body.variety || 'NORMAL',          // NORMAL / AMO / STOPLOSS / ROBO
        tradingsymbol:    body.symbol,                        // e.g. "RELIANCE-EQ"
        symboltoken:      body.token,                         // NSE token e.g. "2885"
        transactiontype:  body.side,                          // BUY / SELL
        exchange:         body.exchange || 'NSE',             // NSE / BSE / NFO / MCX
        ordertype:        body.orderType || 'MARKET',         // MARKET / LIMIT / STOPLOSS_LIMIT / STOPLOSS_MARKET
        producttype:      body.productType || 'INTRADAY',     // DELIVERY / CARRYFORWARD / MARGIN / INTRADAY / BO
        duration:         body.duration || 'DAY',             // DAY / IOC
        price:            body.price || '0',
        squareoff:        body.squareOff || '0',
        stoploss:         body.stopLoss || '0',
        quantity:         String(body.qty || 1),
      };

    } else if (action === 'cancel') {
      // ── ORDER CANCEL ──
      url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/cancelOrder';
      orderBody = {
        variety:  body.variety || 'NORMAL',
        orderid:  body.orderId,
      };

    } else if (action === 'modify') {
      // ── ORDER MODIFY ──
      url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/modifyOrder';
      orderBody = {
        variety:       body.variety || 'NORMAL',
        orderid:       body.orderId,
        ordertype:     body.orderType || 'LIMIT',
        producttype:   body.productType || 'INTRADAY',
        duration:      body.duration || 'DAY',
        price:         body.price || '0',
        quantity:      String(body.qty || 1),
        tradingsymbol: body.symbol,
        symboltoken:   body.token,
        exchange:      body.exchange || 'NSE',
      };

    } else if (action === 'book') {
      // ── ORDER BOOK (history) ──
      url = 'https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getOrderBook';
      orderBody = {};
    }

    const orderRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderBody),
    });

    const orderData = await orderRes.json();

    if (orderData.status === true) {
      return res.status(200).json({
        success: true,
        orderId: orderData.data?.orderid,
        message: orderData.message,
        data: orderData.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: orderData.message || 'Order failed',
        errorCode: orderData.errorcode,
        raw: orderData,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
