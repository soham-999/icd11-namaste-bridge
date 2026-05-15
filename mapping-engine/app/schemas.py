from typing import Any, List, Optional
from pydantic import BaseModel, Field


class MapRequest(BaseModel):
    symptoms: List[str] = Field(
        ..., min_length=1, examples=["fever", "headache"]
    )
    locale: str = "en"
    sources: Optional[List[str]] = None


class ICDMatch(BaseModel):
    icd_code: Optional[str] = None
    description: Optional[str] = None
    source: str = "unknown"
    confidence: float = 0.0


class TraditionalMatch(BaseModel):
    system: str = "ayurveda"
    description: Optional[str] = None
    confidence: float = 0.0


class FusionScore(BaseModel):
    score: float
    risk: str


class SymptomMapping(BaseModel):
    symptom: str
    icd: ICDMatch
    traditional: TraditionalMatch
    fusion: FusionScore
    match_reason: Optional[str] = None


class MapResponse(BaseModel):
    request_id: str
    engine_version: str
    total: int
    data: List[SymptomMapping]


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class CapabilitiesResponse(BaseModel):
    sources: List[str]
    features: List[str]


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class ErrorResponse(BaseModel):
    request_id: str
    error: ErrorDetail
