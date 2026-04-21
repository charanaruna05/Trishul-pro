/* ═══════════════════════════════════════
   TRINETRAA PRO — MAIN APP LOGIC
   Login, Navigation, Brokers, Scanners
═══════════════════════════════════════ */

let APP_PWD = APP_CONFIG.defaultPwd;
let generatedOTP = '';
let otpTimer = null;
let otpExpired = false;

// ── BROKER CONNECTIONS STORAGE ──
const brokerConnections = {};

// ══════════════════════════
//  NAVIGATION
// ══════════════════════════
function goPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('pg-'+id).classList.add('active');
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'));
  const nb = document.getElementById('nb-'+id);
  if (nb) nb.classList.add('on');
  if (id==='watch') renderWatchlist();
  if (id==='chart') setTimeout(drawMain, 60);
  if (id==='scanner') renderScanners();
  if (id==='broker') renderBrokers();
}

// ══════════════════════════
//  LOGIN
// ══════════════════════════
function doLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value;
  const e = document.getElementById('l-err');
  if (u === APP_CONFIG.username && p === APP_PWD) {
    e.textContent = '';
    document.getElementById('pg-login').classList.remove('active');
    document.getElementById('bnav').classList.remove('hidden');
    goPage('home');
    buildSectors();
    startTick();
    updateLivePrices();
    setInterval(updateLivePrices, 30000);
  } else {
    e.textContent = '❌ Invalid username or password';
  }
}
document.addEventListener('keydown', ev => { if(ev.key==='Enter') doLogin(); });

function doLogout() {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('pg-login').classList.add('active');
  document.getElementById('bnav').classList.add('hidden');
  document.getElementById('l-user').value = '';
  document.getElementById('l-pass').value = '';
}

// ══════════════════════════
//  SECTORS
// ══════════════════════════
function buildSectors() {
  const grid = document.getElementById('sectorGrid');
  if (!grid || grid.children.length > 0) return;
  SECTORS.forEach(sec => {
    const div = document.createElement('div');
    const diff = sec.b - sec.s;
    let cls = 'neutral';
    if (diff > 2) cls = 'bullish';
    else if (diff < -2) cls = 'bearish';
    div.className = 'sbox ' + cls;
    div.onclick = () => openSector(sec.n);
    div.innerHTML = `<span class="box-name">${sec.n}</span><div class="box-data"><span style="color:var(--green)">▲${sec.b}</span> <span style="color:var(--red)">▼${sec.s}</span></div>`;
    grid.appendChild(div);
  });
}

function openSector(name) {
  document.getElementById('sheetTitle').innerText = name + ' STOCKS';
  document.getElementById('buyList').innerHTML = '<li>• RELIANCE</li><li>• HDFCBANK</li>';
  document.getElementById('sellList').innerHTML = '<li>• ITC</li>';
  document.getElementById('sectorSheet').classList.add('open');
}
function closeSheet(id) { document.getElementById(id).classList.remove('open'); }

// ══════════════════════════
//  SIGNALS
// ══════════════════════════
function openSigDetail(title) {
  document.getElementById('sig-title').innerText = title;
  const list = document.getElementById('sig-list');
  list.innerHTML = '';
  const data = SIG_DATA[title] || [];
  let b=0, s=0;
  data.forEach(item => {
    if (item.t==='up') b++; else s++;
    list.innerHTML += `<div class="v-item" style="margin:0 8px 7px;">
      <div class="cell"><span class="st-name">${item.n}</span><br><small style="font-size:7px;color:var(--accent)">${item.src}</small></div>
      <div class="v-cut"></div>
      <div class="cell"><span class="st-price ${item.t==='up'?'up':'down'}">₹${item.p}</span></div>
      <div class="v-cut"></div>
      <div class="cell"><span class="st-tag ${item.t==='up'?'bg-up':'bg-down'}">${item.s}</span><div style="font-size:8px;margin-top:3px;color:#888;">STR: <b style="color:#fff">${item.sc}%</b></div></div>
    </div>`;
  });
  document.getElementById('b-cnt').innerText = b;
  document.getElementById('s-cnt').innerText = s;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('pg-sig-detail').classList.add('active');
  document.getElementById('nb-signal').classList.add('on');
}

