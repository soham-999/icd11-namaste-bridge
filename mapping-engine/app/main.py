from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

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
    description=(
        "Standalone service that maps symptoms to ICD-11 TM and "
        "traditional medicine labels with explainable scoring."
    ),
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["x-request-id"] = request_id
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid4()))
    payload = ErrorResponse(
        request_id=request_id,
        error=ErrorDetail(
            code="internal_error",
            message="Unexpected server error",
        ),
    )
    return JSONResponse(status_code=500, content=payload.model_dump())


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid4()))
    payload = ErrorResponse(
        request_id=request_id,
        error=ErrorDetail(
            code="validation_error",
            message="Request validation failed",
            details=exc.errors(),
        ),
    )
    return JSONResponse(status_code=422, content=payload.model_dump())


@app.get(
    f"{settings.api_prefix}/health",
    response_model=HealthResponse,
    tags=["system"],
    summary="Health check",
)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.service_name,
        version=settings.service_version,
    )


@app.get(
    f"{settings.api_prefix}/capabilities",
    response_model=CapabilitiesResponse,
    tags=["system"],
    summary="Supported sources and features",
)
def capabilities() -> CapabilitiesResponse:
    return CapabilitiesResponse(
        sources=settings.supported_sources,
        features=settings.supported_features,
    )


@app.post(
    f"{settings.api_prefix}/map",
    response_model=MapResponse,
    responses={
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    tags=["mapping"],
    summary="Map symptoms to ICD and traditional labels",
)
def map_conditions(request: Request, payload: MapRequest) -> MapResponse:
    results = map_symptoms(payload.symptoms)
    return MapResponse(
        request_id=request.state.request_id,
        engine_version=settings.service_version,
        total=len(results),
        data=results,
    )
