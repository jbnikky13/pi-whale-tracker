# 🐋 Pi Whale Tracker

A real-time whale transaction tracker for the Pi Network blockchain. Monitor large Pi transactions, track wallet activity, and stay informed about significant movements in the Pi ecosystem.

![Pi Whale Tracker](https://img.shields.io/badge/Pi%20Network-Whale%20Tracker-purple)
![Status](https://img.shields.io/badge/Status-Live-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## 🌐 Live App
[https://client-psi-sable.vercel.app](https://client-psi-sable.vercel.app)

## ✨ Features

- 🔴 **Real-time tracking** — Live whale transactions updated every 30 seconds
- 🐋 **Whale classification** — Mega whale (10,000+ π), Whale (3,000+ π), Big Fish (500+ π)
- 🔍 **Wallet lookup** — Search any Pi wallet address for full transaction history
- 📊 **Live stats** — Total Pi moved, whale count, last updated time
- 💳 **Transaction detail** — Tap any transaction to see full details and TX hash
- ⚡ **Pi payments** — Support the app with 1π via Pi Browser
- 📱 **Mobile first** — Optimized for Pi Browser on mobile

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express |
| Blockchain Data | Pi Network Horizon API |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Pi Integration | Pi SDK v2.0 |

## 📁 Project Structure
pi-whale-tracker/
├── client/                 # React frontend
│   ├── public/
│   │   ├── index.html      # Pi SDK loaded here
│   │   ├── privacy.html    # Privacy policy
│   │   └── terms.html      # Terms of service
│   └── src/
│       └── App.js          # Main app component
│
└── server/                 # Node.js backend
├── index.js            # Express server + API routes
├── .env                # Environment variables (not committed)
└── railway.toml        # Railway deployment config
## 🚀 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/whales` | Get recent large transactions |
| GET | `/api/wallet/:address` | Get wallet transaction history |
| POST | `/api/payments/approve` | Approve Pi payment |
| POST | `/api/payments/complete` | Complete Pi payment |

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
PI_API_KEY=your_pi_api_key_here
PORT=5000
```

## 🏃 Running Locally

**Backend:**
```bash
cd server
npm install
node index.js
```

**Frontend:**
```bash
cd client
npm install
npm start
```

## 📱 Pi Browser Integration

This app is built for the Pi Browser and uses:
- Pi SDK v2.0 for authentication
- Pi payment processing (User-to-App)
- Pi Network Mainnet blockchain data

## 🐋 Whale Thresholds

| Emoji | Type | Amount |
|---|---|---|
| 🐋 | Mega Whale | 10,000+ π |
| 🐬 | Whale | 3,000 - 9,999 π |
| 🐟 | Big Fish | 500 - 2,999 π |

## 📄 License

MIT License - feel free to use and modify

## 👨‍💻 Developer

Built with ❤️ for the Pi Network community

---

*Data sourced from Pi Network public blockchain. Not affiliated with Pi Network Core Team.*
