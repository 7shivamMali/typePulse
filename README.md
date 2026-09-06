# ⚡ TypePulse — Minimalist Speed Typing Platform

A modern, high-performance, developer-focused typing speed application built with **FastAPI (Python 3.12)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Inspired by Monkeytype with unique superpowers: **Developer Code Mode**, **AI-Powered Weakness Drills**, **Synthesized Mechanical Switch Audio**, and **Anti-Cheat Validation**.

---

## ✨ Features

- **⚡ Zero-Latency Typing Engine:** Sub-millisecond keystroke capture using `performance.now()`, smooth 3-line sliding viewport, and interpolated CSS caret.
- **🔊 Web Audio API Mechanical Sound Engine:** Synthesizes realistic switch profiles without external audio files:
  - *Clicky* (Cherry MX Blue)
  - *Linear* (Cherry MX Red)
  - *Thocky* (Topre / Holy Panda)
  - *Silent / Off*
- **💻 Developer Code Mode:** Practice typing realistic syntax-aware code snippets in **Python**, **JavaScript**, and **SQL**.
- **🎯 Smart Weakness Drills:** Analyzes your most frequently missed keys and bigrams (e.g. `th`, `ou`, `pr`) and dynamically generates targeted training texts.
- **🎨 5 Curated Visual Themes:**
  - *Carbon / Slate* (Default minimal dark)
  - *Monkeytype Classic* (Matte charcoal & yellow)
  - *Cyberpunk Neon* (Midnight purple & cyan)
  - *Nord Glacier* (Frosty Arctic slate)
  - *Sepia* (Warm parchment)
- **📈 Deep Analytics & Visualizations:** Second-by-second WPM and error progression chart powered by Recharts, raw WPM, accuracy, consistency %, and confetti PB celebrations.
- **🛡️ Python Anti-Cheat Engine:** Validates keystroke interval distributions and flags automated bot patterns or clipboard pasting.
- **🏆 Global Leaderboards & Cloud Sync:** Compete on mode-specific leaderboards with JWT-authenticated profiles (or play 100% offline as a guest).

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2 |
| **ORM & Database** | SQLModel (SQLAlchemy) with SQLite (local) / PostgreSQL (production) |
| **Auth & Security** | JWT (PyJWT), Argon2 password hashing (pwdlib) |
| **Audio** | Native Web Audio API (OscillatorNode, BiquadFilterNode) |
| **Containers** | Multi-stage Docker & Docker Compose |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.12+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# In project root
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive Swagger documentation will be available at: **http://127.0.0.1:8000/docs**

### 3. Frontend Setup
```bash
# In a separate terminal
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open **http://localhost:5173** in your browser to start typing!

---

## 🐳 Docker Deployment (One Command)

To build and run the entire full-stack application inside Docker:

```bash
docker compose up --build
```
- Web Application: **http://localhost**
- API & Docs: **http://localhost:8000/docs**

---

## ☁️ Production Cloud Deployment

### Frontend (Vercel / Cloudflare Pages)
1. Set the root directory to `frontend`.
2. Framework Preset: `Vite`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add an environment variable `VITE_API_URL` pointing to your deployed backend URL.

### Backend (Render / Railway / Fly.io)
1. Deploy from the `backend/` directory using the provided `backend/Dockerfile`.
2. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Supabase, Neon, or Railway).
   - `SECRET_KEY`: A secure random secret string for JWT tokens.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Tab` or `Tab + Enter` | Instantly restart test with a new word bank |
| `Ctrl + Backspace` | Delete entire current word input |
| `Caps Lock` | Automatic onscreen warning badge |

---

## 📄 License
MIT License. Created with ❤️ for developers and speed typists.
