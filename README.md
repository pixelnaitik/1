# 🛡️ SecureVoyage — Tourist Safety Companion

<div align="center">

![Hackathon Prototype](https://img.shields.io/badge/SIH_2026-Prototype-orange?style=for-the-badge&logo=shield)
![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_Node.js_%7C_Google_Gemini-blue?style=for-the-badge&logo=react)
![PWA Ready](https://img.shields.io/badge/PWA-Standalone-green?style=for-the-badge&logo=pwa)

**AI-Powered Smart Tourist Safety Monitoring & Emergency Incident Response System**

[Detailed Plan & Specs](docs/DETAILED_README.md) • [Architecture](docs/ARCHITECTURE.md) • [API Schema](docs/API_SCHEMA.md)

</div>

---

## 🚀 How to Start & Run on PC

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher

---

### Step-by-Step PC Quickstart

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/pixelnaitik/1.git
cd 1
```

#### 2️⃣ Install Dependencies
```bash
npm install
```

#### 3️⃣ Start the REST API Backend Server
Open terminal and run:
```bash
node apps/api/src/server.js
```
*Backend API will run on `http://localhost:4000`*

#### 4️⃣ Start the Web PWA Frontend
Open a second terminal window and run:
```bash
npm run dev --workspace=@securevoyage/web
```
*Web application will launch on `http://localhost:3000`*

---

### 🌐 Local App Navigation
- 🏠 **Safety Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- 🏥 **Emergency Services Directory**: [http://localhost:3000/services](http://localhost:3000/services)
- 🤖 **Multilingual AI Chat (Google Gemini)**: [http://localhost:3000/chat](http://localhost:3000/chat)
- 🛣️ **Safe Route Planner**: [http://localhost:3000/routes](http://localhost:3000/routes)
- 🚨 **SOS & Live Tracking**: [http://localhost:3000/sos](http://localhost:3000/sos)
- 🔒 **Contacts & Privacy**: [http://localhost:3000/contacts](http://localhost:3000/contacts)

---

## 🎯 What SecureVoyage Does

1. **Safety Map & Hotspots:** Interactive map displaying real-time advisory risk scores & safety hotspots in Bhubaneswar.
2. **Explainable Risk Engine:** Transparent safety score (0–100) based on incidents, time, weather, and crowd data.
3. **Smart Safe Routes:** Compare fastest vs. safety-weighted alternative routes (Janpath Smart Corridor vs. Cuttack-Puri Bypass).
4. **Emergency Services Locator:** Instant access to nearby verified police, hospital, and ambulance services with Google Maps navigation and direct phone dialer.
5. **One-Touch SOS & Live Sharing:** Emergency SOS broadcast with time-boxed location sharing to trusted contacts.
6. **Multilingual AI Assistant:** Grounded AI guide supporting English, Hindi, and Odia powered by **Google Gemini AI Flash**.

---

## 🗺️ 30-Day Execution Roadmap & Phase Matrix

| Phase | Milestone | Core Focus | Status |
|---|---|---|:---:|
| **Phase 1 — Foundation** | App Shell & Maps | Auth, user consent, Google Maps JS SDK, PWA shell | 🟢 Complete |
| **Phase 2 — Intelligence** | Risk Engine & Factors | Hotspot analysis, explainable risk score (84/100) | 🟢 Complete |
| **Phase 3 — Response** | Routes, SOS & Services | Safe route comparison, emergency locator, live SOS drill | 🟢 Complete |
| **Phase 4 — Launch & AI** | Multilingual AI & Polish | Google Gemini AI Flash, Odia/Hindi translation, PWA install prompt | 🟢 Complete |

---

## 📄 License
Licensed under MIT. Built for SIH 2026.
