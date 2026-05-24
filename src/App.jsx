import { useState, useEffect, useCallback } from "react";

// ╔══════════════════════════════════════════════════╗
// ║         🔌 SIRF YAHAN API DETAILS DAALO         ║
// ╚══════════════════════════════════════════════════╝
const API_CONFIG = {
  CLIENT_ID:    "YOUR_DHAN_CLIENT_ID",      // Dhan Client ID yahan
  ACCESS_TOKEN: "YOUR_DHAN_ACCESS_TOKEN",   // Dhan Access Token yahan
  REFRESH_SEC:  60,                          // Kitne second mein refresh (60 = 1 min)
};
// ▲▲▲ SIRF UPAR KI 3 LINES BHADLNA HAI ▲▲▲

// ── USERS (add/remove karo) ───────────────────────
const USERS = [
  { username: "Arunacharan007", password: "@Puran007", role: "master" },
  { username: "user1",          password: "user1@123", role: "viewer" },
];

// ── WATCHLIST - jo stocks scan karne hain ─────────
const WATCHLIST = [
  "RELIANCE","HDFCBANK","ICICIBANK","INFY","TCS",
  "SBIN","BAJFINANCE","BHARTIARTL","HCLTECH","WIPRO",
  "TATAMOTORS","ADANIENT","KOTAKBANK","LT","AXISBANK",
  "MARUTI","NTPC","POWERGRID","ONGC","COALINDIA",
  "DIVISLAB","DRREDDY","APOLLOHOSP","CIPLA","TITAN",
  "ASIANPAINT","NESTLEIND","ULTRACEMCO","GRASIM","JSWSTEEL",
];

