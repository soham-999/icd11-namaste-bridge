from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_contract_exposes_official_schemas():
    response = client.get(
        "/v1/contract",
        headers={"x-request-id": "contract-test-1"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["request_id"] == "contract-test-1"
    assert body["service"] == "mapping-engine"
    assert body["api_prefix"] == "/v1"
    assert "MapRequest" in body["schemas"]
    assert "MapResponse" in body["schemas"]
    assert any(
        endpoint["method"] == "POST" and endpoint["path"] == "/v1/map"
        for endpoint in body["endpoints"]
    )
    assert any(
        endpoint["path"] == "/v1/admin/mappings"
        and "x-admin-token" in endpoint["required_headers"]
        for endpoint in body["endpoints"]
    )


def test_ready_default_configuration_is_ready():
    response = client.get("/v1/ready")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ready"
    assert any(
        check["name"] == "mock_source" and check["status"] == "ok"
        for check in body["checks"]
    )


def test_ready_fails_when_who_enabled_without_token(monkeypatch):
    monkeypatch.setattr("app.config.settings.who_enabled", True)
    monkeypatch.setattr("app.config.settings.who_token", None)

    response = client.get("/v1/ready")
    assert response.status_code == 503
    body = response.json()
    assert body["status"] == "not_ready"
    assert any(
        check["name"] == "who_icd11" and check["status"] == "fail"
        for check in body["checks"]
    )
