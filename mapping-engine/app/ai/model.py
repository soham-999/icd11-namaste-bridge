import os
import json
import numpy as np
from typing import List, Dict, Optional, Tuple
from pathlib import Path
import logging

logger = logging.getLogger("mapping-engine")

# Fallback to simple TF-IDF if sentence-transformers fails to import or load on constrained environments
try:
    from sentence_transformers import SentenceTransformer, util
    ST_AVAILABLE = True
except ImportError:
    ST_AVAILABLE = False
    logger.warning("sentence-transformers not available, will fall back to exact match or basic heuristics")


class SemanticMatcher:
    """
    Semantic Matcher for mapping free-text symptoms to standard Ayush/NAMASTE terminology.
    Uses sentence-transformers to calculate cosine similarity against a known dictionary.
    """
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', dictionary_path: Optional[str] = None):
        global ST_AVAILABLE
        self.model_name = model_name
        self.model = None
        self.dictionary: List[Dict[str, str]] = []
        self.embeddings = None
        
        if ST_AVAILABLE:
            try:
                # Load the model lazily or immediately depending on environment
                # For MVP, we load it immediately on init
                self.model = SentenceTransformer(model_name)
            except Exception as e:
                logger.error(f"Failed to load SentenceTransformer {model_name}: {e}")
                ST_AVAILABLE = False
                
        # Try loading the default dictionary
        if dictionary_path is None:
            # Default to a mock dictionary file in data/
            base_dir = Path(__file__).parent.parent.parent
            dictionary_path = str(base_dir / "data" / "namaste_dictionary.json")
            
        self._load_dictionary(dictionary_path)
        self._compute_embeddings()

    def _load_dictionary(self, path: str):
        """Loads the standard Ayush dictionary."""
        p = Path(path)
        if p.exists():
            with open(p, "r", encoding="utf-8") as f:
                self.dictionary = json.load(f)
            logger.info(f"Loaded {len(self.dictionary)} terms from {path}")
        else:
            # Create a mock dictionary for testing
            self.dictionary = [
                {"standard_term": "Pitta aggravation", "system": "Ayurveda", "description": "Heat and inflammation"},
                {"standard_term": "Vata imbalance", "system": "Ayurveda", "description": "Dryness, pain, mobility issues"},
                {"standard_term": "Kapha excess", "system": "Ayurveda", "description": "Congestion, sluggishness, weight gain"},
                {"standard_term": "Jvara", "system": "Ayurveda", "description": "Fever, high body temperature"},
                {"standard_term": "Kasa", "system": "Ayurveda", "description": "Cough, respiratory distress"},
                {"standard_term": "Hararat", "system": "Unani", "description": "Mild fever, warm body"},
            ]
            # Ensure the data directory exists
            p.parent.mkdir(parents=True, exist_ok=True)
            with open(p, "w", encoding="utf-8") as f:
                json.dump(self.dictionary, f, indent=2)
            logger.info(f"Created mock dictionary with {len(self.dictionary)} terms at {path}")

    def _compute_embeddings(self):
        """Pre-computes embeddings for all standard terms in the dictionary."""
        if not self.model or not self.dictionary:
            return
            
        sentences = [item["standard_term"] + " " + item.get("description", "") for item in self.dictionary]
        logger.info(f"Computing embeddings for {len(sentences)} standard terms...")
        self.embeddings = self.model.encode(sentences, convert_to_tensor=True)
        logger.info("Embeddings computed successfully.")

    def match(self, text: str, threshold: float = 0.4) -> Optional[Tuple[Dict[str, str], float]]:
        """
        Finds the closest matching standard term for the given free-text symptom.
        Returns the dictionary item and the confidence score.
        """
        if not text.strip():
            return None
            
        # If sentence transformers are not available, use basic substring fallback
        if not ST_AVAILABLE or self.model is None or self.embeddings is None:
            return self._basic_fallback_match(text)
            
        query_embedding = self.model.encode(text, convert_to_tensor=True)
        
        # Compute cosine similarities
        cosine_scores = util.cos_sim(query_embedding, self.embeddings)[0]
        
        # Find the max score
        max_score_idx = int(np.argmax(cosine_scores))
        max_score = float(cosine_scores[max_score_idx])
        
        if max_score >= threshold:
            best_match = self.dictionary[max_score_idx]
            return best_match, max_score
            
        return None

    def _basic_fallback_match(self, text: str) -> Optional[Tuple[Dict[str, str], float]]:
        """A rudimentary fallback when AI isn't loaded."""
        text_lower = text.lower()
        for item in self.dictionary:
            if item["standard_term"].lower() in text_lower or text_lower in item["standard_term"].lower():
                return item, 0.8
            if "fever" in text_lower and item["standard_term"] == "Pitta aggravation":
                return item, 0.75
            if "cough" in text_lower and item["standard_term"] == "Kasa":
                return item, 0.75
        return None

# Singleton instance for the service
_semantic_matcher = None

def get_semantic_matcher() -> SemanticMatcher:
    global _semantic_matcher
    if _semantic_matcher is None:
        _semantic_matcher = SemanticMatcher()
    return _semantic_matcher