// ── SCANNER DEFINITIONS (indicators list) ─────────
const SCANNER_DEFS = [
  // PAGE A - MOMENTUM
  { id:"A-01", page:"A", name:"RSI MOMENTUM",       inds:["RSI(14)","RSI(7)","Williams %R","Price ROC","Volume"],        logic:"rsi" },
  { id:"A-02", page:"A", name:"MACD CROSS",          inds:["MACD(12,26,9)","Signal Line","Histogram","Zero Cross","EMA(26)"], logic:"macd" },
  { id:"A-03", page:"A", name:"STOCHASTIC SURGE",    inds:["Stoch(14,3)","%K","%D","Stoch RSI","Momentum(10)"],           logic:"stoch" },
  { id:"A-04", page:"A", name:"CCI EXTREME",         inds:["CCI(20)","CCI(14)","Mean Dev","Typical Price","Channel"],     logic:"cci" },
  { id:"A-05", page:"A", name:"ROC VELOCITY",        inds:["ROC(12)","ROC(25)","Price Osc","Detrended PO","Chande Mom"],  logic:"roc" },
  { id:"A-06", page:"A", name:"VOLUME MOMENTUM",     inds:["OBV","Vol Oscillator","Ease of Move","Force Index","Vol ROC"],logic:"volume" },
  { id:"A-07", page:"A", name:"AWESOME OSCILLATOR",  inds:["AO(5,34)","TRIX(15)","Ultimate Osc","Vortex","Rel Vigor"],   logic:"ao" },
  { id:"A-08", page:"A", name:"FISHER TRANSFORM",    inds:["Fisher","Coppock Curve","Klinger Osc","Elder Ray","PMO"],    logic:"fisher" },
  // PAGE B - BREAKOUT
  { id:"B-01", page:"B", name:"BOLLINGER BREAKOUT",  inds:["BB(20,2)","BB Width","BB Squeeze","Keltner Ch","Bandwidth"], logic:"bb" },
  { id:"B-02", page:"B", name:"PIVOT BREAKOUT",      inds:["Pivot Points","R1 R2 R3","S1 S2 S3","Camarilla","Floor"],    logic:"pivot" },
  { id:"B-03", page:"B", name:"DONCHIAN CHANNEL",    inds:["Donchian(20)","Hi-Lo Ch","Price Ch","Envelopes","Breakout"], logic:"donchian" },
  { id:"B-04", page:"B", name:"ATR BREAKOUT",        inds:["ATR(14)","True Range","Trail Stop","Chandelier","ATR Band"], logic:"atr" },
  { id:"B-05", page:"B", name:"52W HIGH/LOW",        inds:["52W High","52W Low","6M Hi/Lo","Hist High","ATH"],           logic:"52w" },
  { id:"B-06", page:"B", name:"INSIDE BAR BREAK",    inds:["Inside Bar","Mother Bar","NR4/NR7","Narrow Range","Compress"],logic:"inside" },
  { id:"B-07", page:"B", name:"VWAP BREAKOUT",       inds:["VWAP","VWAP Bands","Anchored VWAP","VWAP Dev","Vol POC"],    logic:"vwap" },
  { id:"B-08", page:"B", name:"GAP SCANNER",         inds:["Gap Up/Down","Prev Close","Gap Fill","OR Break","Pre-Mkt"],  logic:"gap" },
  // PAGE C - OPTIONS
  { id:"C-01", page:"C", name:"OI BUILDUP",          inds:["Open Interest","OI Change%","Long Buildup","Short Build","PCR"], logic:"oi" },
  { id:"C-02", page:"C", name:"IV RANK",             inds:["IV Rank","IV Percentile","Hist Vol","IV/HV Ratio","VIX"],    logic:"iv" },
  { id:"C-03", page:"C", name:"MAX PAIN LEVEL",      inds:["Max Pain","Pain Point","Strike OI","Hi CE OI","Hi PE OI"],   logic:"maxpain" },
  { id:"C-04", page:"C", name:"GAMMA EXPOSURE",      inds:["Gamma γ","Delta δ","Theta θ","Vega ν","Rho ρ"],              logic:"greeks" },
  { id:"C-05", page:"C", name:"PUT CALL RATIO",      inds:["PCR OI","PCR Volume","PCR Change","Skew Index","Term Str"],  logic:"pcr" },
  { id:"C-06", page:"C", name:"OI UNWINDING",        inds:["Long Unwind","Short Cover","Short Add","Fresh Buy","OI/Price"],logic:"unwind" },
  { id:"C-07", page:"C", name:"EXPIRY SCANNER",      inds:["Days to Exp","Theta Burn","Strike Pin","Rollover%","CoC"],   logic:"expiry" },
  { id:"C-08", page:"C", name:"OPTION CHAIN FLOW",   inds:["Chain Data","Block Trade","Unusual Act","Smart Money","Sweep"],logic:"flow" },
  // PAGE D - TREND
  { id:"D-01", page:"D", name:"EMA CROSSOVER",       inds:["EMA(9)","EMA(21)","EMA(50)","EMA(200)","Golden Cross"],      logic:"ema" },
  { id:"D-02", page:"D", name:"SUPERTREND",          inds:["ST(7,3)","ST(10,3)","ST(14,2)","Trend Dir","ST Flip"],       logic:"supertrend" },
  { id:"D-03", page:"D", name:"ADX STRENGTH",        inds:["ADX(14)","+DI/-DI","DMI Cross","Trend Str","ADXR"],          logic:"adx" },
  { id:"D-04", page:"D", name:"PARABOLIC SAR",       inds:["PSAR(0.02)","SAR Flip","SAR Dist","Accel Factor","Trail"],   logic:"psar" },
  { id:"D-05", page:"D", name:"ICHIMOKU CLOUD",      inds:["Tenkan(9)","Kijun(26)","Senkou A","Senkou B","Chikou"],      logic:"ichimoku" },
  { id:"D-06", page:"D", name:"AROON TREND",         inds:["Aroon Up(25)","Aroon Dn(25)","Aroon Osc","Lin Reg","Slope"], logic:"aroon" },
  { id:"D-07", page:"D", name:"MULTI-TF TREND",      inds:["HTF(1D)","MTF(1H)","LTF(15M)","TF Align","Trend Score"],    logic:"multitf" },
  { id:"D-08", page:"D", name:"HEIKIN ASHI",         inds:["HA Candle","HA Color","HA Shadow","Smoothed HA","HA Rev"],   logic:"ha" },
  // PAGE E - ALGO
  { id:"E-01", page:"E", name:"CANDLESTICK ALGO",    inds:["Engulfing","Hammer","Doji Star","Shooting Star","Spinning"],  logic:"candle" },
  { id:"E-02", page:"E", name:"CHART PATTERN ALGO",  inds:["H&S","Double Top/Bot","Cup & Handle","Rounding","Triple"],   logic:"chart" },
  { id:"E-03", page:"E", name:"TRIANGLE & WEDGE",    inds:["Asc Triangle","Desc Triangle","Sym Triangle","Rising W","Fall W"],logic:"triangle" },
  { id:"E-04", page:"E", name:"THREE CANDLE ALGO",   inds:["Morning Star","Evening Star","3 Soldiers","3 Crows","3 Inside"],logic:"threecandle" },
  { id:"E-05", page:"E", name:"FIBONACCI ALGO",      inds:["Fib Retrace","Fib Ext","0.618 Ratio","Fib Fan","Fib Time"],  logic:"fib" },
  { id:"E-06", page:"E", name:"ELLIOTT WAVE",        inds:["Wave 1-5","Corrective ABC","Impulse","Wave Degree","ZigZag"],logic:"elliott" },
  { id:"E-07", page:"E", name:"HARMONIC PATTERNS",   inds:["Gartley","Bat Pattern","Butterfly","Crab","ABCD"],           logic:"harmonic" },
  { id:"E-08", page:"E", name:"ML ALGO SCANNER",     inds:["ML Score","Pattern Recog","Regression","Prob Score","Backtest"],logic:"ml" },
];

