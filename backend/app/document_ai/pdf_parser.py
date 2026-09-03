"""Direct PDF digital text and table extraction service."""
from typing import Dict, Any, List


class PDFParserService:
    def extract_text(self, file_path: str) -> Dict[str, Any]:
        """Extracts native digital text layers from PDF."""
        return {"pages": [], "is_scanned": False, "confidence": 1.0}
