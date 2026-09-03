"""Document classification based on keywords and rule heuristics."""
from typing import Dict, Any


class DocumentClassifierService:
    DOCUMENT_TYPES = [
        "Wage Register",
        "Attendance Register",
        "Employee Register",
        "Payroll",
        "Safety Record",
        "Employment Contract",
        "Return",
        "Unknown",
    ]

    def classify_document(self, text_sample: str) -> Dict[str, Any]:
        return {"document_type": "Unknown", "confidence": 0.5}
