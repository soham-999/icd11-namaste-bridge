from __future__ import annotations

from typing import List, Optional, Set

from .clients.who_icd import fetch_icd11
from .repositories.local_mapping_repo import LocalMappingRepository
from .schemas import ICDMatch, TraditionalMatch, FusionScore, SymptomMapping


MOCK_ICD = {
    "fever": ("TM001", "Pitta imbalance"),
    "headache": ("TM002", "Vata disturbance"),
    "cough": ("TM003", "Kapha imbalance"),
}

ALLOWED_SOURCES: Set[str] = {"mock", "who", "who-icd11", "local"}
SOURCE_RANK = {
    "who-icd11": 1,
    "local": 2,
    "mock": 3,
    "fallback": 4,
}

_local_repo = LocalMappingRepository()


def normalize_symptom(symptom: str) -> str:
    return symptom.lower().strip()


def normalize_sources(sources: Optional[List[str]]) -> Optional[List[str]]:
    if sources is None:
        return None
    cleaned = [s.strip().lower() for s in sources if s.strip()]
    invalid = [s for s in cleaned if s not in ALLOWED_SOURCES]
    if invalid:
        raise ValueError(f"Unsupported sources: {', '.join(invalid)}")
    return cleaned


def lookup_icd(symptom: str, sources: Optional[List[str]]) -> ICDMatch:
    if sources and "local" in sources:
        local_match = _local_repo.find_icd(symptom)
        if local_match:
            return local_match

    if sources and ("who" in sources or "who-icd11" in sources):
        who_match = fetch_icd11(symptom)
        if who_match:
            return who_match

    if symptom in MOCK_ICD:
        code, desc = MOCK_ICD[symptom]
        return ICDMatch(
            icd_code=code,
            description=desc,
            source="mock",
            confidence=0.85,
        )

    return ICDMatch(
        icd_code="UNKNOWN",
        description="No match found",
        source="fallback",
        confidence=0.3,
    )


def map_traditional(symptom: str) -> TraditionalMatch:
    if "fever" in symptom:
        return TraditionalMatch(
            description="Pitta aggravation suspected",
            confidence=0.75,
        )
    if "cough" in symptom:
        return TraditionalMatch(
            description="Kapha imbalance suspected",
            confidence=0.75,
        )

    return TraditionalMatch(
        description="Vata imbalance possible",
        confidence=0.4,
    )


def calculate_fusion(icd_conf: float, trad_conf: float) -> FusionScore:
    score = (icd_conf * 0.6) + (trad_conf * 0.4)
    if score >= 0.75:
        risk = "HIGH"
    elif score >= 0.5:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return FusionScore(score=round(score, 2), risk=risk)


def map_symptoms(
    symptoms: List[str],
    sources: Optional[List[str]] = None,
) -> List[SymptomMapping]:
    sources = normalize_sources(sources)
    results: List[SymptomMapping] = []

    for symptom in symptoms:
        clean = normalize_symptom(symptom)
        icd = lookup_icd(clean, sources)
        traditional = map_traditional(clean)
        fusion = calculate_fusion(icd.confidence, traditional.confidence)

        if icd.source == "who-icd11":
            reason = "who_lookup"
        elif icd.source == "mock":
            reason = "mock_lookup"
        else:
            reason = "fallback"
        source_rank = SOURCE_RANK.get(icd.source)

        results.append(
            SymptomMapping(
                symptom=clean,
                icd=icd,
                traditional=traditional,
                fusion=fusion,
                match_reason=reason,
                source_rank=source_rank,
            )
        )

    return results
