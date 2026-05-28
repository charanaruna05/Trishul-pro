// angel.js — Trishul Pro · Angel One SmartAPI Client
// सभी HTML pages इस file को include करेंगे
// Usage: <script src="angel.js"></script>

const ANGEL = {

  // ─── TOKEN STORAGE ───────────────────────────────
  saveSession(data) {
    sessionStorage.setItem('angel_jwt', data.jwtToken);
    sessionStorage.setItem('angel_feed', data.feedToken);
    sessionStorage.setItem('angel_refresh', data.refreshToken);
    sessionStorage.setItem('angel_name', data.clientName);
    sessionStorage.setItem('angel_time', Date.now());
  },

  getJWT() { return sessionStorage.getItem('angel_jwt'); },
  getFeed() { return sessionStorage.getItem('angel_feed'); },
  getName() { return sessionStorage.getItem('angel_name') || 'Trader'; },

  isLoggedIn() {
    const jwt = this.getJWT();
    const time = sessionStorage.getItem('angel_time');
    if (!jwt || !time) return false;
    // Token 8 hours valid
    return (Date.now() - parseInt(time)) < 8 * 60 * 60 * 1000;
  },

  logout() {
    sessionStorage.clear();
    window.location.href = 'page1_login.html';
  },

  // ─── LOGIN ───────────────────────────────────────
  async login() {
    try {
      const res = await fetch('/api/angel-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        this.saveSession(data);
        return { success: true, name: data.clientName };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ─── MARKET DATA ─────────────────────────────────
  // exchangeTokens format: { "NSE": ["26000", "26009", "2885"] }
  async getQuote(exchangeTokens) {
    const jwt = this.getJWT();
    if (!jwt) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/angel-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwtToken: jwt, exchangeTokens }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ─── PLACE ORDER ─────────────────────────────────
  async placeOrder({ symbol, token, side, qty, orderType = 'MARKET', productType = 'INTRADAY', price = '0', exchange = 'NSE' }) {
    const jwt = this.getJWT();
    if (!jwt) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/angel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'place',
          jwtToken: jwt,
          symbol, token, side, qty, orderType, productType, price, exchange,
        }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ─── CANCEL ORDER ────────────────────────────────
  async cancelOrder(orderId) {
    const jwt = this.getJWT();
    if (!jwt) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/angel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', jwtToken: jwt, orderId }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ─── ORDER BOOK ──────────────────────────────────
  async getOrderBook() {
    const jwt = this.getJWT();
    if (!jwt) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/angel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'book', jwtToken: jwt }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ─── NSE TOKEN MAP (common stocks) ───────────────
  // Angel One ke liye symbol ke saath NSE token bhi chahiye
  TOKENS: {
    'NIFTY 50':   { token: '26000', exchange: 'NSE' },
    'BANK NIFTY': { token: '26009', exchange: 'NSE' },
    'SENSEX':     { token: '1', exchange: 'BSE' },
    'RELIANCE':   { token: '2885', exchange: 'NSE', symbol: 'RELIANCE-EQ' },
    'HDFCBANK':   { token: '1333', exchange: 'NSE', symbol: 'HDFCBANK-EQ' },
    'ICICIBANK':  { token: '4963', exchange: 'NSE', symbol: 'ICICIBANK-EQ' },
    'INFY':       { token: '1594', exchange: 'NSE', symbol: 'INFY-EQ' },
    'TCS':        { token: '11536', exchange: 'NSE', symbol: 'TCS-EQ' },
    'SBIN':       { token: '3045', exchange: 'NSE', symbol: 'SBIN-EQ' },
    'BAJFINANCE': { token: '317', exchange: 'NSE', symbol: 'BAJFINANCE-EQ' },
    'BHARTIARTL': { token: '10604', exchange: 'NSE', symbol: 'BHARTIARTL-EQ' },
    'HCLTECH':    { token: '7229', exchange: 'NSE', symbol: 'HCLTECH-EQ' },
    'WIPRO':      { token: '3787', exchange: 'NSE', symbol: 'WIPRO-EQ' },
    'TATAMOTORS': { token: '3456', exchange: 'NSE', symbol: 'TATAMOTORS-EQ' },
    'AXISBANK':   { token: '5900', exchange: 'NSE', symbol: 'AXISBANK-EQ' },
    'KOTAKBANK':  { token: '1922', exchange: 'NSE', symbol: 'KOTAKBANK-EQ' },
    'LT':         { token: '11483', exchange: 'NSE', symbol: 'LT-EQ' },
    'MARUTI':     { token: '10999', exchange: 'NSE', symbol: 'MARUTI-EQ' },
    'TITAN':      { token: '3506', exchange: 'NSE', symbol: 'TITAN-EQ' },
    'ADANIENT':   { token: '25', exchange: 'NSE', symbol: 'ADANIENT-EQ' },
    'NTPC':       { token: '11630', exchange: 'NSE', symbol: 'NTPC-EQ' },
    'ONGC':       { token: '2475', exchange: 'NSE', symbol: 'ONGC-EQ' },
  },

  // ─── TOAST HELPER ────────────────────────────────
  toast(msg, type = 'info') {
    let el = document.getElementById('angel-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'angel-toast';
      el.style.cssText = `
        position:fixed;top:20px;left:50%;transform:translateX(-50%);
        padding:9px 18px;font-size:12px;font-weight:700;letter-spacing:1px;
        border:1px solid;z-index:99999;display:none;font-family:Rajdhani,sans-serif;
        white-space:nowrap;max-width:90vw;text-align:center;
      `;
      document.body.appendChild(el);
    }
    const colors = {
      info:    { bg:'#121212', border:'#f5c518', color:'#f5c518' },
      success: { bg:'#002a14', border:'#00c853', color:'#00c853' },
      error:   { bg:'#2a0000', border:'#ff3d3d', color:'#ff3d3d' },
      warn:    { bg:'#1a0e00', border:'#ff6d00', color:'#ff6d00' },
    };
    const c = colors[type] || colors.info;
    el.style.background = c.bg;
    el.style.borderColor = c.border;
    el.style.color = c.color;
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 3000);
  },
};

// Auto-redirect if not logged in (except login page itself)
if (!window.location.pathname.includes('page1_login') &&
    !window.location.pathname.includes('index')) {
  if (!ANGEL.isLoggedIn()) {
    // Try auto-login with server keys
    ANGEL.login().then(r => {
      if (!r.success) {
        ANGEL.toast('⚠️ Angel One: ' + r.error, 'error');
      } else {
        ANGEL.toast('🔱 Angel One Connected — ' + r.name, 'success');
      }
    });
  }
}
