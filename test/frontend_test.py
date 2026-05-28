#!/usr/bin/env python3
"""
Frontend availability and cross-service communication tester.

This checks that a separately hosted frontend is reachable, loads its assets,
and can communicate with backend/mapping services when their URLs are supplied.

Run:
    python test/frontend_test.py
"""

from __future__ import annotations

import html.parser
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


TIMEOUT_SECONDS = 10
RISK_LEVELS = {"HIGH", "MEDIUM", "LOW"}


class AssetParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key: value for key, value in attrs}
        if tag == "script" and attr_map.get("src"):
            self.assets.append(attr_map["src"] or "")
        if tag == "link" and attr_map.get("href") and attr_map.get("rel") in {"stylesheet", "modulepreload"}:
            self.assets.append(attr_map["href"] or "")


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


def ask_url(label: str, required: bool = True) -> str:
    raw = input(f"{label}: ").strip().rstrip("/")
    if not raw and not required:
        return ""
    if not raw:
        raise SystemExit("No URL supplied.")
    if not raw.startswith(("http://", "https://")):
        raw = "http://" + raw
    return raw


def request(
    method: str,
    url: str,
    payload: dict[str, Any] | None = None,
    headers: dict[str, str] | None = None,
) -> tuple[int, dict[str, str], str]:
    data = None
    request_headers = headers.copy() if headers else {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        request_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
            return response.status, dict(response.headers), response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, dict(exc.headers), exc.read().decode("utf-8", errors="replace")


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
    if not has_keys(item["icd"], ["icd_code", "description", "source", "confidence"]):
        errors.append(f"{prefix}.icd must use mapping-engine icd schema")
    if not has_keys(item["traditional"], ["system", "description", "confidence"]):
        errors.append(f"{prefix}.traditional must use mapping-engine traditional schema")
    if not has_keys(item["fusion"], ["score", "risk"]) or item["fusion"].get("risk") not in RISK_LEVELS:
        errors.append(f"{prefix}.fusion must use mapping-engine fusion schema")
    return errors


def validate_map_response(body: Any) -> list[str]:
    if not has_keys(body, ["request_id", "engine_version", "total", "data"]):
        return ["response must contain request_id, engine_version, total, data"]
    if not isinstance(body["data"], list):
        return ["data must be a list"]
    errors = []
    for index, item in enumerate(body["data"]):
        errors.extend(validate_mapping_item(item, index))
    return errors


def check_cors(report: Report, service_name: str, service_url: str, frontend_origin: str) -> None:
    status, headers, _ = request(
        "OPTIONS",
        f"{service_url}/v1/map",
        headers={
            "Origin": frontend_origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type,x-request-id",
        },
    )
    allow_origin = headers.get("Access-Control-Allow-Origin", "")
    allow_methods = headers.get("Access-Control-Allow-Methods", "")
    if status in {200, 204} and (allow_origin == "*" or allow_origin == frontend_origin) and "POST" in allow_methods.upper():
        report.pass_(f"{service_name} allows browser CORS from frontend origin")
    else:
        report.fail(
            f"{service_name} CORS preflight failed for frontend origin. "
            f"status={status}, allow-origin={allow_origin!r}, allow-methods={allow_methods!r}"
        )


def check_mapping_contract(report: Report, service_name: str, service_url: str) -> None:
    status, _, body_text = request(
        "POST",
        f"{service_url}/v1/map",
        {"symptoms": ["fever"]},
        {"x-request-id": f"contract-test-frontend-{service_name.lower().replace(' ', '-')}"},
    )
    body = parse_json(body_text)
    errors = validate_map_response(body)
    if status == 200 and not errors:
        report.pass_(f"{service_name} POST /v1/map returns mapping-engine schema")
    else:
        report.fail(f"{service_name} POST /v1/map mismatch: status={status}, errors={errors}, body={body}")


def main() -> int:
    report = Report()
    frontend_url = ask_url("Frontend URL")
    backend_url = ask_url("Backend URL for browser communication test (optional)", required=False)
    mapping_url = ask_url("Mapping Engine URL for browser communication test (optional)", required=False)
    frontend_origin = urllib.parse.urlsplit(frontend_url)._replace(path="", query="", fragment="").geturl()

    try:
        status, headers, body = request("GET", frontend_url)
        content_type = headers.get("Content-Type", "")
        if status == 200 and ("text/html" in content_type or "<html" in body.lower()):
            report.pass_("Frontend root serves HTML")
        else:
            report.fail(f"Frontend root expected HTML 200, got status={status}, content-type={content_type}")

        parser = AssetParser()
        parser.feed(body)
        if not parser.assets:
            report.warn("No script/style assets found in frontend HTML")
        else:
            failed_assets = []
            for asset in parser.assets[:20]:
                asset_url = urllib.parse.urljoin(frontend_url + "/", asset)
                asset_status, _, _ = request("GET", asset_url)
                if asset_status >= 400:
                    failed_assets.append((asset, asset_status))
            if failed_assets:
                report.fail(f"Some frontend assets failed to load: {failed_assets}")
            else:
                report.pass_(f"Frontend referenced assets load successfully ({len(parser.assets[:20])} checked)")

        if backend_url:
            check_cors(report, "Backend", backend_url, frontend_origin)
            check_mapping_contract(report, "Backend", backend_url)
        else:
            report.warn("Backend URL not supplied; skipped frontend-to-backend communication checks")

        if mapping_url:
            check_cors(report, "Mapping Engine", mapping_url, frontend_origin)
            check_mapping_contract(report, "Mapping Engine", mapping_url)
        else:
            report.warn("Mapping Engine URL not supplied; skipped frontend-to-mapping-engine communication checks")
    except urllib.error.URLError as exc:
        report.fail(f"Could not reach frontend: {exc}")

    return report.summary()


if __name__ == "__main__":
    sys.exit(main())
