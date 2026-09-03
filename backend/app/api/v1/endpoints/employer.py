from fastapi import APIRouter
from typing import List
from app.schemas.employer import EmployerComplianceProfile, PenaltyExposureItem
from app.employer.service import EmployerService

router = APIRouter()


@router.get("/{establishment_id}/profile", response_model=EmployerComplianceProfile)
def get_employer_compliance_profile(establishment_id: str):
    """
    Returns the unified employer compliance profile for an establishment.
    Aggregates ML risk prediction, register statuses, corrective actions
    and penalty exposure into a single employer-facing dashboard response.
    """
    return EmployerService.get_compliance_profile(establishment_id)


@router.get("/{establishment_id}/penalty-exposure", response_model=List[PenaltyExposureItem])
def get_employer_penalty_exposure(establishment_id: str):
    """
    Returns the statutory penalty exposure breakdown for an establishment.
    Each item includes the applicable code section, violation description,
    and maximum applicable fine in INR.
    """
    profile = EmployerService.get_compliance_profile(establishment_id)
    return profile.penalty_exposures
