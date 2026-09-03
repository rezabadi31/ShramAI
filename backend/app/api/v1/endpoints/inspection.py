from fastapi import APIRouter
from app.schemas.inspection import (
    InspectionSession,
    InspectionSessionSubmitRequest,
    InspectionSessionResponse,
)
from app.inspection.service import InspectionService

router = APIRouter()


@router.post("/start", response_model=InspectionSession)
def start_inspection_session(establishment_id: str, establishment_name: str, inspector_id: str = "INS-OFFICER-42"):
    """
    Creates and returns a new stateful inspection session with the standard
    10-item statutory checklist (Wage Registers, Attendance, Safety, Social Security).
    """
    return InspectionService.create_session(establishment_id, establishment_name, inspector_id)


@router.get("/{session_id}", response_model=InspectionSession)
def get_inspection_session(session_id: str):
    """Retrieves an active inspection session by ID."""
    session = InspectionService.get_session(session_id)
    if session is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
    return session


@router.post("/submit", response_model=InspectionSessionResponse)
def submit_inspection_session(req: InspectionSessionSubmitRequest):
    """
    Submits a completed inspection session. Generates a violation docket
    with per-section penalty proposals and returns a report reference.
    """
    return InspectionService.submit_session(req)