// ══════════════════════════
//  SCANNERS (9 SCANNERS)
// ══════════════════════════
function renderScanners() {
  const grid = document.getElementById('scanner-grid');
  if (!grid || grid.children.length > 0) return;
  SCANNERS.forEach(sc => {
    const card = document.createElement('div');
    card.className = `scan-card ${sc.cls}`;
    card.onclick = () => openScanner(sc.id);
    card.innerHTML = `
      <div class="scan-icon">${sc.icon}</div>
      <div class="scan-name">${sc.name}</div>
      <div class="scan-desc">${sc.desc}</div>
      <span class="scan-badge ${sc.badgeCls}">${sc.badge}</span>`;
    grid.appendChild(card);
  });
}

function openScanner(id) {
  const sc = SCANNERS.find(s=>s.id===id);
  if (!sc) return;
  // Reuse signal detail page
  document.getElementById('sig-title').innerText = sc.name;
  const list = document.getElementById('sig-list');
  list.innerHTML = '';
  let b=0, s=0;
  sc.stocks.forEach(item => {
    if (item.t==='up') b++; else s++;
    list.innerHTML += `<div class="v-item" style="margin:0 8px 7px;">
      <div class="cell"><span class="st-name">${item.n}</span><br><small style="font-size:7px;color:var(--accent)">SCANNER</small></div>
      <div class="v-cut"></div>
      <div class="cell"><span class="st-price ${item.t==='up'?'up':'down'}">₹${item.p}</span></div>
      <div class="v-cut"></div>
      <div class="cell"><span class="st-tag ${item.t==='up'?'bg-up':'bg-down'}">${item.s}</span><div style="font-size:8px;margin-top:3px;color:#888;">STR: <b style="color:#fff">${item.sc}%</b></div></div>
    </div>`;
  });
  document.getElementById('b-cnt').innerText = b;
  document.getElementById('s-cnt').innerText = s;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('pg-sig-detail').classList.add('active');
  document.getElementById('nb-scanner').classList.add('on');
}

// ══════════════════════════
//  BROKERS (10 BROKERS)
// ══════════════════════════
function renderBrokers() {
  const list = document.getElementById('broker-list');
  if (!list || list.children.length > 0) return;
  BROKERS.forEach(br => {
    const card = document.createElement('div');
    const isConnected = brokerConnections[br.id];
    card.className = `broker-card ${isConnected?'connected':''}`;
    card.id = `bcard-${br.id}`;
    card.innerHTML = `
      <div class="broker-logo" style="background:${br.bg};color:${br.color};border:1px solid ${br.color}33">${br.icon}</div>
      <div class="broker-info">
        <div class="broker-name">${br.name}</div>
        <div class="broker-sub">${br.sub}</div>
        <div class="broker-status ${isConnected?'on':'off'}" id="bstatus-${br.id}">${isConnected?'✅ Connected':'⭕ Not Connected'}</div>
      </div>
      <button class="b-connect-btn ${isConnected?'disco':''}" id="bbtn-${br.id}" onclick="openBrokerModal('${br.id}')">${isConnected?'DISCONNECT':'CONNECT'}</button>`;
    list.appendChild(card);
  });
}

let currentBrokerModal = null;

function openBrokerModal(brokerId) {
  const br = BROKERS.find(b=>b.id===brokerId);
  if (!br) return;
  currentBrokerModal = brokerId;

  // If already connected → disconnect
  if (brokerConnections[brokerId]) {
    brokerConnections[brokerId] = false;
    updateBrokerCard(brokerId, false);
    return;
  }

  const modal = document.getElementById('broker-modal');
  const box = document.getElementById('bm-box-content');

  let fieldsHTML = br.fields.map(f =>
    `<input class="bm-input" id="bm-${f.id}" type="${f.type}" placeholder="${f.label}" autocomplete="off" value="${f.default||''}"/>`
  ).join('');

  box.innerHTML = `
    <div class="bm-title">🔗 ${br.name.toUpperCase()}</div>
    <div class="bm-sub">${br.sub}</div>
    <span class="bm-close" onclick="closeBrokerModal()">✕</span>
    <div class="bm-info">ℹ️ ${br.info}</div>
    ${fieldsHTML}
    <button class="bm-btn" onclick="saveBrokerCredentials('${brokerId}')">CONNECT ${br.name.toUpperCase()} →</button>
    <div class="bm-msg" id="bm-msg"></div>`;

  modal.classList.add('show');
}

