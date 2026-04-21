/* ═══════════════════════════════════════
   TRINETRAA PRO — LIVE PRICE ENGINE
   Yahoo Finance via CORS Proxy
═══════════════════════════════════════ */

const PRICE_CACHE = {};

// Format Indian numbers
function fmtIN(n) {
  if (!n && n !== 0) return '—';
  return Number(n).toLocaleString('en-IN', {maximumFractionDigits:2});
}

// Fetch price via allorigins proxy (bypasses CORS)
async function fetchYahooPrice(symbol) {
  try {
    const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yfUrl)}`;
    const res = await fetch(proxyUrl, {signal: AbortSignal.timeout(8000)});
    if (!res.ok) return null;
    const outer = await res.json();
    const data = JSON.parse(outer.contents);
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    return {
      price: meta.regularMarketPrice,
      chg: meta.regularMarketChangePercent,
      open: meta.regularMarketOpen,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      prev: meta.chartPreviousClose || meta.previousClose
    };
  } catch(e) { return null; }
}

// Update stat box
function setStatBox(elId, price, chg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = fmtIN(price);
  el.style.color = chg >= 0 ? '#2ecc71' : '#e74c3c';
}

// Live dot status
function setLiveStatus(ok) {
  const dot = document.getElementById('live-dot');
  const txt = document.getElementById('live-txt');
  if (dot) dot.style.background = ok ? '#2ecc71' : '#e74c3c';
  if (txt) txt.textContent = ok ? '● LIVE' : '● RETRY';
}

// Update ticker text
function updateTicker() {
  const n = PRICE_CACHE['NIFTY'], s = PRICE_CACHE['SENSEX'], g = PRICE_CACHE['GOLD'];
  const parts = [];
  if (n) parts.push(`NIFTY ${fmtIN(n.price)} ${n.chg>=0?'▲':'▼'}${Math.abs(n.chg).toFixed(2)}%`);
  if (s) parts.push(`SENSEX ${fmtIN(s.price)} ${s.chg>=0?'▲':'▼'}${Math.abs(s.chg).toFixed(2)}%`);
  if (g) parts.push(`GOLD $${fmtIN(g.price)}`);
  parts.push('🔱 TRINETRAA PRO', 'SECTOR ROTATION ACTIVE', 'LIVE MARKET DATA');
  const mk = document.getElementById('ticker-text');
  if (mk) mk.textContent = '🔱 ' + parts.join(' | ');
}

// Main live update function
async function updateLivePrices() {
  let anyOk = false;

  const nifty = await fetchYahooPrice('^NSEI');
  if (nifty) { PRICE_CACHE['NIFTY'] = nifty; setStatBox('h-nifty', nifty.price, nifty.chg); anyOk = true; }

  const sensex = await fetchYahooPrice('^BSESN');
  if (sensex) { PRICE_CACHE['SENSEX'] = sensex; setStatBox('h-sensex', sensex.price, sensex.chg); anyOk = true; }

  const gold = await fetchYahooPrice('GC=F');
  if (gold) { PRICE_CACHE['GOLD'] = gold; setStatBox('h-gold', gold.price, gold.chg); anyOk = true; }

  // Update chart symbol price
  if (window.currentSym && YF_SYMBOLS[window.currentSym]) {
    const d = await fetchYahooPrice(YF_SYMBOLS[window.currentSym]);
    if (d && d.price > 0) {
      PRICE_CACHE[window.currentSym] = d;
      window.currentLTP = d.price;
      const pg = document.querySelector('.page.active');
      if (pg && pg.id === 'pg-chart') {
        const ltpEl = document.getElementById('c-ltp');
        const chgEl = document.getElementById('c-chg');
        if (ltpEl) { ltpEl.textContent = d.price.toFixed(2); ltpEl.style.color = d.chg>=0?'#2ecc71':'#e74c3c'; }
        if (chgEl) { chgEl.textContent = (d.chg>=0?'▲ +':'▼ ')+Math.abs(d.chg).toFixed(2)+'%'; chgEl.style.color = d.chg>=0?'#2ecc71':'#e74c3c'; }
      }
    }
  }

  setLiveStatus(anyOk);
  updateTicker();
  const tEl = document.getElementById('last-ref');
  if (tEl) { const now = new Date(); tEl.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`; }
}
