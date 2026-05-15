from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_ok():
    response = client.get("/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "mapping-engine"
    assert "version" in body


def test_map_basic():
    response = client.post(
        "/v1/map",
        json={"symptoms": ["fever", "cough"]},
        headers={"x-request-id": "test-req-1"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["request_id"] == "test-req-1"
    assert body["total"] == 2
    assert len(body["data"]) == 2


def test_map_validation_error():
    response = client.post("/v1/map", json={"symptoms": []})
    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "validation_error"
*** End Patch