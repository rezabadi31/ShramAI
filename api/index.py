"""
Vercel Serverless Function Entry Point for ShramAI FastAPI Application.
Exposes the ASGI app instance for Vercel Python Runtime.
"""
import os
import sys
from pathlib import Path

# Set VERCEL environment flag if running under Vercel
os.environ.setdefault("VERCEL", "1")

# Ensure api directory (containing app/) is first in sys.path
api_dir = Path(__file__).resolve().parent
if str(api_dir) not in sys.path:
    sys.path.insert(0, str(api_dir))

# Also support backend directory if running locally
backend_dir = api_dir.parent / "backend"
if backend_dir.exists() and str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

try:
    from app.main import app
except Exception as e:
    # Diagnostic fallback app in case of fatal import error
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    app = FastAPI(title="ShramAI Diagnostic Fallback")

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    async def catch_all(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "ShramAI API startup initialization failed",
                "error": str(e),
                "sys_path": sys.path[:5],
            }
        )

