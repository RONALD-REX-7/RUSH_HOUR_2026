import os
import json
import joblib
import pandas as pd
from typing import Tuple, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from services.text_processor import TextProcessor

class ProblemCategorizer:
    def __init__(self, model_path: str, categories_path: str, stop_words_path: str = None):
        """Initialize categorizer. Loads model if exists."""
        self.model_path = model_path
        self.categories_path = categories_path
        self.text_processor = TextProcessor(stop_words_path)
        self.model = None
        self.categories = []
        
        self._load_categories()
        self._load_model()

    def _load_categories(self):
        """Load categories from JSON for fallback matching."""
        if os.path.exists(self.categories_path):
            with open(self.categories_path, 'r', encoding='utf-8') as f:
                self.categories = json.load(f)

    def _load_model(self):
        """Load trained model from disk if it exists."""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None

    def train(self, data_path: str):
        """Train the model using data from CSV."""
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Training data not found at {data_path}")
            
        df = pd.read_csv(data_path)
        
        # Combine and preprocess text
        df['processed_text'] = df.apply(
            lambda row: self.text_processor.combine_text_fields(row.get('title', ''), row.get('description', '')), 
            axis=1
        )
        
        # Create pipeline
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer()),
            ('clf', MultinomialNB())
        ])
        
        # Train
        self.model.fit(df['processed_text'], df['category'])
        
        # Save
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)

    def predict(self, title: str, description: str) -> Tuple[str, float]:
        """Predict category and confidence for a given title and description."""
        text = self.text_processor.combine_text_fields(title, description)
        
        if self.model is not None:
            # Predict using model
            try:
                category = self.model.predict([text])[0]
                proba = self.model.predict_proba([text])[0]
                confidence = float(max(proba))
                return category, confidence
            except Exception as e:
                print(f"Prediction error: {e}")
                # Fallback on error
                
        # Rule-based fallback
        return self._rule_based_predict(text)

    def _rule_based_predict(self, text: str) -> Tuple[str, float]:
        """Fallback keyword-matching if model is not loaded."""
        best_category = "Other"
        max_matches = 0
        
        text_words = set(text.split())
        
        for cat in self.categories:
            keywords = set(cat.get("keywords", []))
            matches = len(text_words.intersection(keywords))
            if matches > max_matches:
                max_matches = matches
                best_category = cat.get("name", "Other")
                
        # Calculate a pseudo-confidence
        confidence = min(0.4 + (max_matches * 0.1), 0.95) if max_matches > 0 else 0.5
        return best_category, confidence
