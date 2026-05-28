# Mapping Engine (FastAPI)

Standalone service for mapping symptoms to ICD-11 TM and traditional medicine labels.

## Endpoints

- `GET /v1/health`
- `GET /v1/ready`
- `GET /v1/capabilities`
- `GET /v1/contract`
- `POST /v1/map`

## Phase 0 Readiness

- Mapping Engine owns the API contract and versioning.
- `/v1/contract` is the source of truth for backend/frontend schema integration.
- `/v1/ready` reports whether enabled dependencies are configured correctly.
- Deterministic, explainable responses with request-level tracing (`x-request-id`).
- Mock sources only; external ICD sources are deferred to Phase 1.

## Example

Request:

```bash
curl -X POST http://localhost:8001/v1/map \
	-H "Content-Type: application/json" \
	-d '{"symptoms":["fever","cough"]}'
```

Response (example):

```json
{
	"request_id": "b8f2b2b8-4c07-4e25-8f4b-2c2f7b5a4db4",
	"engine_version": "0.1.0",
	"total": 2,
	"data": [
		{
			"symptom": "fever",
			"icd": {
				"icd_code": "TM001",
				"description": "Pitta imbalance",
				"source": "mock",
				"confidence": 0.85
			},
			"traditional": {
				"system": "ayurveda",
				"description": "Pitta aggravation suspected",
				"confidence": 0.75
			},
			"fusion": {
				"score": 0.81,
				"risk": "HIGH"
			},
			"match_reason": "mock_lookup",
			"source_rank": 3
		}
	]
}
```

## Notes

- The service echoes `x-request-id` in responses for traceability.
- `symptoms` must contain at least one non-empty string; blank entries return a validation error.

## Configuration

Environment variables (prefix `ME_`):

- `ME_WHO_ENABLED` (default: false)
- `ME_WHO_TOKEN` (default: unset)
- `ME_WHO_API_BASE_URL` (default: https://id.who.int/icd)
- `ME_WHO_API_VERSION` (default: v2)
- `ME_CACHE_TTL_SECONDS` (default: 900)
- `ME_LOCAL_ENABLED` (default: false)
- `ME_LOCAL_DB_PATH` (default: ./data/mappings.db)
- `ME_ADMIN_ENABLED` (default: false)
- `ME_ADMIN_TOKEN` (default: unset)
- `ME_CORS_ALLOW_ORIGINS` (default: ["*"])

## Run Locally

From the repository root:

```bash
cd mapping-engine
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

The service will be available at:

- `http://localhost:8001/v1/health`
- `http://localhost:8001/v1/ready`
- `http://localhost:8001/v1/capabilities`
- `http://localhost:8001/v1/contract`
- `http://localhost:8001/v1/map`
- `http://localhost:8001/docs`

## Smoke Test

```bash
curl http://localhost:8001/v1/health

curl http://localhost:8001/v1/ready

curl http://localhost:8001/v1/contract

curl -X POST http://localhost:8001/v1/map \
	-H "Content-Type: application/json" \
	-H "x-request-id: smoke-test-1" \
	-d "{\"symptoms\":[\"fever\",\"cough\"]}"
```

## Contract Test

From the repository root, run Soham's mapping-engine contract tester:

```bash
python test/mapping_engine_test.py
```

When prompted, enter:

```text
http://localhost:8001
```

This checks health, readiness, contract metadata, capabilities, mapping response schema, `x-request-id`, validation errors, and admin mapping response shape.

## Integration Contract

`GET /v1/contract` exposes the official mapping-engine API contract for other services. Backend and frontend integrations should align to these schema names:

- `MapRequest`
- `MapResponse`
- `ErrorResponse`
- `HealthResponse`
- `ReadinessResponse`
- `CapabilitiesResponse`

The required mapping endpoint is:

```text
POST /v1/map
```

The optional request header is:

```text
x-request-id
```

If supplied, the service echoes it in the response body and response header.

Admin endpoints also require:

```text
x-admin-token
```

The value must match `ME_ADMIN_TOKEN`. Admin calls return:

- `401 admin_auth_required` when `ME_ADMIN_TOKEN` or `x-admin-token` is missing.
- `403 admin_auth_invalid` when `x-admin-token` is wrong.

## Readiness

`GET /v1/ready` returns:

- `200` with `status: "ready"` when required enabled dependencies are usable.
- `503` with `status: "not_ready"` when an enabled required dependency is missing or broken.

Default MVP readiness requires only the built-in mock source. If `ME_LOCAL_ENABLED=true`, the local SQLite store is checked. If `ME_WHO_ENABLED=true`, `ME_WHO_TOKEN` must be configured.

## Browser / Frontend Communication

CORS is enabled by default for MVP testing so separately hosted frontend and backend services can call the mapping engine.

For stricter deployments, set allowed origins through `ME_CORS_ALLOW_ORIGINS`.

## Admin Mapping API

Admin mapping endpoints are disabled by default. To enable them locally:

```bash
ME_LOCAL_ENABLED=true ME_ADMIN_ENABLED=true ME_ADMIN_TOKEN=dev-admin-token \
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

List mappings:

```bash
curl http://localhost:8001/v1/admin/mappings \
	-H "x-admin-token: dev-admin-token"
```

Upsert a mapping:

```bash
curl -X POST http://localhost:8001/v1/admin/mappings \
	-H "Content-Type: application/json" \
	-H "x-admin-token: dev-admin-token" \
	-d "{\"symptom\":\"nausea\",\"icd_code\":\"TM020\",\"description\":\"Agni imbalance\"}"
```

Delete a mapping:

```bash
curl -X DELETE http://localhost:8001/v1/admin/mappings/nausea \
	-H "x-admin-token: dev-admin-token"
```
