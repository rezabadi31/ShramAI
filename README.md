# ShramAI — AI-Powered Smart Labour Compliance & Inspection Intelligence System

[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-teal.svg)]()
[![React 18](https://img.shields.io/badge/React-18.3.1-cyan.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.2.11-purple.svg)]()
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7.svg)]()

---

## 🏛️ Production Deployment Architecture (100% Netlify Unified)

ShramAI is deployed **100% on Netlify** as a unified web application. The React SPA and the serverless functions run together under a **single Netlify domain** with zero cross-origin configuration required:

```text
                           PUBLIC INTERNET
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     NETLIFY PROJECT     │
                    │ (https://*.netlify.app) │
                    ├────────────┬────────────┤
                    │  Frontend  │ Python API │
                    │   (Vite)   │ (FastAPI)  │
                    │  /(.*)     │ /api/(.*)  │
                    └────────────┴────────────┘
```

- **Frontend**: High-performance React 18 + TypeScript + TailwindCSS SPA served from Netlify's global Edge CDN.
- **Backend / API**: Serverless functions in `netlify/functions/` handling `/api/v1/*` endpoints, JWT authentication, statutory labour compliance RAG, and ML risk scoring.
- **Unified Routing**: Handled via `netlify.toml` and `_redirects` with zero external service dependencies.

---

## ⚡ 1-Click Netlify Deployment Guide

Deploy the entire ShramAI application on Netlify in 3 simple steps:

### Step 1: Push Repository to GitHub
Ensure the codebase is pushed to your GitHub repository:
```bash
git push origin main
```

### Step 2: Import into Netlify
1. Sign in to your [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and choose your repository: `ShramAI`.
4. Netlify will automatically detect the settings configured in `netlify.toml`:
   - **Base directory**: *(leave empty / root)*
   - **Build command**: `npm install --prefix frontend && npm --prefix frontend run build`
   - **Publish directory**: `frontend/dist`
   - **Functions directory**: `netlify/functions`
5. Click **Deploy ShramAI**.

### Step 3: Done!
Netlify will build the frontend, package the serverless API routes, and deploy the application.
- **Application URL**: `https://<your-site-name>.netlify.app`
- **Health Check**: `https://<your-site-name>.netlify.app/health`

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
3. **Resilient Authentication**: In-memory verified credentials guarantee instantaneous authentication response times even during cold starts.