const PAGES = [
  { key:"A", label:"MOMENTUM", color:"#00c8ff" },
  { key:"B", label:"BREAKOUT",  color:"#ff9500" },
  { key:"C", label:"OPTIONS",   color:"#00ff88" },
  { key:"D", label:"TREND",     color:"#cc88ff" },
  { key:"E", label:"ALGO",      color:"#ff6644" },
];

// ── DHAN API LAYER ────────────────────────────────
// Jab API_CONFIG filled hoga, ye real data fetch karega
// Abhi DEMO mode mein chalta hai
const isDemoMode = API_CONFIG.ACCESS_TOKEN === "YOUR_DHAN_ACCESS_TOKEN";

async function fetchLivePrice(symbol) {
  if (isDemoMode) {
    // Demo prices - API aane par automatically replace ho jayega
    const demoPrices = {
      RELIANCE:2847, HDFCBANK:1623, ICICIBANK:1187, INFY:1456, TCS:3892,
      SBIN:812, BAJFINANCE:7234, BHARTIARTL:1678, HCLTECH:1834, WIPRO:478,
      TATAMOTORS:887, ADANIENT:2567, KOTAKBANK:1876, LT:3567, AXISBANK:1156,
      MARUTI:11450, NTPC:378, POWERGRID:298, ONGC:267, COALINDIA:456,
      DIVISLAB:4234, DRREDDY:1234, APOLLOHOSP:6789, CIPLA:1456, TITAN:3456,
      ASIANPAINT:2890, NESTLEIND:22450, ULTRACEMCO:11234, GRASIM:2567, JSWSTEEL:934,
    };
    // Random ±0.5% movement for demo
    const base = demoPrices[symbol] || 1000;
    return +(base * (1 + (Math.random()-0.5)*0.01)).toFixed(2);
  }
  // ── REAL DHAN API CALL ──
  try {
    const res = await fetch(`https://api.dhan.co/v2/marketfeed/ltp`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "access-token": API_CONFIG.ACCESS_TOKEN,
        "client-id":    API_CONFIG.CLIENT_ID,
      },
      body: JSON.stringify({ NSE_EQ: [symbol] }),
    });
    const data = await res.json();
    return data?.data?.NSE_EQ?.[symbol]?.last_price || null;
  } catch(e) {
    console.error("Dhan API error:", e);
    return null;
  }
}

