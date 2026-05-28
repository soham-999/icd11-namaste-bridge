from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_capabilities_without_who_token():
    response = client.get("/v1/capabilities")
    assert response.status_code == 200
    body = response.json()
    assert "who-icd11" not in body["sources"]
