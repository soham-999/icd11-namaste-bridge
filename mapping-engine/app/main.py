from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from .config import settings
from .clients.who_icd import who_available
from .repositories.local_mapping_repo import LocalMappingRepository
from .schemas import (
    MapRequest,
    MapResponse,
    HealthResponse,
    CapabilitiesResponse,
    ErrorResponse,
    ErrorDetail,
    AdminUpsertRequest,
    AdminUpsertResponse,
    AdminListResponse,
    AdminDeleteResponse,
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

_local_repo = LocalMappingRepository()


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
    sources = list(settings.supported_sources)
    if settings.local_enabled and "local" not in sources:
        sources.append("local")
    if who_available() and "who-icd11" not in sources:
        sources.append("who-icd11")
    return CapabilitiesResponse(
        sources=sources,
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
def map_conditions(request: Request, payload: MapRequest):
    try:
        results = map_symptoms(payload.symptoms, payload.sources)
    except ValueError as exc:
        payload = ErrorResponse(
            request_id=request.state.request_id,
            error=ErrorDetail(
                code="validation_error",
                message=str(exc),
            ),
        )
        return JSONResponse(status_code=422, content=payload.model_dump())
    return MapResponse(
        request_id=request.state.request_id,
        engine_version=settings.service_version,
        total=len(results),
        data=results,
    )


@app.get(
    f"{settings.api_prefix}/admin/mappings",
    response_model=AdminListResponse,
    responses={
        503: {"model": ErrorResponse},
    },
    tags=["admin"],
    summary="List local mappings",
)
def list_mappings(request: Request, limit: int = 50, offset: int = 0):
    if not settings.local_enabled or not settings.admin_enabled:
        payload = ErrorResponse(
            request_id=request.state.request_id,
            error=ErrorDetail(
                code="admin_disabled",
                message="Admin API is disabled",
            ),
        )
        return JSONResponse(status_code=503, content=payload.model_dump())
    items = _local_repo.list(limit=limit, offset=offset)
    return AdminListResponse(
        request_id=request.state.request_id,
        total=len(items),
        items=items,
    )


@app.post(
    f"{settings.api_prefix}/admin/mappings",
    response_model=AdminUpsertResponse,
    responses={
        503: {"model": ErrorResponse},
    },
    tags=["admin"],
    summary="Upsert a local mapping",
)
def upsert_mapping(request: Request, payload: AdminUpsertRequest):
    if not settings.local_enabled or not settings.admin_enabled:
        payload = ErrorResponse(
            request_id=request.state.request_id,
            error=ErrorDetail(
                code="admin_disabled",
                message="Admin API is disabled",
            ),
        )
        return JSONResponse(status_code=503, content=payload.model_dump())
    item = _local_repo.upsert(
        symptom=payload.symptom,
        icd_code=payload.icd_code,
        description=payload.description,
    )
    return AdminUpsertResponse(
        request_id=request.state.request_id,
        item=item,
    )


@app.delete(
    f"{settings.api_prefix}/admin/mappings/{symptom}",
    responses={
        200: {"model": AdminDeleteResponse},
        503: {"model": ErrorResponse},
    },
    tags=["admin"],
    summary="Delete a local mapping",
)
def delete_mapping(request: Request, symptom: str):
    if not settings.local_enabled or not settings.admin_enabled:
        payload = ErrorResponse(
            request_id=request.state.request_id,
            error=ErrorDetail(
                code="admin_disabled",
                message="Admin API is disabled",
            ),
        )
        return JSONResponse(status_code=503, content=payload.model_dump())
    deleted = _local_repo.delete(symptom=symptom)
    if not deleted:
        payload = ErrorResponse(
            request_id=request.state.request_id,
            error=ErrorDetail(
                code="not_found",
                message="Mapping not found",
            ),
        )
        return JSONResponse(status_code=404, content=payload.model_dump())
    payload = AdminDeleteResponse(
        request_id=request.state.request_id,
        deleted=True,
        message="Mapping deleted",
    )
    return JSONResponse(status_code=200, content=payload.model_dump())