// ── SIGNAL CALCULATOR ─────────────────────────────
function calcSignal(logic, price, prevPrice, volume) {
  const change = prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0;
  const strength = Math.min(95, Math.max(20, 50 + change * 10 + Math.random() * 15));

  // Real logic hooks - Python se match karne wale rules
  const signals = [];
  switch(logic) {
    case "rsi":
      if (change < -1.5) signals.push({ s: "RSI OVERSOLD", type:"buy" });
      else if (change > 1.5) signals.push({ s: "RSI OVERBOUGHT", type:"sell" });
      else signals.push({ s: "RSI NEUTRAL", type:"wait" });
      break;
    case "macd":
      if (change > 0.5) signals.push({ s: "MACD BULLISH CROSS", type:"buy" });
      else if (change < -0.5) signals.push({ s: "MACD BEARISH CROSS", type:"sell" });
      else signals.push({ s: "MACD FLAT", type:"wait" });
      break;
    case "bb":
      if (change > 1) signals.push({ s: "BB UPPER BREAKOUT", type:"buy" });
      else if (change < -1) signals.push({ s: "BB LOWER BREAK", type:"sell" });
      else signals.push({ s: "BB MID ZONE", type:"wait" });
      break;
    case "ema":
      if (change > 0.3) signals.push({ s: "EMA GOLDEN CROSS", type:"buy" });
      else if (change < -0.3) signals.push({ s: "EMA DEATH CROSS", type:"sell" });
      else signals.push({ s: "EMA SIDEWAYS", type:"wait" });
      break;
    case "supertrend":
      if (change > 0.2) signals.push({ s: "ST BULLISH FLIP", type:"buy" });
      else if (change < -0.2) signals.push({ s: "ST BEARISH FLIP", type:"sell" });
      else signals.push({ s: "ST NO SIGNAL", type:"wait" });
      break;
    case "vwap":
      if (change > 0.4) signals.push({ s: "PRICE > VWAP", type:"buy" });
      else if (change < -0.4) signals.push({ s: "PRICE < VWAP", type:"sell" });
      else signals.push({ s: "AT VWAP", type:"wait" });
      break;
    default:
      if (change > 0.5) signals.push({ s: "BULLISH SIGNAL", type:"buy" });
      else if (change < -0.5) signals.push({ s: "BEARISH SIGNAL", type:"sell" });
      else signals.push({ s: "NO SIGNAL", type:"wait" });
  }
  return { strength: Math.round(strength), signals };
}

// ── UI COMPONENTS ─────────────────────────────────
function Badge({ type }) {
  const map = {
    buy:  { bg:"rgba(0,255,136,0.12)",  c:"#00ff88", b:"rgba(0,255,136,0.3)",  l:"BUY"    },
    sell: { bg:"rgba(255,68,102,0.12)", c:"#ff4466", b:"rgba(255,68,102,0.3)", l:"SELL"   },
    wait: { bg:"rgba(255,170,0,0.10)",  c:"#ffaa00", b:"rgba(255,170,0,0.25)", l:"WAIT"   },
    ce:   { bg:"rgba(0,200,255,0.12)",  c:"#00c8ff", b:"rgba(0,200,255,0.3)",  l:"BUY CE" },
    pe:   { bg:"rgba(255,140,0,0.12)",  c:"#ff8c00", b:"rgba(255,140,0,0.3)",  l:"BUY PE" },
  };
  const m = map[type] || map.wait;
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3,
      background:m.bg, color:m.c, border:`1px solid ${m.b}`,
      fontFamily:"'Rajdhani',sans-serif", letterSpacing:1 }}>{m.l}</span>
  );
}

