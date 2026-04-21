/* ═══════════════════════════════════════
   TRINETRAA PRO — CONFIG FILE
   Brokers, Scanners, Symbols
═══════════════════════════════════════ */

// ── APP CONFIG ──
const APP_CONFIG = {
  name: 'TRINETRAA PRO',
  version: '2.0',
  username: 'Charan007',
  defaultPwd: '123456'
};

// ── 10 BROKERS CONFIG ──
const BROKERS = [
  {
    id: 'upstox',
    name: 'Upstox',
    sub: 'RKSV Securities',
    icon: '📈',
    color: '#6200ea',
    bg: '#1a0040',
    fields: [
      {id:'api_key', label:'API Key', type:'text'},
      {id:'api_secret', label:'API Secret', type:'password'},
      {id:'redirect_uri', label:'Redirect URI', type:'text', default:'https://trinetraa.app/callback'}
    ],
    info: 'Upstox API v2 | Settings → My API → Generate Key'
  },
  {
    id: 'dhan',
    name: 'Dhan',
    sub: 'Raise Financial Services',
    icon: '🔷',
    color: '#00b4d8',
    bg: '#001a20',
    fields: [
      {id:'client_id', label:'Client ID', type:'text'},
      {id:'access_token', label:'Access Token', type:'password'}
    ],
    info: 'Dhan HQ → API → Generate Access Token'
  },
  {
    id: 'mahindra',
    name: 'Mahindra Finance',
    sub: 'mStock by Mirae Asset',
    icon: '🏦',
    color: '#e63946',
    bg: '#1a0008',
    fields: [
      {id:'api_key', label:'API Key', type:'text'},
      {id:'api_secret', label:'API Secret', type:'password'}
    ],
    info: 'mStock API | Contact support for API access'
  },
  {
    id: 'kotak',
    name: 'Kotak Securities',
    sub: 'Kotak Neo API',
    icon: '🔴',
    color: '#e63946',
    bg: '#1a0005',
    fields: [
      {id:'consumer_key', label:'Consumer Key', type:'text'},
      {id:'consumer_secret', label:'Consumer Secret', type:'password'},
      {id:'access_token', label:'Access Token', type:'password'},
      {id:'mobile', label:'Mobile No.', type:'text'}
    ],
    info: 'Kotak Neo API | developer.kotaksecurities.com'
  },
  {
    id: 'angel',
    name: 'Angel One',
    sub: 'Angel Broking SmartAPI',
    icon: '😇',
    color: '#f77f00',
    bg: '#1a0d00',
    fields: [
      {id:'api_key', label:'API Key', type:'text'},
      {id:'client_code', label:'Client Code', type:'text'},
      {id:'password', label:'Password', type:'password'},
      {id:'totp', label:'TOTP Secret', type:'text'}
    ],
    info: 'Angel SmartAPI | smartapi.angelbroking.com'
  },
  {
    id: 'shoonya',
    name: 'Shoonya',
    sub: 'Finvasia Zero Brokerage',
    icon: '🟠',
    color: '#ff6b00',
    bg: '#1a0800',
    fields: [
      {id:'user_id', label:'User ID', type:'text'},
      {id:'password', label:'Password', type:'password'},
      {id:'api_key', label:'API Key', type:'text'},
      {id:'vendor_code', label:'Vendor Code', type:'text'},
      {id:'imei', label:'IMEI / Token', type:'text'}
    ],
    info: 'Shoonya API | shoonya.com → API Access'
  },
  {
    id: 'zerodha',
    name: 'Zerodha',
    sub: 'Kite Connect API',
    icon: '🟢',
    color: '#387ed1',
    bg: '#00081a',
    fields: [
      {id:'api_key', label:'API Key', type:'text'},
      {id:'api_secret', label:'API Secret', type:'password'}
    ],
    info: 'Kite Connect | kite.trade → API → Your Apps'
  },
  {
    id: 'fyers',
    name: 'Fyers',
    sub: 'Fyers API v3',
    icon: '🔵',
    color: '#0077b6',
    bg: '#00081a',
    fields: [
      {id:'app_id', label:'App ID', type:'text'},
      {id:'secret_key', label:'Secret Key', type:'password'},
      {id:'redirect_uri', label:'Redirect URI', type:'text', default:'https://trinetraa.app/callback'}
    ],
    info: 'Fyers API v3 | myaccount.fyers.in → API → My App'
  },
  {
    id: 'groww',
    name: 'Groww',
    sub: 'Groww API',
    icon: '🌱',
    color: '#00b386',
    bg: '#001a10',
    fields: [
      {id:'api_key', label:'API Key', type:'text'},
      {id:'api_secret', label:'API Secret', type:'password'}
    ],
    info: 'Groww API | groww.in/developer (Beta Access)'
  },
  {
    id: 'paisa5',
    name: '5Paisa',
    sub: '5Paisa Capital',
    icon: '5️⃣',
    color: '#7b2d8b',
    bg: '#0d001a',
    fields: [
      {id:'app_name', label:'App Name', type:'text'},
      {id:'app_source', label:'App Source', type:'text'},
      {id:'user_id', label:'User ID', type:'text'},
      {id:'password', label:'Password', type:'password'},
      {id:'user_key', label:'User Key', type:'text'},
      {id:'encryption_key', label:'Encryption Key', type:'password'}
    ],
    info: '5Paisa OpenAPI | 5paisa.com/developer'
  }
];

