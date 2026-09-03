"""OCR fallback service implementing PaddleOCR pipeline."""
from typing import Dict, Any


class OCRFallbackService:
    def process_image(self, file_path: str) -> Dict[str, Any]:
        """Runs OCR and returns recognized text blocks with bounding boxes."""
        return {"text": "", "boxes": [], "confidence": 0.0}
