from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, Optional

from ..schemas import ICDMatch, TraditionalMatch


@dataclass(frozen=True)
class MockMapping:
    symptom: str
    icd_code: str
    icd_description: str
    traditional_description: str
    dosha: str
    icd_confidence: float = 0.85
    traditional_confidence: float = 0.75


@dataclass(frozen=True)
class MockLookupResult:
    canonical_symptom: str
    icd: ICDMatch
    traditional: TraditionalMatch
    match_reason: str


MOCK_MAPPINGS: Dict[str, MockMapping] = {
    "fever": MockMapping(
        symptom="fever",
        icd_code="TM001",
        icd_description="Pitta imbalance",
        traditional_description="Pitta aggravation suspected",
        dosha="pitta",
    ),
    "headache": MockMapping(
        symptom="headache",
        icd_code="TM002",
        icd_description="Vata disturbance",
        traditional_description="Vata imbalance possible",
        dosha="vata",
    ),
    "cough": MockMapping(
        symptom="cough",
        icd_code="TM003",
        icd_description="Kapha imbalance",
        traditional_description="Kapha imbalance suspected",
        dosha="kapha",
    ),
    "nausea": MockMapping(
        symptom="nausea",
        icd_code="TM004",
        icd_description="Agni disturbance",
        traditional_description="Digestive fire disturbance suspected",
        dosha="pitta",
    ),
    "fatigue": MockMapping(
        symptom="fatigue",
        icd_code="TM005",
        icd_description="Prana depletion",
        traditional_description="Low vitality and prana depletion suspected",
        dosha="vata",
    ),
    "dizziness": MockMapping(
        symptom="dizziness",
        icd_code="TM006",
        icd_description="Vata instability",
        traditional_description="Vata imbalance affecting steadiness",
        dosha="vata",
    ),
    "abdominal pain": MockMapping(
        symptom="abdominal pain",
        icd_code="TM007",
        icd_description="Gastrointestinal imbalance",
        traditional_description="Agni and apana vata disturbance suspected",
        dosha="vata",
    ),
    "joint pain": MockMapping(
        symptom="joint pain",
        icd_code="TM008",
        icd_description="Vata affecting joints",
        traditional_description="Vata aggravation in joints suspected",
        dosha="vata",
    ),
    "insomnia": MockMapping(
        symptom="insomnia",
        icd_code="TM009",
        icd_description="Vata sleep disturbance",
        traditional_description="Vata aggravation affecting sleep",
        dosha="vata",
    ),
    "loss of appetite": MockMapping(
        symptom="loss of appetite",
        icd_code="TM010",
        icd_description="Mandagni",
        traditional_description="Reduced digestive fire suspected",
        dosha="kapha",
    ),
    "diarrhea": MockMapping(
        symptom="diarrhea",
        icd_code="TM011",
        icd_description="Pitta digestive disturbance",
        traditional_description="Pitta aggravation in digestion suspected",
        dosha="pitta",
    ),
    "constipation": MockMapping(
        symptom="constipation",
        icd_code="TM012",
        icd_description="Apana vata disturbance",
        traditional_description="Apana vata obstruction suspected",
        dosha="vata",
    ),
    "sore throat": MockMapping(
        symptom="sore throat",
        icd_code="TM013",
        icd_description="Kapha throat involvement",
        traditional_description="Kapha accumulation in throat suspected",
        dosha="kapha",
    ),
    "breathlessness": MockMapping(
        symptom="breathlessness",
        icd_code="TM014",
        icd_description="Prana vata respiratory disturbance",
        traditional_description="Prana vata and kapha respiratory involvement",
        dosha="kapha",
    ),
    "back pain": MockMapping(
        symptom="back pain",
        icd_code="TM015",
        icd_description="Vata musculoskeletal disturbance",
        traditional_description="Vata aggravation in back region suspected",
        dosha="vata",
    ),
    "skin rash": MockMapping(
        symptom="skin rash",
        icd_code="TM016",
        icd_description="Pitta skin manifestation",
        traditional_description="Pitta aggravation affecting skin suspected",
        dosha="pitta",
    ),
    "burning sensation": MockMapping(
        symptom="burning sensation",
        icd_code="TM017",
        icd_description="Pitta heat manifestation",
        traditional_description="Pitta heat aggravation suspected",
        dosha="pitta",
    ),
    "anxiety": MockMapping(
        symptom="anxiety",
        icd_code="TM018",
        icd_description="Vata mental disturbance",
        traditional_description="Vata aggravation affecting mind suspected",
        dosha="vata",
    ),
    "vomiting": MockMapping(
        symptom="vomiting",
        icd_code="TM019",
        icd_description="Urdhva digestive disturbance",
        traditional_description="Upward digestive disturbance suspected",
        dosha="pitta",
    ),
    "nasal congestion": MockMapping(
        symptom="nasal congestion",
        icd_code="TM020",
        icd_description="Kapha nasal obstruction",
        traditional_description="Kapha accumulation in nasal channels suspected",
        dosha="kapha",
    ),
}


ALIASES = {
    "stomach pain": "abdominal pain",
    "belly pain": "abdominal pain",
    "tummy pain": "abdominal pain",
    "joint ache": "joint pain",
    "body ache": "joint pain",
    "sleeplessness": "insomnia",
    "no appetite": "loss of appetite",
    "loose motion": "diarrhea",
    "loose motions": "diarrhea",
    "shortness of breath": "breathlessness",
    "difficulty breathing": "breathlessness",
    "low back pain": "back pain",
    "rash": "skin rash",
    "burning": "burning sensation",
    "blocked nose": "nasal congestion",
    "stuffy nose": "nasal congestion",
}


class MockMappingRepository:
    def find(self, symptom: str) -> Optional[MockLookupResult]:
        if symptom in MOCK_MAPPINGS:
            return self._build_result(symptom, match_reason="mock_exact")

        canonical = ALIASES.get(symptom)
        if canonical:
            return self._build_result(canonical, match_reason="mock_alias")

        return None

    def supported_symptoms(self) -> Iterable[str]:
        return MOCK_MAPPINGS.keys()

    def _build_result(self, canonical_symptom: str, match_reason: str) -> MockLookupResult:
        mapping = MOCK_MAPPINGS[canonical_symptom]
        return MockLookupResult(
            canonical_symptom=canonical_symptom,
            icd=ICDMatch(
                icd_code=mapping.icd_code,
                description=mapping.icd_description,
                source="mock",
                confidence=mapping.icd_confidence,
            ),
            traditional=TraditionalMatch(
                system="ayurveda",
                description=mapping.traditional_description,
                confidence=mapping.traditional_confidence,
            ),
            match_reason=match_reason,
        )
