import secrets
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .db import get_connection, init_db
from .clients.who_icd import who_available
from .repositories.local_mapping_repo import LocalMappingRepository
from .schemas import (
    MapRequest,
    MapResponse,
    HealthResponse,
    CapabilitiesResponse,
    ContractEndpoint,
    ContractResponse,
    ReadinessCheck,
    ReadinessResponse,
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "x-request-id", "x-admin-token"],
    expose_headers=["x-request-id"],
)

_local_repo = LocalMappingRepository()


def _validation_error_details(exc: RequestValidationError):
    details = []
    for error in exc.errors():
        safe_error = dict(error)
        if "ctx" in safe_error:
            safe_error["ctx"] = {
                key: str(value)
                for key, value in safe_error["ctx"].items()
            }
        details.append(safe_error)
    return details


def _contract_endpoints():
    return [
        ContractEndpoint(
            method="GET",
            path=f"{settings.api_prefix}/health",
            request_schema=None,
            response_schema="HealthResponse",
            error_schema=None,
        ),
        ContractEndpoint(
            method="GET",
            path=f"{settings.api_prefix}/ready",
            request_schema=None,
            response_schema="ReadinessResponse",
            error_schema="ReadinessResponse",
        ),
        ContractEndpoint(
            method="GET",
            path=f"{settings.api_prefix}/capabilities",
            request_schema=None,
            response_schema="CapabilitiesResponse",
            error_schema=None,
        ),
        ContractEndpoint(
            method="GET",
            path=f"{settings.api_prefix}/contract",
            request_schema=None,
            response_schema="ContractResponse",
            error_schema="ErrorResponse",
        ),
        ContractEndpoint(
            method="POST",
            path=f"{settings.api_prefix}/map",
            request_schema="MapRequest",
            response_schema="MapResponse",
            error_schema="ErrorResponse",
            optional_headers=["x-request-id"],
        ),
        ContractEndpoint(
            method="GET",
            path=f"{settings.api_prefix}/admin/mappings",
            request_schema=None,
            response_schema="AdminListResponse",
            error_schema="ErrorResponse",
            required_headers=["x-admin-token"],
            optional_headers=["x-request-id"],
        ),
        ContractEndpoint(
            method="POST",
            path=f"{settings.api_prefix}/admin/mappings",
            request_schema="AdminUpsertRequest",
            response_schema="AdminUpsertResponse",
            error_schema="ErrorResponse",
            required_headers=["x-admin-token"],
            optional_headers=["x-request-id"],
        ),
        ContractEndpoint(
            method="DELETE",
            path=f"{settings.api_prefix}/admin/mappings/{{symptom}}",
            request_schema=None,
            response_schema="AdminDeleteResponse",
            error_schema="ErrorResponse",
            required_headers=["x-admin-token"],
            optional_headers=["x-request-id"],
        ),
    ]


def _contract_schemas():
    schema_models = [
        MapRequest,
        MapResponse,
        HealthResponse,
        CapabilitiesResponse,
        ContractResponse,
        ReadinessResponse,
        ErrorResponse,
        AdminUpsertRequest,
        AdminUpsertResponse,
        AdminListResponse,
        AdminDeleteResponse,
    ]
    return {
        model.__name__: model.model_json_schema()
        for model in schema_models
    }