// ── 9 SCANNERS CONFIG ──
const SCANNERS = [
  {
    id: 'mahakal',
    name: '🔱 MAHAKAL',
    cls: 'mahakal',
    icon: '🔱',
    badge: 'HOT',
    badgeCls: 'badge-hot',
    desc: 'Powerful Reversal Scanner',
    stocks: [
      {n:'RELIANCE',p:'2985',s:'ULTRA BUY',sc:'96',t:'up'},
      {n:'HDFCBANK',p:'1623',s:'BUY',sc:'88',t:'up'},
      {n:'SBIN',p:'789',s:'BUY',sc:'82',t:'up'},
      {n:'TATAMOTORS',p:'874',s:'SELL',sc:'35',t:'down'},
      {n:'TCS',p:'3560',s:'HOLD',sc:'55',t:'up'}
    ]
  },
  {
    id: 'bhairav',
    name: '⚡ BHAIRAV',
    cls: 'bhairav',
    icon: '⚡',
    badge: 'PRO',
    badgeCls: 'badge-pro',
    desc: 'Momentum Breakout System',
    stocks: [
      {n:'ICICIBANK',p:'1120',s:'BUY',sc:'90',t:'up'},
      {n:'INFY',p:'1520',s:'BUY',sc:'78',t:'up'},
      {n:'BAJFINANCE',p:'7134',s:'STRONG BUY',sc:'94',t:'up'},
      {n:'WIPRO',p:'456',s:'SELL',sc:'28',t:'down'},
      {n:'ONGC',p:'234',s:'HOLD',sc:'52',t:'up'}
    ]
  },
  {
    id: 'morning',
    name: '🌅 MORNING BELL',
    cls: 'morning',
    icon: '🌅',
    badge: 'LIVE',
    badgeCls: 'badge-live',
    desc: '9:15 AM Opening Range Scanner',
    stocks: [
      {n:'NIFTY 50',p:'24520',s:'BUY',sc:'85',t:'up'},
      {n:'BANKNIFTY',p:'48236',s:'BUY',sc:'80',t:'up'},
      {n:'FINNIFTY',p:'23100',s:'SELL',sc:'30',t:'down'},
      {n:'MIDCPNIFTY',p:'11800',s:'HOLD',sc:'50',t:'up'},
      {n:'SENSEX',p:'81230',s:'BUY',sc:'76',t:'up'}
    ]
  },
  {
    id: 'brahmastra',
    name: '🏹 BRAHMASTRA',
    cls: 'brahmastra',
    icon: '🏹',
    badge: 'PRO',
    badgeCls: 'badge-pro',
    desc: 'Multi-TF Confluence Signal',
    stocks: [
      {n:'TATA MOTORS',p:'945',s:'B-SIGNAL',sc:'72',t:'up'},
      {n:'BAJFINANCE',p:'7134',s:'B-SIGNAL',sc:'68',t:'up'},
      {n:'ADANIENT',p:'2450',s:'B-SIGNAL',sc:'65',t:'up'},
      {n:'HINDALCO',p:'650',s:'SELL',sc:'32',t:'down'},
      {n:'BPCL',p:'345',s:'HOLD',sc:'48',t:'up'}
    ]
  },
  {
    id: 'sudarshan',
    name: '🌀 SUDARSHAN',
    cls: 'sudarshan',
    icon: '🌀',
    badge: 'LIVE',
    badgeCls: 'badge-live',
    desc: 'Trend Following System',
    stocks: [
      {n:'INFY',p:'1520',s:'S-SIGNAL',sc:'62',t:'up'},
      {n:'WIPRO',p:'456',s:'S-SIGNAL',sc:'48',t:'down'},
      {n:'HCLTECH',p:'1380',s:'BUY',sc:'70',t:'up'},
      {n:'LTI',p:'4200',s:'HOLD',sc:'55',t:'up'},
      {n:'MPHASIS',p:'2100',s:'SELL',sc:'35',t:'down'}
    ]
  },
  {
    id: 'trishul',
    name: '🔱 TRISHUL',
    cls: 'trishul',
    icon: '🔱',
    badge: 'HOT',
    badgeCls: 'badge-hot',
    desc: 'Commodity & Index Tracker',
    stocks: [
      {n:'GOLD',p:'72100',s:'BUY',sc:'78',t:'up'},
      {n:'SILVER',p:'88500',s:'BUY',sc:'65',t:'up'},
      {n:'CRUDEOIL',p:'6450',s:'SELL',sc:'25',t:'down'},
      {n:'NATURALGAS',p:'215',s:'STRONG BUY',sc:'88',t:'up'},
      {n:'COPPER',p:'720',s:'HOLD',sc:'50',t:'up'}
    ]
  },
  {
    id: 'scalp',
    name: '⚡ SCALP',
    cls: 'scalp',
    icon: '⚡',
    badge: 'LIVE',
    badgeCls: 'badge-live',
    desc: 'Quick 5-15 Min Trades',
    stocks: [
      {n:'NIFTY',p:'24520',s:'ENTRY',sc:'75',t:'up'},
      {n:'BANKNIFTY',p:'48236',s:'ENTRY',sc:'70',t:'up'},
      {n:'RELIANCE',p:'2985',s:'QUICK BUY',sc:'68',t:'up'},
      {n:'SBIN',p:'789',s:'QUICK SELL',sc:'30',t:'down'},
      {n:'HDFC BANK',p:'1623',s:'WAIT',sc:'50',t:'up'}
    ]
  },
  {
    id: 'index',
    name: '📊 INDEX SCAN',
    cls: 'index',
    icon: '📊',
    badge: 'LIVE',
    badgeCls: 'badge-live',
    desc: 'NSE/BSE Index Analysis',
    stocks: [
      {n:'SENSEX',p:'81230',s:'SCAN OK',sc:'85',t:'up'},
      {n:'NIFTY BANK',p:'48236',s:'BUY',sc:'80',t:'up'},
      {n:'NIFTY IT',p:'35000',s:'SELL',sc:'22',t:'down'},
      {n:'NIFTY AUTO',p:'22000',s:'BUY',sc:'72',t:'up'},
      {n:'NIFTY FMCG',p:'55000',s:'HOLD',sc:'52',t:'up'}
    ]
  },
  {
    id: 'allinone',
    name: '🎯 ALL-IN-ONE',
    cls: 'allinone',
    icon: '🎯',
    badge: 'PRO',
    badgeCls: 'badge-pro',
    desc: 'Combined Signal Master',
    stocks: [
      {n:'NATURAL GAS',p:'215',s:'STRONG BUY',sc:'98',t:'up'},
      {n:'ONGC',p:'234',s:'HOLD',sc:'52',t:'up'},
      {n:'RELIANCE',p:'2985',s:'BUY',sc:'85',t:'up'},
      {n:'TATASTEEL',p:'145',s:'SELL',sc:'28',t:'down'},
      {n:'JSWSTEEL',p:'850',s:'BUY',sc:'74',t:'up'}
    ]
  }
];

