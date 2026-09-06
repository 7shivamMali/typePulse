# Enhanced Implementation Plan: Modern Typing Platform (FastAPI + React + Tailwind)

This updated plan incorporates all user preferences and cutting-edge features: **Developer Code Mode**, **AI/Smart Weakness Drills**, **Ghost Caret Replays**, **Custom Mechanical Switch Sound Synthesis**, and **Master/Sudden-Death Modes**.

---

## 1. System Architecture

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                          Frontend (Client)                             │
   │  • Vite + React 19 (TypeScript) + Tailwind CSS                         │
   │  • Precision Engine: performance.now() sub-millisecond timestamps      │
   │  • Smooth 3-line scrolling viewport & CSS transition-interpolated caret│
   │  • Web Audio API Synthesizer: Clicky (Blue), Linear (Red), Thock (Topre)│
   │  • Recharts Analytics: WPM, Raw WPM, Errors, Consistency & Replay     │
   │  • Ghost Replay Engine: Render personal-best caret alongside live test │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                              HTTP / REST API (JSON)
                                       │
   ┌───────────────────────────────────▼────────────────────────────────────┐
   │                          Backend (FastAPI)                             │
   │  • Python 3.12 + FastAPI (Async & OpenAPI)                             │
   │  • NLP / Weakness Analyzer: Bigram/Trigram mistake pattern extraction   │
   │  • Anti-Cheat Engine: Timestamp inter-key distribution validation      │
   │  • Code Snippet Engine: Syntax-aware Python, JS, and SQL snippets      │
   │  • SQLModel / SQLAlchemy ORM (SQLite dev -> PostgreSQL prod)           │
   │  • JWT Authentication & Argon2 password hashing                        │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
   ┌───────────────────────────────────▼────────────────────────────────────┐
   │                          Database Layer                                │
   │  • SQLite (local zero-config)                                          │
   │  • PostgreSQL (production: Supabase / Neon / Railway)                  │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
Typing website - gemini/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # Register, Login, Me (JWT)
│   │   │   ├── words.py         # Standard words, quotes, numbers, punctuation
│   │   │   ├── code_snippets.py # Developer code mode (Python, JS, SQL, Rust)
│   │   │   ├── tests.py         # Test ingestion, keystroke log & anti-cheat check
│   │   │   ├── drills.py        # Smart NLP weakness analyzer & drill generator
│   │   │   ├── ghost.py         # Fetch PB run keystroke timestamps for ghost racing
│   │   │   ├── leaderboard.py   # Global and per-mode rankings
│   │   │   └── stats.py         # User performance & letter error heatmaps
│   │   ├── core/
│   │   │   ├── config.py        # Settings & environment variables
│   │   │   ├── security.py      # JWT token generation & Argon2 hashing
│   │   │   └── anti_cheat.py    # Keystroke delta standard deviation & burst analysis
│   │   ├── db/
│   │   │   ├── session.py       # Engine & session dependency
│   │   │   └── models.py        # SQLModel: User, TestResult, GhostRun, CodeSnippet
│   │   ├── data/
│   │   │   ├── words_en.json    # Curated word banks (100, 1k, 5k)
│   │   │   └── code_bank.json   # Curated code snippets
│   │   └── main.py              # FastAPI app initialization & CORS setup
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── typing/
│   │   │   │   ├── TypingArea.tsx      # 3-line smooth scrolling viewport + caret
│   │   │   │   ├── WordDisplay.tsx     # Character-level styling & cursor position
│   │   │   │   ├── GhostCaret.tsx      # Visual ghost cursor representing PB run
│   │   │   │   ├── LiveStats.tsx       # Live WPM, timer, and accuracy
│   │   │   │   ├── ModeSelector.tsx    # Time, Words, Quotes, Code, Drills
│   │   │   │   └── CapsLockWarning.tsx # Warning badge if Caps Lock is ON
│   │   │   ├── results/
│   │   │   │   ├── ResultsModal.tsx    # Summary scorecard
│   │   │   │   └── WpmChart.tsx        # Recharts line graph of speed over time
│   │   │   │   └── ReplayViewer.tsx    # Playback visualization of the run
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── auth/
│   │   │   │   └── AuthModal.tsx       # Login / Sign up dialog
│   │   │   └── common/
│   │   │       ├── ThemeSwitch.tsx     # Themes: Dark Slate, Carbon, Cyberpunk, Sepia
│   │   │       └── SoundSwitch.tsx     # Switches: Off, Clicky, Linear, Thocky
│   │   ├── hooks/
│   │   │   ├── useTypingEngine.ts      # Core typing state machine
│   │   │   ├── useGhostReplay.ts       # Ghost playback synchronization
│   │   │   ├── useSoundEffects.ts      # Web Audio API mechanical sound synthesizer
│   │   │   └── useAuth.ts              # Authentication & user profile state
│   │   ├── services/
│   │   │   └── api.ts                  # Backend API client
│   │   ├── types/
│   │   │   └── typing.d.ts             # Keystroke, Result, Mode types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── PLAN.md
└── README.md
```

---

## 3. Detailed Implementation Roadmap

### Phase 1: Environment & Project Scaffolding
- [ ] Initialize Git repository in root.
- [ ] Set up `backend/`:
  - Python virtual environment (`.venv`).
  - Install dependencies: `fastapi`, `uvicorn[standard]`, `sqlmodel`, `pydantic-settings`, `pyjwt`, `pwdlib[argon2]`, `python-multipart`.
  - Configure FastAPI entrypoint with CORS middleware for `http://localhost:5173`.
