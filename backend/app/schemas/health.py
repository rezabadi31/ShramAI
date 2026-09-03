from pydantic import BaseModel, Field
from typing import Dict, Any


class HealthResponse(BaseModel):
    status: str = Field(..., examples=["healthy"])
    project: str = Field(..., examples=["ShramAI"])
    version: str = Field(..., examples=["0.1.0"])
    environment: str = Field(..., examples=["development"])
    services: Dict[str, Any] = Field(default_factory=dict)
