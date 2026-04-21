/* ═══════════════════════════════════════
   TRINETRAA PRO — CHART ENGINE
═══════════════════════════════════════ */

const NS = 'http://www.w3.org/2000/svg';
const ZOOM_STEPS = [80,60,44,30,20,12];
window.zoomLevel = 1;
window.candles = [];
window.currentSym = 'RELIANCE';
window.currentLTP = 2985;

function genCandles(n, base, vol) {
  let p = base; const a = [];
  for (let i = 0; i < n; i++) {
    const tr = Math.sin(i/14)*.002+(i>45?.001:0);
    const o = p, mv = (Math.random()-.47+tr)*vol*p, c = o+mv, wk = Math.random()*vol*.4*p;
    a.push({o, h:Math.max(o,c)+wk, l:Math.min(o,c)-wk*Math.random(), c}); p = c;
  }
  return a;
}

function calcEMA(d, p) { const k=2/(p+1); let prev=d[0].c; return d.map(x=>{prev=x.c*k+prev*(1-k);return prev;}); }
function calcVWAP(d) { let ct=0,cv=0; return d.map(x=>{const tp=(x.h+x.l+x.c)/3,v=Math.abs(x.c-x.o)*200+600;ct+=tp*v;cv+=v;return ct/cv;}); }
function calcRSI(d,p=14) { let g=0,l=0;const r=[50];for(let i=1;i<d.length;i++){const df=d[i].c-d[i-1].c;if(i<p){g+=Math.max(0,df);l+=Math.max(0,-df);r.push(50);continue;}if(i===p){g/=p;l/=p;}else{g=(g*(p-1)+Math.max(0,df))/p;l=(l*(p-1)+Math.max(0,-df))/p;}r.push(100-100/(1+(l===0?100:g/l)));}return r[r.length-1]; }
function calcMACD(d) { const e12=calcEMA(d,12),e26=calcEMA(d,26),m=e12.map((v,i)=>v-e26[i]);const k=2/10;let prev=m[0];const sig=m.map(v=>{prev=v*k+prev*(1-k);return prev;});return m[m.length-1]-sig[sig.length-1]; }
function calcATR(d,p=14) { const tr=d.map((c,i)=>i===0?c.h-c.l:Math.max(c.h-c.l,Math.abs(c.h-d[i-1].c),Math.abs(c.l-d[i-1].c)));let prev=tr[0];for(let i=1;i<tr.length;i++)prev=(prev*(p-1)+tr[i])/p;return prev; }
function calcCCI(d,p=20) { const sl=d.slice(-p);const tp=(d[d.length-1].h+d[d.length-1].l+d[d.length-1].c)/3;const mean=sl.reduce((s,x)=>s+(x.h+x.l+x.c)/3,0)/sl.length;const md=sl.reduce((s,x)=>s+Math.abs((x.h+x.l+x.c)/3-mean),0)/sl.length;return md===0?0:(tp-mean)/(0.015*md); }
function calcMFI(d,p=14) { const sl=d.slice(-p);let pos=0,neg=0;sl.forEach((x,j)=>{const tp=(x.h+x.l+x.c)/3,v=Math.abs(x.c-x.o)*500+800,mf=tp*v;if(j===0){pos+=mf;return;}const ptp=(sl[j-1].h+sl[j-1].l+sl[j-1].c)/3;tp>=ptp?pos+=mf:neg+=mf;});return neg===0?100:100-(100/(1+pos/neg)); }
function calcOBV(d) { let o=0;d.forEach((c,i)=>{if(i===0)return;const v=Math.abs(c.c-c.o)*500+1000;o+=c.c>=d[i-1].c?v:-v;});return o; }
function calcCVD(d) { let c=0;d.forEach(x=>{const v=Math.abs(x.c-x.o)*500+800;c+=x.c>=x.o?v:-v;});return c; }
function calcStoch(d,p=14) { const sl=d.slice(-p);const hh=Math.max(...sl.map(c=>c.h)),ll=Math.min(...sl.map(c=>c.l));return hh===ll?50:(d[d.length-1].c-ll)/(hh-ll)*100; }
function calcZL(d,p=21) { const e1=calcEMA(d,p);const d2=d.map((c,i)=>({...c,c:2*c.c-e1[i]}));return calcEMA(d2,p)[d.length-1]; }
function calcORB(d) { const orbH=Math.max(...d.slice(0,5).map(c=>c.h)),orbL=Math.min(...d.slice(0,5).map(c=>c.l)),last=d[d.length-1].c;if(last>orbH)return{v:'BRK↑',sig:'BUY'};if(last<orbL)return{v:'BRK↓',sig:'SELL'};return{v:'RANGE',sig:'NTRL'}; }

