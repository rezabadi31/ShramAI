"""Risk Agent: Invokes ML risk model and synthesizes explainable risk score."""
from typing import Dict, Any


class RiskAgent:
    def evaluate_risk(self, establishment_features: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "risk_score": 0.0,
            "risk_category": "LOW",
            "confidence": 0.9,
            "top_factors": [],
        }
