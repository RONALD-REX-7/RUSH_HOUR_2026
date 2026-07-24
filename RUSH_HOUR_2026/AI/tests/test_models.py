import pytest
from models.categorizer import ProblemCategorizer
from models.duplicate_detector import DuplicateDetector
from models.demand_estimator import DemandEstimator

def test_categorizer_prediction():
    # Use fallback mode
    categorizer = ProblemCategorizer("fake_path.pkl", "fake_cat.json", "fake_stopwords.txt")
    # Provide mock categories since file doesn't exist
    categorizer.categories = [
        {"name": "Healthcare", "keywords": ["pharmacy", "medical", "hospital"]},
        {"name": "Education", "keywords": ["school", "library", "tutor"]}
    ]
    
    cat, conf = categorizer.predict("Need a pharmacy", "There is no hospital nearby.")
    assert cat == "Healthcare"
    assert 0.0 <= conf <= 1.0

def test_duplicate_detector():
    detector = DuplicateDetector(threshold=0.75)
    
    existing = [
        {"id": 1, "title": "Pothole on Main St", "description": "Huge pothole causing damage"},
        {"id": 2, "title": "Broken street light", "description": "Street light is out on Elm St"}
    ]
    
    # Exact duplicate
    res1 = detector.check_duplicate("Pothole on Main St", "Huge pothole causing damage", existing)
    assert res1["isDuplicate"] is True
    assert res1["duplicateId"] == 1
    assert res1["similarityScore"] > 0.9
    
    # Not a duplicate
    res2 = detector.check_duplicate("Need a new library", "We need more books", existing)
    assert res2["isDuplicate"] is False
    assert res2["duplicateId"] is None

def test_demand_estimator():
    estimator = DemandEstimator("fake_path.pkl")
    
    level, score = estimator.estimate("Healthcare", 50, 20000, 25.0)
    assert 0.0 <= score <= 1.0
    assert level in ['low', 'medium', 'high', 'critical']
