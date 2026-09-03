from fastapi import APIRouter
from app.api.v1.endpoints import health, establishments

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(establishments.router, prefix="/establishments")
