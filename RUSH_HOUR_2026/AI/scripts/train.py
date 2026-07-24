import os
import sys

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.categorizer import ProblemCategorizer

def train_categorizer():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    model_path = os.path.join(base_dir, "trained_models", "categorizer.pkl")
    categories_path = os.path.join(base_dir, "data", "categories.json")
    stop_words_path = os.path.join(base_dir, "data", "stop_words.txt")
    data_path = os.path.join(base_dir, "data", "training_data.csv")
    
    # Check if data exists, generate if not
    if not os.path.exists(data_path):
        print(f"Training data not found at {data_path}. Attempting to generate...")
        gen_script = os.path.join(base_dir, "scripts", "generate_data.py")
        if os.path.exists(gen_script):
            import generate_data
            generate_data.generate_csv(data_path)
            print("Generated training data.")
        else:
            print("Error: Could not find training data or generation script.")
            return

    print("Initializing categorizer...")
    categorizer = ProblemCategorizer(model_path, categories_path, stop_words_path)
    
    print("Training model...")
    try:
        categorizer.train(data_path)
        print("Training complete! Model saved to:", model_path)
        
        # Test it
        cat, conf = categorizer.predict("Need a pharmacy", "No medical supplies in the area.")
        print(f"Test Prediction: Category={cat}, Confidence={conf:.2f}")
    except Exception as e:
        print(f"Error during training: {e}")

if __name__ == "__main__":
    train_categorizer()