// ── YAHOO FINANCE SYMBOLS ──
const YF_SYMBOLS = {
  'NIFTY':'^NSEI','SENSEX':'^BSESN','GOLD':'GC=F','SILVER':'SI=F',
  'RELIANCE':'RELIANCE.NS','TCS':'TCS.NS','HDFCBANK':'HDFCBANK.NS',
  'SBIN':'SBIN.NS','TATAMOTORS':'TATAMOTORS.NS','INFY':'INFY.NS',
  'WIPRO':'WIPRO.NS','ITC':'ITC.NS','BAJFINANCE':'BAJFINANCE.NS',
  'HDFC BANK':'HDFCBANK.NS','ONGC':'ONGC.NS','BANKNIFTY':'^NSEBANK',
  'ICICIBANK':'ICICIBANK.NS','HCLTECH':'HCLTECH.NS','ADANIENT':'ADANIENT.NS'
};

// ── SECTORS DATA ──
const SECTORS = [
  {n:'REALTY',b:9,s:0},{n:'BANKING',b:8,s:1},{n:'IT',b:7,s:2},
  {n:'AUTO',b:6,s:1},{n:'FINANCE',b:5,s:1},{n:'CHEMICAL',b:6,s:2},
  {n:'POWER',b:4,s:4},{n:'INFRA',b:3,s:3},{n:'TELECOM',b:2,s:2},
  {n:'CEMENT',b:2,s:4},{n:'CONSUMER',b:3,s:5},{n:'FMCG',b:3,s:6},
  {n:'ENERGY',b:1,s:5},{n:'MEDIA',b:1,s:5},{n:'PSU BANK',b:2,s:6},
  {n:'PHARMA',b:2,s:7},{n:'OIL&GAS',b:2,s:7},{n:'METAL',b:1,s:8}
];

