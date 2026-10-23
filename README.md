# 🎓 CampusLend

> **Peer-to-Peer Campus Lending Network (Full-Stack Monorepo)**  
> Connect students on campus to share, borrow, and lend calculators, textbooks, lab equipment, and tools with built-in Trust & Safety verification and concurrency-safe reservations.

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🏛️ Monorepo Architecture

```
Campuslend/
├── package.json              # Monorepo root with concurrently scripts
├── .gitignore                # Unified ignore for dependencies, envs & build artifacts
├── README.md                 # Project overview and documentation
├── campuslend-front/         # React 19 + TypeScript + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/              # API contract client services (items, fetchers)
│   │   ├── components/       # ItemCard, SearchBar, CategoryFilter, Dashboards
│   │   ├── hooks/            # useDebounce (300ms item search), useScrollAnimation
│   │   └── types/            # Frontend interfaces & Item contracts
│   └── package.json
└── campuslend-backend/       # Node.js + Express + Mongoose + TypeScript backend
    ├── src/
    │   ├── config/           # Database connection & typed environment config
    │   ├── middleware/       # JWT authentication, RBAC, error handler & rate limiting
    │   ├── models/           # Strict schemas: User, Item, Transaction, Message
    │   └── routes/           # REST endpoints: /auth, /items, /transactions, /messages
    └── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js** v18+ and **npm**
* **MongoDB** running locally (`mongodb://localhost:27017`) or a remote MongoDB Atlas URI

### 2. Environment Setup
Configure the backend `.env`:
```bash
cp campuslend-backend/.env.example campuslend-backend/.env
```

### 3. Install All Dependencies
Install monorepo root, backend, and frontend dependencies in one command:
```bash
npm run install:all
```

### 4. Run Concurrently in Development Mode
Start both the Express API and Vite React frontend concurrently:
```bash
npm run dev
```

* 🌐 **Frontend**: [http://localhost:5173](http://localhost:5173)
* ⚡ **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
* ❤️ **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛡️ Senior Engineering Pillars

### 1. Trust & Safety (`is_verified` UI)
* **Automatic Domain Verification**: Email domains associated with accredited universities (`.edu`, `.ac.`, `hhu.de`, etc.) are automatically marked `is_verified: true`.
* **Visual Trust Indicators**: Verified items display an emerald `ShieldCheck` badge in the UI, enabling students to borrow with confidence.
* **Manual Verification Hooks**: Support for admin/student ID review pipelines.

### 2. Double-Booking Prevention (Atomic Reservation)
* **Atomic Compare-And-Swap (CAS)**: State transitions from `available` to `reserved` occur atomically via `findOneAndUpdate({ _id: itemId, status: 'available' }, ...)` at the database engine level.
* **Database-Enforced Partial Unique Index**: The `Transaction` schema enforces a compound index `{ item: 1 }` with `{ unique: true, partialFilterExpression: { status: { $in: ['pending', 'approved', 'active'] } } }`, physically preventing concurrent duplicate bookings.
* **Dual-Topology Resilience**: Full support for MongoDB multi-document transactions when running on replica sets/shards, with automated atomic CAS + compensation rollback on standalone instances.

### 3. JWT Security & Defense-in-Depth
* **Timing-Attack Neutralization**: Login handler runs dummy bcrypt comparisons on nonexistent accounts to prevent response-latency email enumeration.
* **Algorithm Pinning**: Strict enforcement of `HS256` in token signing and verification to protect against algorithm confusion exploits.
* **Brute-Force Rate Limiting**: Dedicated rate limiting on `/api/auth/login` and `/api/auth/register`.
* **Zero Secret Leakage**: Password fields are omitted by default (`select: false`), with typed `toPublicJSON()` sanitization.

### 4. 300ms Debounced Item Search
* Custom generic `useDebounce` hook buffers user input on the client to optimize performance and responsiveness across both catalog browsing and borrower/lender dashboards.

---

## 📦 Monorepo Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run frontend & backend concurrently with live reload |
| `npm run build` | Compile backend TypeScript (`tsc`) and bundle frontend (`vite build`) |
| `npm run build:backend` | Compile backend TypeScript to `dist/` |
| `npm run build:frontend` | Build frontend production bundle to `campuslend-front/dist/` |
| `npm run install:all` | Install root, backend, and frontend dependencies |
| `npm start` | Start the production backend server |

---

## 📄 License
ISC License. Built for the Heinrich Heine University & Campus community.
