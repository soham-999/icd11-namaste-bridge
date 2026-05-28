from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_map_defaults_to_mock_sources():
    response = client.post("/v1/map", json={"symptoms": ["fever"]})
    assert response.status_code == 200
    body = response.json()
    assert body["data"][0]["icd"]["source"] == "mock"
