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
			"match_reason": "mock_lookup"
		}
	]
}
```

## Notes

- The service echoes `x-request-id` in responses for traceability.

## Run (dev)

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```
