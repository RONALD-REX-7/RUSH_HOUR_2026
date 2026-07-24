import os
import joblib
import pandas as pd
from typing import Tuple
from sklearn.ensemble import GradientBoostingRegressor

class DemandEstimator:
    def __init__(self, model_path: str):
        """Initialize demand estimator. Loads model if exists."""
        self.model_path = model_path
        self.model = None
        self._load_model()
        
        # Approximate weights for category criticality
        self.category_weights = {
            "Healthcare": 1.0,
            "Utilities": 0.9,
            "EV & Transport": 0.8,
            "Grocery & Retail": 0.7,
            "Education": 0.7,
            "Repair & Maintenance": 0.6,
            "Financial Services": 0.5,
            "Food & Restaurants": 0.4,
            "Recreation": 0.3,
            "Other": 0.2
        }

    def _load_model(self):
        """Load trained model from disk if it exists."""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None

    def _extract_features(self, category: str, report_count: int, population_estimate: int, nearest_alternative_km: float) -> pd.DataFrame:
        """Extract features for prediction."""
        weight = self.category_weights.get(category, 0.2)
        
        # Cap/normalize features roughly
        norm_report = min(report_count / 100.0, 1.0)
        norm_pop = min(population_estimate / 100000.0, 1.0)
        norm_dist = min(nearest_alternative_km / 50.0, 1.0)
        
        return pd.DataFrame([{
            'category_weight': weight,
            'norm_report': norm_report,
            'norm_pop': norm_pop,
            'norm_dist': norm_dist
        }])

    def estimate(self, category: str, report_count: int, population_estimate: int, nearest_alternative_km: float) -> Tuple[str, float]:
        """Estimate demand score and level."""
        if self.model is not None:
            try:
                features = self._extract_features(category, report_count, population_estimate, nearest_alternative_km)
                score = float(self.model.predict(features)[0])
                # Ensure score is in 0-1 range
                score = max(0.0, min(1.0, score))
            except Exception as e:
                print(f"Prediction error: {e}")
                score = self._rule_based_estimate(category, report_count, population_estimate, nearest_alternative_km)
        else:
            score = self._rule_based_estimate(category, report_count, population_estimate, nearest_alternative_km)
            
        level = self._map_score_to_level(score)
        return level, score

    def _rule_based_estimate(self, category: str, report_count: int, population_estimate: int, nearest_alternative_km: float) -> float:
        """Fallback rule-based estimation if model is not loaded."""
        features = self._extract_features(category, report_count, population_estimate, nearest_alternative_km).iloc[0]
        
        # Simple weighted sum
        score = (
            (features['category_weight'] * 0.3) +
            (features['norm_report'] * 0.4) +
            (features['norm_pop'] * 0.1) +
            (features['norm_dist'] * 0.2)
        )
        return float(max(0.0, min(1.0, score)))

    def _map_score_to_level(self, score: float) -> str:
        """Map score 0-1 to demand level."""
        if score <= 0.25:
            return 'low'
        elif score <= 0.5:
            return 'medium'
        elif score <= 0.75:
            return 'high'
        else:
            return 'critical'

    def train(self, data: pd.DataFrame):
        """
        Train the model using provided dataframe.
        Expects columns: category, report_count, population_estimate, nearest_alternative_km, actual_score
        """
        features_list = []
        for _, row in data.iterrows():
            feat = self._extract_features(
                row['category'], 
                row['report_count'], 
                row['population_estimate'], 
                row['nearest_alternative_km']
            )
            features_list.append(feat)
            
        X = pd.concat(features_list, ignore_index=True)
        y = data['actual_score']
        
        self.model = GradientBoostingRegressor()
        self.model.fit(X, y)
        
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