const INDS = [
  {id:'rsi', name:'RSI',   calc:d=>{const v=calcRSI(d);return{v,sig:v>60?'BUY':v<40?'SELL':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'macd',name:'MACD',  calc:d=>{const v=calcMACD(d);return{v,sig:v>0?'BUY':v<0?'SELL':'NTRL'};},fmt:v=>(v>0?'+':'')+v.toFixed(1)},
  {id:'adx', name:'ADX',   calc:d=>{const v=Math.min(60,calcATR(d)/d[d.length-1].c*1000+10);return{v,sig:v>25?'BUY':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'cci', name:'CCI',   calc:d=>{const v=calcCCI(d);return{v,sig:v>100?'BUY':v<-100?'SELL':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'mfi', name:'MFI',   calc:d=>{const v=calcMFI(d);return{v,sig:v>60?'BUY':v<40?'SELL':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'obv', name:'OBV',   calc:d=>{const v=calcOBV(d);return{v:v/1000,sig:v>0?'BUY':v<0?'SELL':'NTRL'};},fmt:v=>(v>0?'+':'')+v.toFixed(0)+'K'},
  {id:'cvd', name:'CVD',   calc:d=>{const v=calcCVD(d);return{v:v/1000,sig:v>0?'BUY':v<0?'SELL':'NTRL'};},fmt:v=>(v>0?'+':'')+v.toFixed(0)+'K'},
  {id:'atr', name:'ATR',   calc:d=>{const v=calcATR(d);return{v,sig:v>30?'SELL':v<10?'BUY':'NTRL'};},fmt:v=>v.toFixed(1)},
  {id:'stch',name:'STOCH', calc:d=>{const v=calcStoch(d);return{v,sig:v>80?'SELL':v<20?'BUY':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'zl',  name:'Z-LAG', calc:d=>{const zl=calcZL(d),last=d[d.length-1].c;return{v:zl,sig:last>zl?'BUY':last<zl?'SELL':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'orb', name:'ORB',   calc:d=>calcORB(d),fmt:v=>v},
  {id:'vwap',name:'VWAP',  calc:d=>{const vw=calcVWAP(d);const last=d[d.length-1].c,vl=vw[vw.length-1];return{v:vl,sig:last>vl?'BUY':last<vl?'SELL':'NTRL'};},fmt:v=>v.toFixed(0)},
  {id:'pcr', name:'PCR',   calc:d=>{const v=0.7+Math.sin(d.length/10)*.4+Math.random()*.15;return{v,sig:v>1.2?'BUY':v<0.8?'SELL':'NTRL'};},fmt:v=>v.toFixed(2)},
  {id:'oi',  name:'OI',    calc:d=>{const v=(Math.random()-.4)*30;return{v,sig:v>5?'BUY':v<-5?'SELL':'NTRL'};},fmt:v=>(v>0?'+':'')+v.toFixed(1)+'%'},
  {id:'vroc',name:'VROC',  calc:d=>{const p=12;if(d.length<=p)return{v:0,sig:'NTRL'};const v=Math.abs(d[d.length-1].c-d[d.length-1].o)*500+1000;const pv=Math.abs(d[d.length-1-p].c-d[d.length-1-p].o)*500+1000;const vv=pv===0?0:((v-pv)/pv)*100;return{v:vv,sig:vv>5?'BUY':vv<-5?'SELL':'NTRL'};},fmt:v=>(v>0?'+':'')+v.toFixed(1)+'%'},
  {id:'mfid',name:'MFI-D', calc:d=>{const m1=calcMFI(d),m2=calcMFI(d.slice(0,-5)),p1=d[d.length-1].c,p2=d[d.length-6]?.c||p1;const div=(m1>m2&&p1<p2)||(m1<m2&&p1>p2);return{v:m1,sig:div?'SELL':m1>60?'BUY':'NTRL'};},fmt:v=>v.toFixed(0)},
];

function buildBoxes() {
  const grid = document.getElementById('ind-grid');
  if (!grid) return;
  grid.innerHTML = '';
  INDS.forEach(ind => {
    const box = document.createElement('div');
    box.className = 'ibox ntrl'; box.id = 'box-'+ind.id;
    box.innerHTML = `<div class="iname">${ind.name}</div><div class="ival" id="val-${ind.id}">—</div><div class="isig" id="sig-${ind.id}">—</div>`;
    grid.appendChild(box);
  });
}

function updateBoxes() {
  if (!window.candles.length) return;
  INDS.forEach(ind => {
    const res = ind.calc(window.candles); const {v, sig} = res;
    const box = document.getElementById('box-'+ind.id); if (!box) return;
    box.className = 'ibox '+(sig==='BUY'?'buy':sig==='SELL'?'sell':'ntrl');
    document.getElementById('val-'+ind.id).textContent = typeof v==='string'?v:ind.fmt(v);
    document.getElementById('sig-'+ind.id).textContent = sig;
    box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
  });
}

function findEntry(e9, e20) {
  for (let i=e9.length-1; i>2; i--) if (e9[i]>=e20[i]&&e9[i-1]<e20[i-1]) return i;
  let mi = Math.floor(window.candles.length*.35);
  for (let i=mi+1; i<window.candles.length-8; i++) if (window.candles[i].l<window.candles[mi].l) mi=i;
  return mi;
}

function mk(t) { return document.createElementNS(NS, t); }
function sa(el, a) { for (const [k,v] of Object.entries(a)) el.setAttribute(k,v); return el; }

function drawMain() {
  const svg = document.getElementById('main-svg');
  const wrap = document.getElementById('main-wrap');
  if (!svg || !wrap) return;
  const W = wrap.clientWidth||375, H = wrap.clientHeight||200;
  const PAD = {t:8, r:56, b:16, l:4};
  sa(svg, {viewBox:`0 0 ${W} ${H}`}); svg.innerHTML = '';
  const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b;
  const vn = ZOOM_STEPS[Math.min(window.zoomLevel-1, ZOOM_STEPS.length-1)];
  const si = Math.max(0, window.candles.length-vn);
  const vis = window.candles.slice(si); if (!vis.length) return;
  const e9all=calcEMA(window.candles,9), e20all=calcEMA(window.candles,20);
  const e9=e9all.slice(si), e20=e20all.slice(si);
  const fusion = e9.map((v,i)=>v*.6+e20[i]*.4);
  const vwap = calcVWAP(window.candles).slice(si);
  const allV = vis.flatMap(c=>[c.h,c.l]);
  const minV=Math.min(...allV)*.9993, maxV=Math.max(...allV)*1.0007, rng=maxV-minV;
  const sy = v => PAD.t+cH-((v-minV)/rng)*cH;
  const sx = i => PAD.l+(i+.5)*(cW/vis.length);
  const cw = Math.max(2, cW/vis.length-1.3);
  const poly = arr => arr.map((v,i)=>`${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
  const ap = el => { svg.appendChild(el); return el; };

  for (let i=0; i<5; i++) {
    const v = minV+(rng*i)/4;
    ap(sa(mk('line'),{x1:PAD.l,y1:sy(v),x2:PAD.l+cW,y2:sy(v),stroke:'#1a2840','stroke-width':'0.5','stroke-dasharray':'4,5',opacity:'.7'}));
    ap(sa(mk('text'),{x:PAD.l+cW+3,y:sy(v)+3,fill:'#2a345a','font-size':'6.5','font-family':'monospace'})).textContent = v.toFixed(0);
  }

  const pv = window.currentLTP, buf = window.currentLTP*.003;
  [[pv*1.02+buf,pv*1.02-buf,'rgba(231,76,60,.18)','#e74c3c','R1','#ff8877'],
   [pv*.98+buf,pv*.98-buf,'rgba(46,204,113,.15)','#2ecc71','S1','#6effa0']]
  .forEach(([top,bot,fill,bdr,lbl,lcol]) => {
    const zt=Math.min(top,maxV), zb=Math.max(bot,minV);
    if (zt<=minV||zb>=maxV) return;
    const y1=sy(zt), y2=sy(zb), h=Math.max(3,y2-y1);
    ap(sa(mk('rect'),{x:PAD.l,y:y1,width:cW,height:h,fill}));
    ap(sa(mk('rect'),{x:PAD.l,y:y1,width:2,height:h,fill:bdr}));
    ap(sa(mk('rect'),{x:PAD.l+cW,y:y1,width:55,height:h,fill}));
    ap(sa(mk('text'),{x:PAD.l+cW+4,y:y1+h/2+3,fill:lcol,'font-size':'6.5','font-family':'monospace','font-weight':'bold'})).textContent = lbl;
  });

  ap(sa(mk('polyline'),{points:poly(vwap),fill:'none',stroke:'#b0c8ff','stroke-width':'1','stroke-dasharray':'3,3',opacity:'.7'}));
  ap(sa(mk('polyline'),{points:poly(fusion),fill:'none',stroke:'#c8901e','stroke-width':'2.2','stroke-linejoin':'round',opacity:'.97'}));

  vis.forEach((c,i) => {
    const isUp=c.c>=c.o, col=isUp?'#27ae60':'#c0392b', colB=isUp?'#2ecc71':'#e74c3c';
    const bTop=sy(Math.max(c.o,c.c)), bH=Math.max(1,Math.abs(sy(c.o)-sy(c.c))), x=sx(i);
    ap(sa(mk('line'),{x1:x,y1:sy(c.h),x2:x,y2:sy(c.l),stroke:col,'stroke-width':'0.75'}));
    ap(sa(mk('rect'),{x:x-cw/2,y:bTop,width:cw,height:bH,fill:colB,rx:'0.2'}));
  });

  const eAbs=findEntry(e9all,e20all), eRel=eAbs-si;
  if (eRel>=0&&eRel<vis.length) {
    const ex=sx(eRel), ep=vis[eRel].l, ey=sy(ep)+4;
    ap(sa(mk('line'),{x1:ex,y1:PAD.t,x2:ex,y2:sy(ep),stroke:'#2ecc71','stroke-width':'.9','stroke-dasharray':'3,3',opacity:'.6'}));
    ap(sa(mk('path'),{d:`M${ex},${ey} L${ex-6},${ey+11} L${ex+6},${ey+11} Z`,fill:'#2ecc71'}));
    const lw=66,lh=13,lx=Math.max(PAD.l,Math.min(ex-lw/2,PAD.l+cW-lw)),ly=ey+13;
    ap(sa(mk('rect'),{x:lx,y:ly,width:lw,height:lh,fill:'#012a10',stroke:'#2ecc71','stroke-width':'1'}));
    ap(sa(mk('text'),{x:lx+lw/2,y:ly+9.5,fill:'#2ecc71','font-size':'7.5','font-family':'monospace','font-weight':'900','text-anchor':'middle','letter-spacing':'1.5'})).textContent = 'ENTRY '+ep.toFixed(0);
  }

  const lastC = vis[vis.length-1].c;
  ap(sa(mk('line'),{x1:PAD.l,y1:sy(lastC),x2:PAD.l+cW,y2:sy(lastC),stroke:'#ffd700','stroke-width':'.55','stroke-dasharray':'4,3',opacity:'.65'}));
  ap(sa(mk('rect'),{x:PAD.l+cW,y:sy(lastC)-6,width:55,height:12,fill:'#ffd700'}));
  ap(sa(mk('text'),{x:PAD.l+cW+28,y:sy(lastC)+3,fill:'#000','font-size':'7','font-family':'monospace','font-weight':'900','text-anchor':'middle'})).textContent = lastC.toFixed(2);

  const vf = document.getElementById('v-f'), vvw = document.getElementById('v-vw');
  if (vf) vf.textContent = fusion[fusion.length-1].toFixed(2);
  if (vvw) vvw.textContent = vwap[vwap.length-1].toFixed(2);
  const ltpEl = document.getElementById('c-ltp');
  if (ltpEl) ltpEl.textContent = lastC.toFixed(2);
  const prev = vis[vis.length-2]?.c||lastC, pct = ((lastC-prev)/prev*100).toFixed(2), isUp = lastC>=prev;
  if (ltpEl) ltpEl.style.color = isUp?'#2ecc71':'#e74c3c';
  const chgEl = document.getElementById('c-chg');
  if (chgEl) { chgEl.style.color = isUp?'#2ecc71':'#e74c3c'; chgEl.textContent = (isUp?'▲ +':'▼ ')+pct+'%'; }
  const zlblEl = document.getElementById('zlbl');
  if (zlblEl) zlblEl.textContent = `ZOOM ${window.zoomLevel}×  —  ${vis.length} candles`;
}

function doZoom(d) { window.zoomLevel = Math.max(1,Math.min(ZOOM_STEPS.length,window.zoomLevel+d)); drawMain(); }

const VM = {'1m':.004,'5m':.006,'10m':.008,'15m':.011,'1h':.014,'1D':.019};
function setTF(btn, tf) {
  document.querySelectorAll('.tf').forEach(b=>b.classList.remove('on')); btn.classList.add('on');
  window.candles = genCandles(90, window.currentLTP, VM[tf]||.008); window.zoomLevel=1; drawMain(); updateBoxes();
}

function openChart(sym, ltp) {
  window.currentSym = sym; window.currentLTP = ltp||2985;
  window.candles = genCandles(90, window.currentLTP, .008);
  window.zoomLevel = 1;
  goPage('chart');
  const symEl = document.getElementById('c-sym');
  if (symEl) symEl.textContent = sym;
  updateBoxes();
}

function startTick() {
  setInterval(() => {
    if (!window.candles.length) return;
    const last = window.candles[window.candles.length-1];
    const o=last.c, mv=(Math.random()-.47)*.004*o, c=o+mv, wk=Math.random()*.002*o;
    window.candles.push({o, h:Math.max(o,c)+wk, l:Math.min(o,c)-wk*.6, c});
    if (window.candles.length>130) window.candles.shift();
    const pg = document.querySelector('.page.active');
    if (pg && pg.id==='pg-chart') { drawMain(); updateBoxes(); }
  }, 3000);
}

window.addEventListener('resize', () => {
  const pg = document.querySelector('.page.active');
  if (pg && pg.id==='pg-chart') drawMain();
});
