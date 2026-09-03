from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    establishments,
    auth,
    documents,
    extraction,
    classification,
    normalization,
    knowledge,
    rag,
    compliance,
    agents,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(establishments.router, prefix="/establishments")
api_router.include_router(documents.router, prefix="/documents")
api_router.include_router(extraction.router, prefix="/documents")
api_router.include_router(classification.router, prefix="/documents")
api_router.include_router(normalization.router, prefix="/documents")
api_router.include_router(knowledge.router, prefix="/knowledge")
api_router.include_router(rag.router, prefix="/rag")
api_router.include_router(compliance.router, prefix="/compliance")
api_router.include_router(agents.router, prefix="/agents")
