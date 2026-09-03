from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System Health"])
async def health_check():
    """
    ShramAI System Health Check Endpoint.
    Returns operational readiness status and architecture module statuses.
    """
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        services={
            "document_ai": "ready",
            "rule_engine": "ready",
            "cross_document_anomaly": "ready",
            "ml_risk_engine": "ready",
            "agent_orchestrator": "ready",
            "rag_retrieval": "ready",
        },
    )
