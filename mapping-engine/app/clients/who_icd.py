from __future__ import annotations

from typing import Optional

import httpx

from ..cache import InMemoryCache
from ..config import settings
from ..schemas import ICDMatch


_cache = InMemoryCache()


def _cache_key(query: str) -> str:
    return f"who:{query}"


def fetch_icd11(query: str) -> Optional[ICDMatch]:
    clean = query.lower().strip()
    if not clean or not settings.who_enabled:
        return None

    cached = _cache.get(_cache_key(clean))
    if cached:
        return cached

    if not settings.who_token:
        return None

    url = f"{settings.who_api_base_url}/entity/search"
    params = {"q": clean}

    for attempt in range(settings.who_max_retries + 1):
        try:
            response = httpx.get(
                url,
                params=params,
                headers={
                    "Accept": "application/json",
                    "Authorization": f"Bearer {settings.who_token}",
                    "API-Version": settings.who_api_version,
                },
                timeout=settings.request_timeout_seconds,
            )
            response.raise_for_status()
            payload = response.json()
            entity = payload.get("destinationEntities", [None])[0]
            if not entity:
                return None

            match = ICDMatch(
                icd_code=entity.get("theCode"),
                description=entity.get("title"),
                source="who-icd11",
                confidence=0.9,
            )
            _cache.set(_cache_key(clean), match, settings.cache_ttl_seconds)
            return match
        except httpx.HTTPError:
            if attempt >= settings.who_max_retries:
                return None


def who_available() -> bool:
    return settings.who_enabled and bool(settings.who_token)
