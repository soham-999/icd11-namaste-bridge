from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_admin_returns_503_when_disabled():
    response = client.get("/v1/admin/mappings")
    assert response.status_code == 503


def test_admin_upsert_and_delete(monkeypatch):
    monkeypatch.setattr("app.config.settings.local_enabled", True)
    monkeypatch.setattr("app.config.settings.admin_enabled", True)
    monkeypatch.setattr("app.config.settings.admin_token", "test-admin-token")

    response = client.get("/v1/admin/mappings")
    assert response.status_code == 401
    body = response.json()
    assert body["error"]["code"] == "admin_auth_required"

    response = client.get(
        "/v1/admin/mappings",
        headers={"x-admin-token": "wrong-token"},
    )
    assert response.status_code == 403
    body = response.json()
    assert body["error"]["code"] == "admin_auth_invalid"

    response = client.post(
        "/v1/admin/mappings",
        headers={"x-admin-token": "test-admin-token"},
        json={
            "symptom": "nausea",
            "icd_code": "TM020",
            "description": "Agni imbalance",
        },
    )
    assert response.status_code == 200

    response = client.get(
        "/v1/admin/mappings",
        headers={"x-admin-token": "test-admin-token"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["total"] >= 1

    response = client.delete(
        "/v1/admin/mappings/nausea",
        headers={"x-admin-token": "test-admin-token"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["deleted"] is True


def test_admin_requires_configured_token(monkeypatch):
    monkeypatch.setattr("app.config.settings.local_enabled", True)
    monkeypatch.setattr("app.config.settings.admin_enabled", True)
    monkeypatch.setattr("app.config.settings.admin_token", None)

    response = client.get("/v1/admin/mappings")
    assert response.status_code == 401
    body = response.json()
    assert body["error"]["code"] == "admin_auth_required"
