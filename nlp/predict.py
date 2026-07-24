"""
predict.py
------------------------------
Spam Prediction Module
"""

import joblib
import os

from preprocess import preprocess

# -----------------------------------------
# Load Trained Model
# -----------------------------------------

MODEL_PATH = "../models/spam_detector.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "Model not found! Run train.py first."
    )

model = joblib.load(MODEL_PATH)

print("Model Loaded Successfully")

# -----------------------------------------
# Predict Function
# -----------------------------------------

def predict_complaint(title, description):

    # Combine title and description
    text = title + " " + description

    # Clean text
    text = preprocess(text)

    # Prediction
    prediction = model.predict([text])[0]

    # Probability
    probability = model.predict_proba([text])[0]

    confidence = round(max(probability) * 100, 2)

    if prediction == 0:
        status = "Genuine"
    else:
        status = "Spam"

    return {
        "status": status,
        "confidence": confidence
    }

# -----------------------------------------
# Test
# -----------------------------------------

if __name__ == "__main__":

    while True:

        print("\nComplaint Verification")

        title = input("Title : ")

        description = input("Description : ")

        result = predict_complaint(
            title,
            description
        )

        print("\nResult")
        print("----------------")

        print("Status      :", result["status"])
        print("Confidence  :", result["confidence"], "%")

        print("----------------")