from fastapi.testclient import TestClient

from app.db import get_connection, init_db
from app.main import app


client = TestClient(app)


def test_local_mapping_lookup(monkeypatch):
    monkeypatch.setattr("app.config.settings.local_enabled", True)
    init_db()
    conn = get_connection()
    assert conn is not None
    with conn:
        conn.execute(
            "INSERT OR REPLACE INTO mappings (symptom, icd_code, description) VALUES (?, ?, ?)",
            ("fatigue", "TM010", "Prana depletion"),
        )
    conn.close()

    response = client.post(
        "/v1/map",
        json={"symptoms": ["fatigue"], "sources": ["local"]},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["data"][0]["icd"]["source"] == "local"
