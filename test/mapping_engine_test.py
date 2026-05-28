#!/usr/bin/env python3
"""
Mapping Engine contract tester.

Run:
    python test/mapping_engine_test.py

Paste a base URL such as:
    http://localhost:8001
    https://your-mapping-engine.example.com
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


TIMEOUT_SECONDS = 10
RISK_LEVELS = {"HIGH", "MEDIUM", "LOW"}


class Report:
    def __init__(self) -> None:
        self.passed = 0
        self.failed = 0
        self.warned = 0

    def pass_(self, message: str) -> None:
        self.passed += 1
        print(f"[PASS] {message}")

    def fail(self, message: str) -> None:
        self.failed += 1
        print(f"[FAIL] {message}")

    def warn(self, message: str) -> None:
        self.warned += 1
        print(f"[WARN] {message}")

    def summary(self) -> int:
        print()
        print(f"Summary: {self.passed} passed, {self.failed} failed, {self.warned} warnings")
        return 1 if self.failed else 0


def ask_url(label: str) -> str:
    raw = input(f"{label}: ").strip().rstrip("/")
    if not raw:
        raise SystemExit("No URL supplied.")
    if not raw.startswith(("http://", "https://")):
        raw = "http://" + raw
    return raw


def request_json(
    method: str,
    url: str,
    payload: dict[str, Any] | None = None,
    headers: dict[str, str] | None = None,
) -> tuple[int, dict[str, str], Any]:
    data = None
    request_headers = headers.copy() if headers else {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        request_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
            body = response.read().decode("utf-8")
            return response.status, dict(response.headers), parse_json(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8")
        return exc.code, dict(exc.headers), parse_json(body)


def parse_json(body: str) -> Any:
    try:
        return json.loads(body) if body else None
    except json.JSONDecodeError:
        return body


def has_keys(value: Any, keys: list[str]) -> bool:
    return isinstance(value, dict) and all(key in value for key in keys)


def validate_error_response(body: Any) -> list[str]:
    errors = []
    if not has_keys(body, ["request_id", "error"]):
        return ["response must contain request_id and error"]
    error = body["error"]
    if not has_keys(error, ["code", "message"]):
        errors.append("error must contain code and message")
    if not isinstance(error.get("code"), str):
        errors.append("error.code must be a string")
    if not isinstance(error.get("message"), str):
        errors.append("error.message must be a string")
    return errors


def validate_mapping_item(item: Any, index: int) -> list[str]:
    errors = []
    prefix = f"data[{index}]"
    if not has_keys(item, ["symptom", "icd", "traditional", "fusion"]):
        return [f"{prefix} must contain symptom, icd, traditional, fusion"]

    if not isinstance(item["symptom"], str) or not item["symptom"].strip():
        errors.append(f"{prefix}.symptom must be a non-empty string")

    icd = item["icd"]
    if not has_keys(icd, ["icd_code", "description", "source", "confidence"]):
        errors.append(f"{prefix}.icd must contain icd_code, description, source, confidence")
    else:
        if icd["icd_code"] is not None and not isinstance(icd["icd_code"], str):
            errors.append(f"{prefix}.icd.icd_code must be string or null")
        if icd["description"] is not None and not isinstance(icd["description"], str):
            errors.append(f"{prefix}.icd.description must be string or null")
        if not isinstance(icd["source"], str):
            errors.append(f"{prefix}.icd.source must be a string")
        if not isinstance(icd["confidence"], (int, float)):
            errors.append(f"{prefix}.icd.confidence must be a number")

    traditional = item["traditional"]
    if not has_keys(traditional, ["system", "description", "confidence"]):
        errors.append(f"{prefix}.traditional must contain system, description, confidence")
    else:
        if not isinstance(traditional["system"], str):
            errors.append(f"{prefix}.traditional.system must be a string")
        if traditional["description"] is not None and not isinstance(traditional["description"], str):
            errors.append(f"{prefix}.traditional.description must be string or null")
        if not isinstance(traditional["confidence"], (int, float)):
            errors.append(f"{prefix}.traditional.confidence must be a number")

    fusion = item["fusion"]
    if not has_keys(fusion, ["score", "risk"]):
        errors.append(f"{prefix}.fusion must contain score and risk")
    else:
        if not isinstance(fusion["score"], (int, float)):
            errors.append(f"{prefix}.fusion.score must be a number")
        if fusion["risk"] not in RISK_LEVELS:
            errors.append(f"{prefix}.fusion.risk must be HIGH, MEDIUM, or LOW")

    if "match_reason" in item and item["match_reason"] is not None and not isinstance(item["match_reason"], str):
        errors.append(f"{prefix}.match_reason must be string or null")
    if "source_rank" in item and item["source_rank"] is not None and not isinstance(item["source_rank"], int):
        errors.append(f"{prefix}.source_rank must be integer or null")
    return errors


def validate_map_response(body: Any, expected_total: int | None = None) -> list[str]:
    errors = []
    if not has_keys(body, ["request_id", "engine_version", "total", "data"]):
        return ["response must contain request_id, engine_version, total, data"]
    if not isinstance(body["request_id"], str):
        errors.append("request_id must be a string")
    if not isinstance(body["engine_version"], str):
        errors.append("engine_version must be a string")
    if not isinstance(body["total"], int):
        errors.append("total must be an integer")
    if not isinstance(body["data"], list):
        errors.append("data must be a list")
    else:
        if body["total"] != len(body["data"]):
            errors.append("total must match len(data)")
        if expected_total is not None and body["total"] != expected_total:
            errors.append(f"total must be {expected_total}")
        for index, item in enumerate(body["data"]):
            errors.extend(validate_mapping_item(item, index))
    return errors


def main() -> int:
    report = Report()
    base_url = ask_url("Mapping Engine base URL")

    try:
        status, _, body = request_json("GET", f"{base_url}/v1/health")
        if status == 200 and has_keys(body, ["status", "service", "version"]) and body["status"] == "ok":
            report.pass_("GET /v1/health returns HealthResponse")
        else:
            report.fail(f"GET /v1/health expected 200 HealthResponse, got {status}: {body}")

        status, _, body = request_json("GET", f"{base_url}/v1/capabilities")
        if status == 200 and has_keys(body, ["sources", "features"]) and isinstance(body["sources"], list):
            report.pass_("GET /v1/capabilities returns CapabilitiesResponse")
        else:
            report.fail(f"GET /v1/capabilities expected 200 CapabilitiesResponse, got {status}: {body}")

        status, _, body = request_json("GET", f"{base_url}/v1/ready")
        if status == 200 and has_keys(body, ["request_id", "status", "checks"]) and body["status"] == "ready":
            report.pass_("GET /v1/ready returns ready ReadinessResponse")
        elif status == 503 and has_keys(body, ["request_id", "status", "checks"]):
            report.fail(f"GET /v1/ready reports not_ready: {body}")
        else:
            report.fail(f"GET /v1/ready expected ReadinessResponse, got {status}: {body}")

        status, _, body = request_json("GET", f"{base_url}/v1/contract")
        has_map_contract = (
            has_keys(body, ["request_id", "service", "version", "api_prefix", "endpoints", "schemas"])
            and "MapRequest" in body["schemas"]
            and "MapResponse" in body["schemas"]
            and any(
                endpoint.get("method") == "POST" and endpoint.get("path") == "/v1/map"
                for endpoint in body["endpoints"]
            )
        )
        if status == 200 and has_map_contract:
            report.pass_("GET /v1/contract exposes mapping-engine API contract")
        else:
            report.fail(f"GET /v1/contract expected contract metadata, got {status}: {body}")

        request_id = "contract-test-mapping-001"
        status, headers, body = request_json(
            "POST",
            f"{base_url}/v1/map",
            {"symptoms": [" fever ", "cough"]},
            {"x-request-id": request_id},
        )
        errors = validate_map_response(body, expected_total=2)
        if status == 200 and not errors and body.get("request_id") == request_id:
            report.pass_("POST /v1/map returns mapping-engine MapResponse")
        else:
            report.fail(f"POST /v1/map contract mismatch: status={status}, errors={errors}, body={body}")
        if headers.get("x-request-id") == request_id:
            report.pass_("POST /v1/map echoes x-request-id header")
        else:
            report.fail(f"x-request-id header not echoed correctly: {headers.get('x-request-id')}")
        if status == 200 and body.get("data", [{}])[0].get("symptom") == "fever":
            report.pass_("POST /v1/map trims symptom input")
        else:
            report.fail("POST /v1/map did not normalize ' fever ' to 'fever'")

        status, _, body = request_json("POST", f"{base_url}/v1/map", {"symptoms": ["   "]})
        errors = validate_error_response(body)
        if status == 422 and not errors:
            report.pass_("POST /v1/map rejects blank symptoms with ErrorResponse")
        else:
            report.fail(f"Blank symptom expected 422 ErrorResponse, got {status}: {body}")

        status, _, body = request_json("GET", f"{base_url}/v1/admin/mappings")
        if status == 503 and not validate_error_response(body):
            report.pass_("GET /v1/admin/mappings returns ErrorResponse when admin is disabled")
        elif status == 200 and has_keys(body, ["request_id", "total", "items"]):
            report.pass_("GET /v1/admin/mappings returns AdminListResponse when admin is enabled")
        else:
            report.fail(f"GET /v1/admin/mappings unexpected response {status}: {body}")
    except urllib.error.URLError as exc:
        report.fail(f"Could not reach mapping engine: {exc}")

    return report.summary()


if __name__ == "__main__":
    sys.exit(main())
