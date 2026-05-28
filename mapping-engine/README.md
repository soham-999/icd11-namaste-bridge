# Mapping Engine (FastAPI)

Standalone service for mapping symptoms to ICD-11 TM and traditional medicine labels.

## Endpoints

- `GET /v1/health`
- `GET /v1/capabilities`
- `POST /v1/map`

## Phase 0 Readiness

- Mapping Engine owns the API contract and versioning.
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
- `http://localhost:8001/v1/capabilities`
- `http://localhost:8001/v1/map`
- `http://localhost:8001/docs`

## Smoke Test

```bash
curl http://localhost:8001/v1/health

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

This checks health, capabilities, mapping response schema, `x-request-id`, validation errors, and admin mapping response shape.

## Browser / Frontend Communication

CORS is enabled by default for MVP testing so separately hosted frontend and backend services can call the mapping engine.

For stricter deployments, set allowed origins through `ME_CORS_ALLOW_ORIGINS`.