function saveBrokerCredentials(brokerId) {
  const br = BROKERS.find(b=>b.id===brokerId);
  const msg = document.getElementById('bm-msg');

  // Validate fields
  for (const f of br.fields) {
    const val = document.getElementById('bm-'+f.id)?.value?.trim();
    if (!val) {
      msg.style.color = '#e74c3c';
      msg.textContent = `❌ ${f.label} required`;
      return;
    }
  }

  msg.style.color = '#ffd700';
  msg.textContent = '⏳ Connecting...';

  // Simulate connection (in real app → call broker API)
  setTimeout(() => {
    brokerConnections[brokerId] = true;
    msg.style.color = '#2ecc71';
    msg.textContent = `✅ ${br.name} Connected Successfully!`;
    setTimeout(() => {
      closeBrokerModal();
      updateBrokerCard(brokerId, true);
    }, 1200);
  }, 1500);
}

function updateBrokerCard(brokerId, connected) {
  const card = document.getElementById(`bcard-${brokerId}`);
  const status = document.getElementById(`bstatus-${brokerId}`);
  const btn = document.getElementById(`bbtn-${brokerId}`);
  if (!card) return;
  if (connected) {
    card.classList.add('connected');
    if (status) { status.className = 'broker-status on'; status.textContent = '✅ Connected'; }
    if (btn) { btn.className = 'b-connect-btn disco'; btn.textContent = 'DISCONNECT'; }
  } else {
    card.classList.remove('connected');
    if (status) { status.className = 'broker-status off'; status.textContent = '⭕ Not Connected'; }
    if (btn) { btn.className = 'b-connect-btn'; btn.textContent = 'CONNECT'; }
  }
}

function closeBrokerModal() {
  document.getElementById('broker-modal').classList.remove('show');
  currentBrokerModal = null;
}

