import re
import os

class TextProcessor:
    def __init__(self, stop_words_path: str = None):
        """Initialize the text processor and load stop words."""
        self.stop_words = set()
        if stop_words_path and os.path.exists(stop_words_path):
            with open(stop_words_path, 'r', encoding='utf-8') as f:
                self.stop_words = set(word.strip().lower() for word in f if word.strip())

    def preprocess_text(self, text: str) -> str:
        """
        Preprocess input text: lowercase, remove special chars, 
        remove extra whitespace, and remove stop words.
        """
        if not text:
            return ""
            
        # Lowercase
        text = text.lower()
        
        # Remove special characters and numbers (keep only letters and spaces)
        text = re.sub(r'[^a-z\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove stop words
        if self.stop_words:
            words = text.split()
            words = [w for w in words if w not in self.stop_words]
            text = ' '.join(words)
            
        return text

    def combine_text_fields(self, title: str, description: str) -> str:
        """Combine title and description for feature extraction."""
        t = title if title else ""
        d = description if description else ""
        combined = f"{t} {d}".strip()
        return self.preprocess_text(combined)