// ── SIGNAL DATA ──
const SIG_DATA = {
  'STOCK SECURE':[{n:'RELIANCE',p:'2985',s:'SAFE',sc:'90',t:'up',src:'METER'},{n:'HDFCBANK',p:'1623',s:'SAFE',sc:'88',t:'up',src:'METER'},{n:'TATAMOTORS',p:'874',s:'CAUTION',sc:'45',t:'down',src:'METER'}],
  'INDEX METER':[{n:'NIFTY 50',p:'24520',s:'ULTRA BUY',sc:'95',t:'up',src:'INDEX'},{n:'BANKNIFTY',p:'48236',s:'BUY',sc:'82',t:'up',src:'INDEX'},{n:'CRUDE OIL',p:'6450',s:'SELL',sc:'20',t:'down',src:'COMMO'}],
  'VOLUME METER':[{n:'HDFC BANK',p:'1440',s:'HIGH VOL',sc:'88',t:'up',src:'VOL'},{n:'SBIN',p:'789',s:'HIGH VOL',sc:'80',t:'up',src:'VOL'}],
  'TIMEFRAME METER':[{n:'BANK NIFTY',p:'5m/15m',s:'BULLISH',sc:'75',t:'up',src:'TIME'},{n:'NIFTY',p:'1h/1D',s:'BEARISH',sc:'30',t:'down',src:'TIME'}],
  'BRAHMASTRA':[{n:'TATA MOTORS',p:'945',s:'B-SIGNAL',sc:'65',t:'up',src:'SCAN'},{n:'BAJFINANCE',p:'7134',s:'B-SIGNAL',sc:'72',t:'up',src:'SCAN'}],
  'SUDARSHAN':[{n:'INFY',p:'1520',s:'S-SIGNAL',sc:'62',t:'up',src:'SCAN'},{n:'WIPRO',p:'456',s:'S-SIGNAL',sc:'48',t:'down',src:'SCAN'}],
  'TRISHUL':[{n:'GOLD',p:'72100',s:'BUY',sc:'70',t:'up',src:'SCAN'},{n:'SILVER',p:'88500',s:'BUY',sc:'65',t:'up',src:'SCAN'}],
  'ALL-IN-ONE':[{n:'NATURAL GAS',p:'215',s:'STRONG BUY',sc:'98',t:'up',src:'SCAN'},{n:'ONGC',p:'234',s:'HOLD',sc:'52',t:'up',src:'SCAN'}],
  'INDEX SCAN':[{n:'SENSEX',p:'81230',s:'SCAN OK',sc:'85',t:'up',src:'SCAN'},{n:'NIFTY BANK',p:'48236',s:'BUY',sc:'80',t:'up',src:'SCAN'}],
  'SCALE STRATEGY':[{n:'NIFTY SCALE',p:'24550',s:'ENTRY',sc:'75',t:'up',src:'SCALE'},{n:'BN SCALE',p:'48200',s:'ENTRY',sc:'70',t:'up',src:'SCALE'}]
};

// ── PNL DATA ──
const PNL = {
  '1D':{v:'+₹12,450',t:'14',a:'78%'},
  '1W':{v:'+₹48,200',t:'62',a:'74%'},
  '1M':{v:'+₹1,82,500',t:'248',a:'71%'}
};

// ── WATCHLIST ──
const WL_NAMES = ['RELIANCE','TCS','HDFC BANK','INFY','SBI','ITC','WIPRO','BAJFINANCE','ICICIBANK','HCLTECH'];
const WL_SCANS = ['Brahmastra','Trishul','Sudarshan','All-in-One','Index','Scalp','Mahakal','Bhairav'];
