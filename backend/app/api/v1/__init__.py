from fastapi import APIRouter
from app.api.v1.endpoints import health, establishments, auth, documents

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(establishments.router, prefix="/establishments")
api_router.include_router(documents.router, prefix="/documents")
