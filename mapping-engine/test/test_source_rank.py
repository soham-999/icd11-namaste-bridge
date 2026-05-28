from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_source_rank_for_mock():
    response = client.post("/v1/map", json={"symptoms": ["fever"]})
    assert response.status_code == 200
    body = response.json()
    assert body["data"][0]["source_rank"] == 3
    assert body["data"][0]["match_reason"] == "mock_exact"
