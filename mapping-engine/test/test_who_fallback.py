from fastapi.testclient import TestClient

import app.clients.who_icd as who_client
from app.main import app


client = TestClient(app)


def test_who_fallback_when_disabled(monkeypatch):
    monkeypatch.setattr(who_client.settings, "who_enabled", False)
    response = client.post(
        "/v1/map",
        json={"symptoms": ["fever"], "sources": ["who"]},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["data"][0]["icd"]["source"] in {"mock", "fallback"}
