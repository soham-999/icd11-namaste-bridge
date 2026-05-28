#!/usr/bin/env python3
"""
Backend integration/contract tester.

This script checks whether a separately hosted backend is compatible with the
mapping-engine API contract. The mapping engine contract is treated as the
standard source of truth.

Run:
    python test/backend_test.py
"""

from __future__ import annotations

import json
import sys
import urllib.error
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


def ask_yes_no(question: str, default: bool = False) -> bool:
    suffix = "Y/n" if default else "y/N"
    answer = input(f"{question} ({suffix}): ").strip().lower()
    if not answer:
        return default
    return answer in {"y", "yes"}


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


def validate_mapping_item(item: Any, index: int) -> list[str]:
    errors = []
    prefix = f"data[{index}]"
    if not has_keys(item, ["symptom", "icd", "traditional", "fusion"]):
        return [f"{prefix} must contain symptom, icd, traditional, fusion"]
    icd = item["icd"]
    traditional = item["traditional"]
    fusion = item["fusion"]
    if not isinstance(item["symptom"], str) or not item["symptom"].strip():
        errors.append(f"{prefix}.symptom must be a non-empty string")
    if not has_keys(icd, ["icd_code", "description", "source", "confidence"]):
        errors.append(f"{prefix}.icd must use icd_code/description/source/confidence")
    if not has_keys(traditional, ["system", "description", "confidence"]):
        errors.append(f"{prefix}.traditional must use system/description/confidence")
    if not has_keys(fusion, ["score", "risk"]) or fusion.get("risk") not in RISK_LEVELS:
        errors.append(f"{prefix}.fusion must use score and risk HIGH/MEDIUM/LOW")
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


def validate_error_response(body: Any) -> list[str]:
    if not has_keys(body, ["request_id", "error"]):
        return ["response must contain request_id and error"]
    if not has_keys(body["error"], ["code", "message"]):
        return ["error must contain code and message"]
    return []


def main() -> int:
    report = Report()
    base_url = ask_url("Backend base URL")

    try:
        status, _, body = request_json("GET", f"{base_url}/health")
        if status == 200:
            report.pass_("GET /health is reachable")
        else:
            report.fail(f"GET /health expected 200, got {status}: {body}")

        request_id = "contract-test-backend-001"
        status, headers, body = request_json(
            "POST",
            f"{base_url}/v1/map",
            {"symptoms": ["fever", "cough"]},
            {"x-request-id": request_id},
        )
        errors = validate_map_response(body, expected_total=2)
        if status == 200 and not errors:
            report.pass_("POST /v1/map matches mapping-engine MapResponse")
        else:
            report.fail(
                "Backend must expose or proxy mapping through POST /v1/map "
                f"using the mapping-engine contract. Got status={status}, errors={errors}, body={body}"
            )
        if status == 200 and headers.get("x-request-id") == request_id:
            report.pass_("POST /v1/map echoes x-request-id")
        elif status == 200:
            report.fail("POST /v1/map response did not echo x-request-id")

        status, _, body = request_json("POST", f"{base_url}/v1/map", {"symptoms": [""]})
        errors = validate_error_response(body)
        if status == 422 and not errors:
            report.pass_("POST /v1/map returns standardized ErrorResponse for invalid input")
        else:
            report.fail(f"Invalid /v1/map input expected 422 ErrorResponse, got {status}: {body}")

        status, _, body = request_json("GET", f"{base_url}/icd/fever")
        if status == 404:
            report.warn("GET /icd/fever not found; OK if backend only exposes standardized /v1/map")
        elif status == 200:
            if validate_map_response(body, expected_total=1):
                report.warn("GET /icd/fever is reachable but does not match MapResponse; prefer /v1/map")
            else:
                report.pass_("GET /icd/fever returns mapping-engine compatible schema")
        else:
            report.warn(f"GET /icd/fever returned {status}: {body}")

        if ask_yes_no("Run patient write test against POST /add-patient? This may insert data.", default=False):
            status, _, body = request_json(
                "POST",
                f"{base_url}/add-patient",
                {"name": "Contract Test Patient", "age": 30, "symptoms": ["fever", "cough"]},
            )
            if status != 200:
                report.fail(f"POST /add-patient expected 200, got {status}: {body}")
            elif not has_keys(body, ["ehrReport"]):
                report.fail(f"POST /add-patient must return ehrReport, got: {body}")
            else:
                mappings = body.get("ehrReport", {}).get("clinicalMapping")
                wrapper = {
                    "request_id": "backend-add-patient",
                    "engine_version": "backend",
                    "total": len(mappings) if isinstance(mappings, list) else -1,
                    "data": mappings,
                }
                errors = validate_map_response(wrapper, expected_total=2)
                if not errors:
                    report.pass_("POST /add-patient ehrReport.clinicalMapping matches mapping-engine items")
                else:
                    report.fail(f"POST /add-patient mapping schema mismatch: {errors}")
    except urllib.error.URLError as exc:
        report.fail(f"Could not reach backend: {exc}")

    return report.summary()


if __name__ == "__main__":
    sys.exit(main())
