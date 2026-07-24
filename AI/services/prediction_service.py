import os
import random
from typing import Dict, Any, List

from models.categorizer import ProblemCategorizer
from models.duplicate_detector import DuplicateDetector
from models.demand_estimator import DemandEstimator

class PredictionService:
    def __init__(self):
        """Initialize unified prediction service."""
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        cat_model_path = os.path.join(base_dir, "trained_models", "categorizer.pkl")
        demand_model_path = os.path.join(base_dir, "trained_models", "demand_estimator.pkl")
        categories_path = os.path.join(base_dir, "data", "categories.json")
        stop_words_path = os.path.join(base_dir, "data", "stop_words.txt")
        
        self.categorizer = ProblemCategorizer(cat_model_path, categories_path, stop_words_path)
        self.detector = DuplicateDetector(stop_words_path)
        self.estimator = DemandEstimator(demand_model_path)

    def categorize(self, title: str, description: str) -> Dict[str, Any]:
        category, confidence = self.categorizer.predict(title, description)
        return {
            "category": category,
            "confidence": confidence
        }

    def check_duplicate(self, title: str, description: str, existing_reports: List[Dict[str, Any]]) -> Dict[str, Any]:
        return self.detector.check_duplicate(title, description, existing_reports)

    def estimate_demand(self, category: str, report_count: int, population_estimate: int, nearest_alternative_km: float) -> Dict[str, Any]:
        level, score = self.estimator.estimate(category, report_count, population_estimate, nearest_alternative_km)
        return {
            "demandLevel": level,
            "demandScore": score
        }

    def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Run all three models on the combined payload."""
        title = data.get("title", "")
        description = data.get("description", "")
        existing_reports = data.get("existingReports", [])
        report_count = data.get("reportCount", 1)
        population_estimate = data.get("populationEstimate", 50000)
        nearest_alternative_km = data.get("nearestAlternativeKm", 10.0)
        
        # 1. Categorize
        cat_result = self.categorize(title, description)
        category = cat_result["category"]
        
        # 2. Duplicate Check
        dup_result = self.check_duplicate(title, description, existing_reports)
        
        # 3. Demand Estimate
        # Allow category override if provided in payload
        est_cat = data.get("category", category)
        dem_result = self.estimate_demand(est_cat, report_count, population_estimate, nearest_alternative_km)
        
        return {
            "categorization": cat_result,
            "duplicateCheck": dup_result,
            "demandEstimation": dem_result
        }
