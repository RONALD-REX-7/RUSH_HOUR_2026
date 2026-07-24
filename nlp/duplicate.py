"""
duplicate.py
-------------------------------------
Semantic Duplicate Complaint Detection
"""

import pandas as pd

from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim

from preprocess import preprocess

# ---------------------------------------
# Load Sentence Transformer
# ---------------------------------------

print("Loading Sentence Transformer...")

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

print("Model Loaded")

# ---------------------------------------
# Load Existing Complaints
# ---------------------------------------

DATASET = "../dataset/complaints.csv"

df = pd.read_csv(DATASET)

df["text"] = df["text"].apply(preprocess)

complaints = df["text"].tolist()

# ---------------------------------------
# Create Embeddings
# ---------------------------------------

database_embeddings = model.encode(
    complaints,
    convert_to_tensor=True
)

# ---------------------------------------
# Duplicate Detection
# ---------------------------------------

def find_duplicate(new_title,
                   new_description,
                   threshold=0.80):

    new_text = new_title + " " + new_description

    new_text = preprocess(new_text)

    new_embedding = model.encode(
        new_text,
        convert_to_tensor=True
    )

    similarities = cos_sim(
        new_embedding,
        database_embeddings
    )[0]

    best_score = similarities.max().item()

    best_index = similarities.argmax().item()

    duplicate = best_score >= threshold

    return {

        "duplicate": duplicate,

        "similarity": round(best_score * 100,2),

        "matched_complaint":
            complaints[best_index]

    }

# ---------------------------------------
# Test
# ---------------------------------------

if __name__ == "__main__":

    while True:

        print("\nDuplicate Complaint Detection")

        title = input("Title : ")

        description = input("Description : ")

        result = find_duplicate(

            title,

            description

        )

        print("\nResult")

        print("---------------------")

        print("Duplicate :", result["duplicate"])

        print("Similarity:", result["similarity"], "%")

        print("Matched Complaint:")

        print(result["matched_complaint"])

        print("---------------------")