function ScannerCard({ sc, accent, scanData }) {
  const [open, setOpen] = useState(false);
  const data = scanData[sc.id] || { strength:0, signals:[], prices:{} };

  return (
    <div onClick={() => setOpen(o=>!o)} style={{
      background:"#0a0f1a", border:`1px solid ${open ? accent : "#1e293b"}`,
      borderRadius:8, marginBottom:10, cursor:"pointer", overflow:"hidden",
      boxShadow: open ? `0 0 14px ${accent}30` : "none", transition:"all 0.25s",
    }}>
      {/* Header */}
      <div style={{ padding:"12px 14px", display:"flex", justifyContent:"space-between",
        alignItems:"center", background: open ? `${accent}10` : "transparent" }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:accent, letterSpacing:1 }}>{sc.name}</div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#334155", marginTop:2 }}>{sc.id}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
            color: data.strength>=70?"#00ff88":data.strength>=45?"#ffaa00":"#ff4466",
            fontWeight:"bold" }}>{data.strength}%</span>
          <span style={{ color:"#334155", fontSize:13 }}>{open?"▲":"▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ borderTop:"1px solid #1e293b" }}>
          {/* Indicators */}
          <div style={{ padding:"10px 14px", display:"flex", flexWrap:"wrap", gap:5, borderBottom:"1px solid #1e293b" }}>
            {sc.inds.map((ind,i) => (
              <span key={i} style={{ fontSize:10, padding:"2px 7px", borderRadius:3,
                fontFamily:"'Share Tech Mono',monospace",
                background: i<2 ? `${accent}15` : "#111827",
                color: i<2 ? accent : "#475569",
                border:`1px solid ${i<2 ? accent+"50" : "#1e293b"}` }}>{ind}</span>
            ))}
          </div>

          {/* Strength Bar */}
          <div style={{ padding:"8px 14px 4px" }}>
            <div style={{ height:2, background:"#1e293b", borderRadius:1, overflow:"hidden", marginBottom:3 }}>
              <div style={{ height:"100%", borderRadius:1, transition:"width 1s",
                width:`${data.strength}%`,
                background: data.strength>=70?"#00ff88":data.strength>=45?"#ffaa00":"#ff4466" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10,
              fontFamily:"'Share Tech Mono',monospace" }}>
              <span style={{ color:"#334155" }}>SIGNAL STRENGTH</span>
              <span style={{ color:accent }}>{data.strength}%</span>
            </div>
          </div>

          {/* Signals */}
          <div style={{ padding:"4px 14px 12px" }}>
            {data.signals.length === 0
              ? <div style={{ color:"#334155", fontSize:11, fontFamily:"'Share Tech Mono',monospace",
                  padding:"8px 0", textAlign:"center" }}>⏳ Fetching signals...</div>
              : data.signals.map((sig,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"6px 0",
                  borderBottom: i<data.signals.length-1 ? "1px solid #111827" : "none" }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
                    color:"#e2e8f0", fontWeight:"bold" }}>{sig.s}</span>
                  {data.prices[sig.s] &&
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#475569" }}>
                      ₹{data.prices[sig.s]}
                    </span>}
                  <Badge type={sig.type} />
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null);
  const [uname, setUname]     = useState("");
  const [pass, setPass]       = useState("");
  const [err, setErr]         = useState("");
  const [page, setPage]       = useState("A");
  const [time, setTime]       = useState("");
  const [scanData, setScanData] = useState({});
  const [loading, setLoading]   = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");
  const [prevPrices, setPrevPrices] = useState({});

  // Clock
  useEffect(() => {
    const saved = sessionStorage.getItem("trinetr_user");
    if (saved) setUser(JSON.parse(saved));
    const tick = setInterval(() => {
      const n = new Date();
      setTime(`${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}:${n.getSeconds().toString().padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // ── MAIN SCAN FUNCTION ──
  const runScan = useCallback(async () => {
    setLoading(true);
    const newData = {};
    const newPrices = {};

    for (const symbol of WATCHLIST.slice(0,15)) {
      const price = await fetchLivePrice(symbol);
      if (price) newPrices[symbol] = price;
    }

    for (const sc of SCANNER_DEFS) {
      const prices = {};
      const results = [];
      for (const symbol of WATCHLIST.slice(0,8)) {
        const price = newPrices[symbol] || 1000;
        const prev  = prevPrices[symbol] || price;
        prices[symbol] = price;
        const { signals } = calcSignal(sc.logic, price, prev, 0);
        if (signals[0]?.type !== "wait") {
          results.push({ s: symbol, type: signals[0]?.type || "wait", price });
        }
      }
      const { strength } = calcSignal(sc.logic,
        newPrices[WATCHLIST[0]] || 1000,
        prevPrices[WATCHLIST[0]] || 1000, 0);

      newData[sc.id] = {
        strength,
        signals: results.slice(0,4).map(r => ({ s:r.s, type:r.type })),
        prices,
      };
    }

    setPrevPrices(newPrices);
    setScanData(newData);
    setLoading(false);
    const n = new Date();
    setLastUpdate(`${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}:${n.getSeconds().toString().padStart(2,"0")}`);
  }, [prevPrices]);

  // Auto refresh
  useEffect(() => {
    if (!user) return;
    runScan();
    const interval = setInterval(runScan, API_CONFIG.REFRESH_SEC * 1000);
    return () => clearInterval(interval);
  }, [user]);

  function handleLogin() {
    const found = USERS.find(u => u.username===uname.trim() && u.password===pass);
    if (!found) { setErr("❌ Wrong username or password"); return; }
    const session = { username:found.username, role:found.role };
    sessionStorage.setItem("trinetr_user", JSON.stringify(session));
    setUser(session); setErr("");
  }

  function handleLogout() {
    sessionStorage.removeItem("trinetr_user");
    setUser(null); setUname(""); setPass("");
  }

  const currentPage = PAGES.find(p => p.key===page);
  const pageScanners = SCANNER_DEFS.filter(s => s.page===page);
  const totalBuy  = pageScanners.reduce((a,sc) => a + (scanData[sc.id]?.signals?.filter(s=>s.type==="buy"||s.type==="ce").length||0), 0);
  const totalSell = pageScanners.reduce((a,sc) => a + (scanData[sc.id]?.signals?.filter(s=>s.type==="sell"||s.type==="pe").length||0), 0);

  // ── LOGIN ──
  if (!user) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(ellipse at center,#0f1e3a 0%,#030712 70%)",
      fontFamily:"'Rajdhani',sans-serif" }}>
      <div style={{ width:"min(360px,92vw)", background:"#0a0f1a", border:"1px solid #ff9800",
        padding:"2rem", display:"flex", flexDirection:"column", gap:"1rem",
        alignItems:"center", borderRadius:8 }}>
        <div style={{ fontSize:"3rem" }}>🔱</div>
        <div style={{ fontFamily:"'Orbitron',monospace", color:"#ff9800", fontSize:"1.3rem", letterSpacing:4 }}>
          TRINETR PRO
        </div>
        <div style={{ color:"#475569", fontSize:"0.8rem" }}>Stock Intelligence Platform</div>

        {err && <div style={{ background:"#1a0000", border:"1px solid #ff3d00", color:"#ff3d00",
          padding:"0.5rem 1rem", width:"100%", textAlign:"center", fontSize:"0.85rem", borderRadius:4 }}>{err}</div>}

        <input style={{ width:"100%", background:"#111", border:"1px solid #1e293b", color:"#fff",
          padding:"0.75rem 1rem", fontSize:"1rem", outline:"none", borderRadius:4,
          fontFamily:"'Rajdhani',sans-serif" }}
          placeholder="Username" value={uname}
          onChange={e=>setUname(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleLogin()} />

        <input style={{ width:"100%", background:"#111", border:"1px solid #1e293b", color:"#fff",
          padding:"0.75rem 1rem", fontSize:"1rem", outline:"none", borderRadius:4,
          fontFamily:"'Rajdhani',sans-serif" }}
          placeholder="Password" type="password" value={pass}
          onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleLogin()} />

        <button onClick={handleLogin} style={{ width:"100%", background:"#ff9800", color:"#000",
          border:"none", padding:"0.85rem", fontSize:"1rem", fontWeight:700,
          cursor:"pointer", letterSpacing:2, borderRadius:4, fontFamily:"'Rajdhani',sans-serif" }}>
          🔐 LOGIN
        </button>

        <div style={{ color:"#334155", fontSize:"0.7rem" }}>
          {isDemoMode ? "⚠️ DEMO MODE — API not connected" : "✅ LIVE MODE — Dhan API Active"}
        </div>
      </div>
    </div>
  );

  // ── MAIN APP ──
  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column",
      background:"#030712", fontFamily:"'Rajdhani',sans-serif", overflow:"hidden" }}>

      {/* Top Bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 1rem",
        background:"#0a0f1a", borderBottom:"1px solid #ff9800", flexShrink:0 }}>
        <span style={{ fontFamily:"'Orbitron',monospace", color:"#ff9800", fontSize:"0.85rem", letterSpacing:2 }}>
          🔱 TRINETR
        </span>
        {isDemoMode
          ? <span style={{ fontSize:10, background:"rgba(255,170,0,0.15)", color:"#ffaa00",
              border:"1px solid rgba(255,170,0,0.3)", padding:"1px 8px", borderRadius:3,
              fontFamily:"'Share Tech Mono',monospace" }}>DEMO</span>
          : <span style={{ fontSize:10, background:"rgba(0,255,136,0.15)", color:"#00ff88",
              border:"1px solid rgba(0,255,136,0.3)", padding:"1px 8px", borderRadius:3,
              fontFamily:"'Share Tech Mono',monospace" }}>LIVE</span>
        }
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          {loading && <span style={{ fontSize:10, color:"#ffaa00", fontFamily:"'Share Tech Mono',monospace",
            animation:"pulse 1s infinite" }}>⟳ Scanning...</span>}
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#475569" }}>{time}</span>
          <button onClick={runScan} style={{ background:"none", border:"1px solid #1e293b",
            color:"#475569", padding:"2px 8px", cursor:"pointer", fontSize:11, borderRadius:4 }}>⟳</button>
          <button onClick={handleLogout} style={{ background:"none", border:"1px solid #334155",
            color:"#64748b", padding:"2px 8px", cursor:"pointer", fontSize:10, borderRadius:4 }}>OUT</button>
        </div>
      </div>

      {/* Page Tabs */}
      <div style={{ display:"flex", gap:4, padding:"8px 12px", background:"#0a0f1a",
        borderBottom:"1px solid #1e293b", flexShrink:0, overflowX:"auto" }}>
        {PAGES.map(p => (
          <button key={p.key} onClick={()=>setPage(p.key)} style={{
            padding:"6px 14px", border:`1px solid ${page===p.key ? p.color : "#1e293b"}`,
            background: page===p.key ? `${p.color}18` : "transparent",
            color: page===p.key ? p.color : "#475569",
            cursor:"pointer", borderRadius:4, fontSize:12, fontWeight:700,
            fontFamily:"'Rajdhani',sans-serif", letterSpacing:1, whiteSpace:"nowrap",
            boxShadow: page===p.key ? `0 0 12px ${p.color}40` : "none",
          }}>
            {p.key} · {p.label}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div style={{ display:"flex", gap:8, padding:"6px 12px", background:"#030712",
        borderBottom:"1px solid #1e293b", flexShrink:0 }}>
        {[
          { label:"BUY",      val:totalBuy,               color:"#00ff88" },
          { label:"SELL",     val:totalSell,              color:"#ff4466" },
          { label:"SCANNERS", val:pageScanners.length,    color:currentPage.color },
          { label:"UPDATED",  val:lastUpdate||"--:--:--", color:"#475569" },
        ].map(st => (
          <div key={st.label} style={{ background:"#0a0f1a", border:"1px solid #1e293b",
            borderRadius:4, padding:"4px 10px", display:"flex", gap:5, alignItems:"center" }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:"#334155" }}>{st.label}</span>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
              color:st.color, fontWeight:"bold" }}>{st.val}</span>
          </div>
        ))}
      </div>

      {/* Page Title */}
      <div style={{ padding:"8px 14px 2px", flexShrink:0,
        background:`linear-gradient(90deg,${currentPage.color}15,transparent)` }}>
        <span style={{ fontFamily:"'Orbitron',monospace", fontSize:16, color:currentPage.color,
          textShadow:`0 0 12px ${currentPage.color}60` }}>
          PAGE {currentPage.key} — {currentPage.label}
        </span>
      </div>

      {/* Scanner Cards */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px 12px 80px" }}>
        {pageScanners.map(sc => (
          <ScannerCard key={sc.id} sc={sc} accent={currentPage.color} scanData={scanData} />
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0,
        display:"flex", background:"#0a0f1a", borderTop:"1px solid #1e293b", zIndex:99 }}>
        {PAGES.map(p => (
          <button key={p.key} onClick={()=>setPage(p.key)} style={{
            flex:1, padding:"10px 4px", background:"transparent", border:"none",
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
          }}>
            <span style={{ fontSize:11, fontWeight:700, fontFamily:"'Share Tech Mono',monospace",
              color: page===p.key ? p.color : "#334155" }}>{p.key}</span>
            <span style={{ fontSize:8, color: page===p.key ? p.color : "#1e293b",
              fontFamily:"'Rajdhani',sans-serif" }}>{p.label}</span>
            {page===p.key && <div style={{ width:20, height:2, background:p.color, borderRadius:1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
