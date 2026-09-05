# ShramAI — AI-Powered Smart Labour Compliance & Inspection Intelligence System

[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-teal.svg)]()
[![React 18](https://img.shields.io/badge/React-18.3.1-cyan.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.2.11-purple.svg)]()
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)]()

---

## 🏛️ Production Deployment Architecture (100% Vercel Unified)

ShramAI is deployed **100% on Vercel** as a unified full-stack web application. The React single-page application and the FastAPI serverless backend are hosted under a **single Vercel project and domain** with zero cross-origin configuration required:

```text
                           PUBLIC INTERNET
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      VERCEL PROJECT     │
                    │ (https://*.vercel.app)  │
                    ├────────────┬────────────┤
                    │  Frontend  │ Python API │
                    │   (Vite)   │ (FastAPI)  │
                    │  /(.*)     │ /api/(.*)  │
                    └────────────┴────────────┘
```

- **Frontend**: High-performance React 18 + TypeScript + TailwindCSS SPA served directly from Vercel's global CDN Edge Network.
- **Backend**: Python 3.11 serverless functions handling `/api/v1/*` endpoints, JWT authentication, statutory labour compliance knowledge RAG, and ML risk scoring.
- **Unified Routing**: Configured via `vercel.json` with zero external service dependencies.

---

## ⚡ 1-Click Vercel Deployment Guide

Deploy the entire ShramAI application on Vercel in 3 simple steps:

### Step 1: Push Repository to GitHub
Ensure the codebase is pushed to your GitHub repository:
```bash
git push origin main
```

### Step 2: Import into Vercel
1. Sign in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Select your repository: `ShramAI`.
4. Configure the project:
   - **Framework Preset**: `Other` (or leave default Vite)
   - **Root Directory**: `./` (Repository root — leave default)
   - **Build Command**: `npm install --prefix frontend && npm --prefix frontend run build`
   - **Output Directory**: `frontend/dist`
5. *(Optional)* Add Environment Variables:
   | Variable | Recommended Value | Description |
   | :--- | :--- | :--- |
   | `ENVIRONMENT` | `production` | Production mode flag |
   | `SECRET_KEY` | *(Any 32+ char string)* | JWT signature key |

### Step 3: Click Deploy
Vercel will build the frontend, package the serverless API routes, and deploy the application.
- **Frontend App**: `https://<your-project>.vercel.app`
- **Health Check**: `https://<your-project>.vercel.app/health`
- **Interactive API Docs**: `https://<your-project>.vercel.app/docs`

---

## 🔑 Pre-Configured Demo Credentials

The application provides out-of-the-box verified demo personas:

| Persona | Portal | Email | Password |
| :--- | :--- | :--- | :--- |
| **Labour Inspector** | Labour Inspectorate | `inspector@shram.gov.in` | `Inspector@123` |
| **Employer** | Employer Portal | `employer@abcindustries.com` | `Employer@123` |
| **Administrator** | Central Enforcement | `admin@shram.gov.in` | `Admin@123` |

---

## 💻 Local Development

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Run the full pytest test suite:
```bash
pytest tests/ -v
```

Run frontend type check & build validation:
```bash
npm --prefix frontend run build
```

---

## 🛡️ Security & Architecture Best Practices

1. **Zero External Backend Leakage**: All authentication and compliance intelligence requests route securely through same-origin relative URLs (`/api/v1/*`).
2. **Serverless Ephemeral Storage**: SQLite database falls back to `/tmp/shram.db` in serverless environments to ensure read-only Lambda execution environments never crash.
3. **CORS Hardening**: Dynamically binds allowed origins for local development and all `*.vercel.app` production domains.
4. **Resilient Authentication**: In-memory verified credentials guarantee instantaneous authentication response times even during cold starts.