- [ ] Set up `frontend/`:
  - Scaffold Vite React + TypeScript (`npm.cmd create vite@latest frontend -- --template react-ts`).
  - Install Tailwind CSS, `lucide-react`, `recharts`, `clsx`, `tailwind-merge`.
  - Configure path aliases and basic clean layout.

### Phase 2: Core Typing Engine & UX Precision
- [ ] **State Machine & Timing:**
  - Build `useTypingEngine`: manages active word index, current char index, mistakes, and history.
  - Sub-millisecond timing using `performance.now()` for Net WPM, Raw WPM, Accuracy, and Consistency.
  - Keyboard handling: backspace (single char or `Ctrl+Backspace` for whole word), spacebar advancement, quick reset (`Tab` + `Enter`).
  - Caps Lock detection with instant visual indicator.
- [ ] **Viewport & Caret Physics:**
  - Fixed 3-line viewport: when line 2 completes, line 1 smoothly scrolls up.
  - Smooth-interpolated CSS caret with blinking idle state and solid typing state.
- [ ] **Web Audio API Synthesizer:**
  - Synthesize 3 realistic switch profiles:
    - **Clicky (Blue switch):** Sharp high-frequency click + tactile bottom-out.
    - **Linear (Red switch):** Soft, low-frequency dampened thud.
    - **Thocky (Topre/Custom):** Deep acoustic thock with low-pass filtering.
- [ ] **Ghost Caret Replay:**
  - Track array of `{ charIndex, timeMs }`.
  - Play back personal best run as a translucent ghost cursor racing alongside the user.
- [ ] **Results Screen & Graph:**
  - Detailed stats: WPM, Raw WPM, Accuracy %, Consistency %, Character breakdown (correct, incorrect, extra, missed).
  - Second-by-second WPM and error progression chart via `recharts`.

### Phase 3: Developer Code Mode & Specialized Modes
- [ ] **Developer Code Mode:**
  - Backend code bank: curated snippets in Python, JavaScript, and SQL.
  - Frontend indentation and symbol handling: preserve tabs/spaces, handle brackets `{ } [ ] ( )`, operators, and semicolons cleanly.
- [ ] **Master / Sudden-Death Mode:**
  - Toggle for strict mode: fail test immediately on first mistake or require 100% backspace correction before moving forward.
- [ ] **Smart Weakness Drills (Python NLP):**
  - Python analyzer detects highest error bigrams (e.g. `th`, `ou`, `pr`, `ion`).
  - Generates custom drill sentences packed with those specific letter combinations.

### Phase 4: Backend Database, Auth & Anti-Cheat (FastAPI + SQLModel)
- [ ] **Database & Schemas:**
  - SQLModel models: `User`, `TestResult`, `GhostRun`, `CodeSnippet`.
  - Initialize SQLite database (`typing.db`).
- [ ] **API Endpoints:**
  - `GET /api/words`: Standard words with filters (time, count, punctuation, numbers).
  - `GET /api/code`: Random code snippet filtered by language.
  - `POST /api/tests`: Ingest test result with compressed keystroke delta payload.
  - `GET /api/drills/custom`: Generate practice text tailored to user's mistake history.
  - `GET /api/ghost/pb`: Retrieve keystroke timeline for user's personal best.
  - `GET /api/leaderboard`: Global rankings by mode.
- [ ] **Anti-Cheat Verification:**
  - Analyze keystroke timing variance and impossible input patterns (< 25ms sustained inter-key intervals).

### Phase 5: Authentication & User Profiles
- [ ] JWT authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- [ ] Guest fallback: Complete functionality offline via `localStorage`; seamless cloud sync when user registers.
- [ ] User Profile Dashboard:
  - Personal stats, test count, all-time bests across modes.
  - Letter error heatmap (visual keyboard showing keys with highest error rates).

### Phase 6: Themes, Polish & Deployment
- [ ] Theme Engine:
  - Dark Slate (default), Monkeytype Carbon/Yellow, Cyberpunk Neon, Retro Sepia.
- [ ] Production Build & Dockerization:
  - Multi-stage `frontend/Dockerfile` (Vite build -> Nginx).
  - Production `backend/Dockerfile` (Uvicorn).
  - `docker-compose.yml` for instant local or VPS deployment.
- [ ] Deployment guide & config for Vercel (frontend) + Render/Railway/Fly.io (backend).

---

## 4. Key Conventions
- **Development Database**: SQLite (`typing.db`) for zero setup. Transition to PostgreSQL simply by changing `DATABASE_URL`.
- **Sound Effects**: Synthesized audio via Web Audio API (no external MP3/WAV assets to load).
- **Styling**: Tailwind CSS with CSS variables for dynamic theming.
