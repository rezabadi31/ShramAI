"""Document upload validation and storage service."""
import os
from typing import Dict, Any


class UploadService:
    ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}

    @classmethod
    def validate_file(cls, filename: str, file_size: int) -> bool:
        ext = os.path.splitext(filename)[1].lower()
        return ext in cls.ALLOWED_EXTENSIONS and file_size <= 50 * 1024 * 1024
