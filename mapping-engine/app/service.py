from __future__ import annotations

from typing import List

from .schemas import ICDMatch, TraditionalMatch, FusionScore, SymptomMapping


MOCK_ICD = {
    "fever": ("TM001", "Pitta imbalance"),
    "headache": ("TM002", "Vata disturbance"),
    "cough": ("TM003", "Kapha imbalance"),
}


def normalize_symptom(symptom: str) -> str:
    return symptom.lower().strip()


def lookup_icd(symptom: str) -> ICDMatch:
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


def map_symptoms(symptoms: List[str]) -> List[SymptomMapping]:
    results: List[SymptomMapping] = []

    for symptom in symptoms:
        clean = normalize_symptom(symptom)
        icd = lookup_icd(clean)
        traditional = map_traditional(clean)
        fusion = calculate_fusion(icd.confidence, traditional.confidence)

        results.append(
            SymptomMapping(
                symptom=clean,
                icd=icd,
                traditional=traditional,
                fusion=fusion,
                match_reason="mock_lookup",
            )
        )

    return results