// ══════════════════════════
//  WATCHLIST
// ══════════════════════════
function renderWatchlist() {
  const tbody = document.getElementById('wl-body');
  if (!tbody || tbody.children.length > 0) return;
  for (let i=1; i<=30; i++) {
    const name = WL_NAMES[i%WL_NAMES.length];
    const scanFull = WL_SCANS[i%WL_SCANS.length];
    const isBuy = i%2===0;
    const price = (2000+i*15.5).toFixed(2);
    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td onclick="openWlStock('${name}','${price}')" style="color:var(--gold);font-weight:900;cursor:pointer;">${name}</td>
      <td>${price}</td>
      <td>IT</td>
      <td style="font-size:8px;color:var(--accent)">${scanFull.substring(0,4)}</td>
      <td style="color:${isBuy?'var(--green)':'var(--red)'};font-weight:900;">${isBuy?'BUY':'SELL'}</td>
      <td style="font-size:9px;">${isBuy?'🟢':'🔴'}</td>
    </tr>`;
  }
}

function openWlStock(name, price) {
  document.getElementById('wl-popup').classList.add('open');
  document.getElementById('popup-name').textContent = name;
  document.getElementById('popup-price').textContent = '₹'+price;
}
function closeWlPopup() { document.getElementById('wl-popup').classList.remove('open'); }

function openWlSector(sec) {
  alert('Sector: '+sec);
}

// ══════════════════════════
//  PROFILE / PNL
// ══════════════════════════
function toggleMode() {
  const isDark = document.body.style.background !== 'white';
  document.body.style.background = isDark?'white':'';
  document.body.style.color = isDark?'#000':'';
  const btn = document.getElementById('mode-btn');
  if (btn) btn.textContent = isDark?'DARK':'LIGHT';
}

function setPnl(btn, k) {
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('on')); btn.classList.add('on');
  const d = PNL[k];
  document.getElementById('pnl-val').textContent = d.v;
  document.getElementById('pnl-tr').textContent = d.t;
  document.getElementById('pnl-ac').textContent = d.a;
}

// ══════════════════════════
//  OTP PASSWORD CHANGE
// ══════════════════════════
function startChangePassword() {
  ['otp-s1','otp-s2','otp-s3','otp-s4'].forEach(id=>document.getElementById(id).classList.remove('show'));
  document.getElementById('otp-s1').classList.add('show');
  document.getElementById('cur-pwd').value = '';
  document.getElementById('s1-msg').textContent = '';
  document.getElementById('otp-modal').classList.add('show');
}

function closeOtpModal() {
  document.getElementById('otp-modal').classList.remove('show');
  if (otpTimer) clearInterval(otpTimer);
}

function goOtpStep(from, to) {
  document.getElementById('otp-s'+from).classList.remove('show');
  document.getElementById('otp-s'+to).classList.add('show');
}

function verifyCurPwd() {
  const entered = document.getElementById('cur-pwd').value;
  const msg = document.getElementById('s1-msg');
  if (!entered) { msg.style.color='#e74c3c'; msg.textContent='❌ Password खाली नहीं होना चाहिए'; return; }
  if (entered !== APP_PWD) { msg.style.color='#e74c3c'; msg.textContent='❌ Current password गलत है'; return; }
  generatedOTP = String(Math.floor(100000 + Math.random()*900000));
  otpExpired = false;
  msg.textContent = '';
  document.getElementById('otp-show').textContent = generatedOTP;
  document.getElementById('otp-enter').value = '';
  document.getElementById('s2-msg').textContent = '';
  let secs = 60;
  document.getElementById('otp-timer').textContent = secs+'s';
  if (otpTimer) clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    secs--;
    document.getElementById('otp-timer').textContent = secs+'s';
    if (secs <= 0) {
      clearInterval(otpTimer); otpExpired = true;
      document.getElementById('otp-show').textContent = '------';
      document.getElementById('otp-timer').textContent = 'EXPIRED';
      document.getElementById('s2-msg').style.color = '#e74c3c';
      document.getElementById('s2-msg').textContent = '⏱ OTP expire हो गया।';
    }
  }, 1000);
  goOtpStep(1, 2);
}

function verifyOtp() {
  const entered = document.getElementById('otp-enter').value.trim();
  const msg = document.getElementById('s2-msg');
  if (otpExpired) { msg.style.color='#e74c3c'; msg.textContent='⏱ OTP expire हो गया।'; return; }
  if (!entered) { msg.style.color='#e74c3c'; msg.textContent='❌ OTP डालें'; return; }
  if (entered !== generatedOTP) { msg.style.color='#e74c3c'; msg.textContent='❌ OTP गलत है'; return; }
  clearInterval(otpTimer);
  document.getElementById('new-pwd1').value = '';
  document.getElementById('new-pwd2').value = '';
  document.getElementById('s3-msg').textContent = '';
  goOtpStep(2, 3);
}

function setNewPassword() {
  const p1 = document.getElementById('new-pwd1').value;
  const p2 = document.getElementById('new-pwd2').value;
  const msg = document.getElementById('s3-msg');
  if (!p1) { msg.style.color='#e74c3c'; msg.textContent='❌ Password खाली नहीं होना चाहिए'; return; }
  if (p1.length < 6) { msg.style.color='#e74c3c'; msg.textContent='❌ कम से कम 6 characters'; return; }
  if (p1 !== p2) { msg.style.color='#e74c3c'; msg.textContent='❌ Passwords match नहीं कर रहे'; return; }
  APP_PWD = p1; generatedOTP = '';
  goOtpStep(3, 4);
}

// ══════════════════════════
//  INIT
// ══════════════════════════
window.candles = genCandles(90, window.currentLTP, .008);
buildBoxes();
