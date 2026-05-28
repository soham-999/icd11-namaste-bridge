from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_map_rejects_unknown_source():
    response = client.post(
        "/v1/map",
        json={"symptoms": ["fever"], "sources": ["unknown"]},
    )
    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "validation_error"


def test_map_accepts_who_source_without_token():
    response = client.post(
        "/v1/map",
        json={"symptoms": ["fever"], "sources": ["who"]},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["data"][0]["icd"]["source"] in {"mock", "fallback"}
