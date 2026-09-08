# 🔱 TRISHUL PRO v2.0

**Advanced Indian Stock Market Intelligence & Algorithmic Trading Platform**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Clone repository
git clone https://github.com/charanaruna05/Trishul-pro.git
cd Trishul-pro

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your broker credentials

# Start development
npm run dev
```

### With Docker

```bash
docker-compose up --build
```

## 📂 Project Structure

```
Trishul-pro/
├── server/                 # Express backend
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Auth, validation
│   └── index.js           # Server entry
├── src/                   # React frontend
│   ├── pages/            # Page components
│   ├── components/       # Reusable UI
│   ├── App.jsx
│   └── index.css
├── public/               # Static assets
├── api/                  # Vercel functions
├── config/               # Configuration files
└── package.json
```

## 🔑 Features

✅ Multi-broker support (Angel One, Shoonya, Zerodha)  
✅ Real-time market data & WebSocket streaming  
✅ 9-grid scanner & sector heatmap  
✅ JWT authentication + TOTP 2FA  
✅ Order management & portfolio tracking  
✅ Admin dashboard with analytics  
✅ Responsive mobile UI (430px)  
✅ Production-ready deployment  

## 🛠️ API Documentation

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
POST /api/auth/verify
```

### Market Data
```bash
GET /api/market/indices
GET /api/market/sectors
GET /api/market/stock/:symbol
```

### Trading
```bash
POST /api/trade/order/place
POST /api/trade/order/cancel
GET  /api/broker/holdings
GET  /api/broker/positions
```

## 🔐 Security

- ✅ Environment variables for credentials
- ✅ JWT token authentication
- ✅ Rate limiting on API
- ✅ Helmet.js for security headers
- ✅ CORS properly configured
- ✅ Password hashing with bcryptjs

## 📊 Live Link

[https://trishul-pro-three.vercel.app](https://trishul-pro-three.vercel.app)

## 📝 License

MAA AADISHAKTI © 2026

---

**Developed by Arun** 🚀
