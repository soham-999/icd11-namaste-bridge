from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .config import settings
from .schemas import (
    MapRequest,
    MapResponse,
    HealthResponse,
    CapabilitiesResponse,
    ErrorResponse,
    ErrorDetail,
)
from .service import map_symptoms


app = FastAPI(
    title=settings.service_name,
    version=settings.service_version,
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    request_id = request.headers.get("x-request-id") or str(uuid4())
    payload = ErrorResponse(
        request_id=request_id,
        error=ErrorDetail(
            code="internal_error",
            message="Unexpected server error",
        ),
    )
    return JSONResponse(status_code=500, content=payload.model_dump())


@app.get(f"{settings.api_prefix}/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.service_name,
        version=settings.service_version,
    )


@app.get(f"{settings.api_prefix}/capabilities", response_model=CapabilitiesResponse)
def capabilities() -> CapabilitiesResponse:
    return CapabilitiesResponse(
        sources=["mock"],
        features=["traditional_mapping", "fusion_scoring"],
    )


@app.post(
    f"{settings.api_prefix}/map",
    response_model=MapResponse,
    responses={
        500: {"model": ErrorResponse},
    },
)
def map_conditions(payload: MapRequest) -> MapResponse:
    results = map_symptoms(payload.symptoms)
    return MapResponse(
        request_id=str(uuid4()),
        engine_version=settings.service_version,
        total=len(results),
        data=results,
    )
