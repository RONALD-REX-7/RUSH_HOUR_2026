from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.text_processor import TextProcessor

class DuplicateDetector:
    def __init__(self, stop_words_path: str = None, threshold: float = 0.75):
        """Initialize duplicate detector."""
        self.vectorizer = TfidfVectorizer()
        self.text_processor = TextProcessor(stop_words_path)
        self.threshold = threshold

    def check_duplicate(self, title: str, description: str, existing_reports: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Check if a new report is a duplicate of any existing reports.
        existing_reports format: [{'id': 1, 'title': '...', 'description': '...'}, ...]
        """
        if not existing_reports:
            return {
                "isDuplicate": False,
                "duplicateId": None,
                "similarityScore": 0.0
            }
            
        # Process the new report
        new_text = self.text_processor.combine_text_fields(title, description)
        if not new_text:
            return {
                "isDuplicate": False,
                "duplicateId": None,
                "similarityScore": 0.0
            }
            
        # Process existing reports
        processed_existing = []
        valid_reports = []
        for report in existing_reports:
            rep_title = report.get('title', '')
            rep_desc = report.get('description', '')
            proc_text = self.text_processor.combine_text_fields(rep_title, rep_desc)
            if proc_text:
                processed_existing.append(proc_text)
                valid_reports.append(report)
                
        if not processed_existing:
            return {
                "isDuplicate": False,
                "duplicateId": None,
                "similarityScore": 0.0
            }

        # Compute TF-IDF
        all_texts = [new_text] + processed_existing
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        except ValueError:
            # Vectorizer throws error if empty vocabulary
            return {
                "isDuplicate": False,
                "duplicateId": None,
                "similarityScore": 0.0
            }
            
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Find best match
        best_match_idx = int(cosine_sim.argmax())
        best_score = float(cosine_sim[best_match_idx])
        
        is_duplicate = best_score >= self.threshold
        duplicate_id = valid_reports[best_match_idx].get('id') if is_duplicate else None
        
        return {
            "isDuplicate": is_duplicate,
            "duplicateId": duplicate_id,
            "similarityScore": best_score
        }
