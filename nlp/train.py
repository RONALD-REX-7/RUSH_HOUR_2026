"""
train.py
----------------------------
Train Spam Detection Model
"""

import os
import joblib
import pandas as pd

from preprocess import preprocess

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

# -----------------------------------
# Load Dataset
# -----------------------------------

DATASET = "dataset/complaints.csv"

df = pd.read_csv(DATASET)

print("Dataset Loaded")
print(df.head())

# -----------------------------------
# Preprocess Text
# -----------------------------------

df["text"] = df["text"].apply(preprocess)

# -----------------------------------
# Features and Labels
# -----------------------------------

X = df["text"]

y = df["label"]

# -----------------------------------
# Train Test Split
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)

# -----------------------------------
# TF-IDF + Logistic Regression
# -----------------------------------

model = Pipeline([

    (

        "tfidf",

        TfidfVectorizer(

            stop_words="english",

            max_features=5000,

            ngram_range=(1,2)

        )

    ),

    (

        "classifier",

        LogisticRegression(

            max_iter=1000,

            random_state=42

        )

    )

])

# -----------------------------------
# Train
# -----------------------------------

print("\nTraining Model...\n")

model.fit(

    X_train,

    y_train

)

print("Training Completed")

# -----------------------------------
# Prediction
# -----------------------------------

predictions = model.predict(X_test)

# -----------------------------------
# Evaluation
# -----------------------------------

accuracy = accuracy_score(

    y_test,

    predictions

)

precision = precision_score(

    y_test,

    predictions

)

recall = recall_score(

    y_test,

    predictions

)

f1 = f1_score(

    y_test,

    predictions

)

print("\n========== RESULTS ==========")

print(f"Accuracy : {accuracy:.2f}")

print(f"Precision: {precision:.2f}")

print(f"Recall   : {recall:.2f}")

print(f"F1 Score : {f1:.2f}")

print("\nConfusion Matrix")

print(confusion_matrix(

    y_test,

    predictions

))

print("\nClassification Report\n")

print(

    classification_report(

        y_test,

        predictions

    )

)

# -----------------------------------
# Save Model
# -----------------------------------

os.makedirs("../models", exist_ok=True)

joblib.dump(

    model,

    "../models/spam_detector.pkl"

)

print("\nModel Saved Successfully")

print("Location: models/spam_detector.pkl")