def _readiness_checks():
    checks = [
        ReadinessCheck(
            name="mock_source",
            status="ok",
            required=True,
            message="Mock source is built in",
        )
    ]

    if settings.local_enabled:
        try:
            init_db()
            conn = get_connection()
            if not conn:
                raise RuntimeError("Local database connection unavailable")
            conn.execute("SELECT 1 FROM mappings LIMIT 1")
            conn.close()
            checks.append(
                ReadinessCheck(
                    name="local_store",
                    status="ok",
                    required=True,
                    message="Local mapping database is available",
                )
            )
        except Exception as exc:
            checks.append(
                ReadinessCheck(
                    name="local_store",
                    status="fail",
                    required=True,
                    message=str(exc),
                )
            )
    else:
        checks.append(
            ReadinessCheck(
                name="local_store",
                status="disabled",
                required=False,
                message="Local mapping database is disabled",
            )
        )

    if settings.who_enabled:
        if who_available():
            checks.append(
                ReadinessCheck(
                    name="who_icd11",
                    status="ok",
                    required=True,
                    message="WHO ICD-11 lookup is configured",
                )
            )
        else:
            checks.append(
                ReadinessCheck(
                    name="who_icd11",
                    status="fail",
                    required=True,
                    message="WHO ICD-11 is enabled but ME_WHO_TOKEN is missing",
                )
            )
    else:
        checks.append(
            ReadinessCheck(
                name="who_icd11",
                status="disabled",
                required=False,
                message="WHO ICD-11 lookup is disabled",
            )
        )

    return checks


def _error_response(request: Request, status_code: int, code: str, message: str):
    request_id = getattr(request.state, "request_id", str(uuid4()))
    payload = ErrorResponse(
        request_id=request_id,
        error=ErrorDetail(
            code=code,
            message=message,
        ),
    )
    return JSONResponse(status_code=status_code, content=payload.model_dump())


def _admin_disabled_response(request: Request):
    return _error_response(
        request=request,
        status_code=503,
        code="admin_disabled",
        message="Admin API is disabled",
    )


def _validate_admin_access(request: Request):
    if not settings.local_enabled or not settings.admin_enabled:
        return _admin_disabled_response(request)
    if not settings.admin_token:
        return _error_response(
            request=request,
            status_code=401,
            code="admin_auth_required",
            message="Admin API requires ME_ADMIN_TOKEN",
        )
    supplied_token = request.headers.get("x-admin-token")
    if not supplied_token:
        return _error_response(
            request=request,
            status_code=401,
            code="admin_auth_required",
            message="Missing x-admin-token header",
        )
    if not secrets.compare_digest(supplied_token, settings.admin_token):
        return _error_response(
            request=request,
            status_code=403,
            code="admin_auth_invalid",
            message="Invalid x-admin-token header",
        )
    return None


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
            details=_validation_error_details(exc),
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
    f"{settings.api_prefix}/ready",
    response_model=ReadinessResponse,
    responses={
        503: {"model": ReadinessResponse},
    },
    tags=["system"],
    summary="Dependency readiness check",
)
def ready(request: Request):
    checks = _readiness_checks()
    is_ready = all(
        check.status == "ok"
        for check in checks
        if check.required
    )
    payload = ReadinessResponse(
        request_id=request.state.request_id,
        status="ready" if is_ready else "not_ready",
        checks=checks,
    )
    if not is_ready:
        return JSONResponse(status_code=503, content=payload.model_dump())
    return payload


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


@app.get(
    f"{settings.api_prefix}/contract",
    response_model=ContractResponse,
    responses={
        500: {"model": ErrorResponse},
    },
    tags=["system"],
    summary="Official mapping engine API contract",
)
def contract(request: Request) -> ContractResponse:
    return ContractResponse(
        request_id=request.state.request_id,
        service=settings.service_name,
        version=settings.service_version,
        api_prefix=settings.api_prefix,
        endpoints=_contract_endpoints(),
        schemas=_contract_schemas(),
        required_headers=[],
        optional_headers=["x-request-id", "x-admin-token"],
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
    access_error = _validate_admin_access(request)
    if access_error:
        return access_error
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
    access_error = _validate_admin_access(request)
    if access_error:
        return access_error
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
    f"{settings.api_prefix}/admin/mappings/{{symptom}}",
    responses={
        200: {"model": AdminDeleteResponse},
        503: {"model": ErrorResponse},
    },
    tags=["admin"],
    summary="Delete a local mapping",
)
def delete_mapping(request: Request, symptom: str):
    access_error = _validate_admin_access(request)
    if access_error:
        return access_error
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
