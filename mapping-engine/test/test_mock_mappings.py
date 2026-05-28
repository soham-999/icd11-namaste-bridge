from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_expanded_mock_exact_match():
    response = client.post("/v1/map", json={"symptoms": ["nausea"]})
    assert response.status_code == 200
    body = response.json()
    mapping = body["data"][0]
    assert mapping["symptom"] == "nausea"
    assert mapping["icd"]["icd_code"] == "TM004"
    assert mapping["traditional"]["system"] == "ayurveda"
    assert mapping["match_reason"] == "mock_exact"
    assert mapping["source_rank"] == 3


def test_mock_alias_match_returns_canonical_symptom():
    response = client.post("/v1/map", json={"symptoms": ["stomach pain"]})
    assert response.status_code == 200
    body = response.json()
    mapping = body["data"][0]
    assert mapping["symptom"] == "abdominal pain"
    assert mapping["icd"]["icd_code"] == "TM007"
    assert mapping["match_reason"] == "mock_alias"
    assert mapping["fusion"]["risk"] == "HIGH"


def test_unknown_symptom_uses_fallback():
    response = client.post("/v1/map", json={"symptoms": ["unknown symptom"]})
    assert response.status_code == 200
    body = response.json()
    mapping = body["data"][0]
    assert mapping["symptom"] == "unknown symptom"
    assert mapping["icd"]["source"] == "fallback"
    assert mapping["icd"]["icd_code"] == "UNKNOWN"
    assert mapping["match_reason"] == "fallback"
    assert mapping["source_rank"] == 4
    assert mapping["fusion"]["risk"] == "LOW"
