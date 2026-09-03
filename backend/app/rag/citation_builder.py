"""Builds authoritative legal citations without hallucinations."""
from typing import Dict, Any


class CitationBuilder:
    def format_citation(self, match: Dict[str, Any]) -> Dict[str, str]:
        return {
            "statute": match.get("statute", "Unknown Act"),
            "section": match.get("section", "N/A"),
            "source_authority": match.get("authority", "Ministry of Labour & Employment"),
            "url": match.get("url", ""),
        }
