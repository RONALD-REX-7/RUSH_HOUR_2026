"""
Category Validation Module
"""

from nlp.preprocess import preprocess

# -------------------------------------
# Category Keywords
# -------------------------------------

CATEGORY_KEYWORDS = {

    "Road Damage": [
        "road",
        "pothole",
        "crack",
        "damaged road",
        "bridge",
        "highway",
        "road collapse"
    ],

    "Waste Management": [
        "garbage",
        "trash",
        "waste",
        "dustbin",
        "litter",
        "overflowing garbage"
    ],

    "Water Leakage": [
        "water",
        "pipe",
        "leak",
        "leakage",
        "tap",
        "burst pipe"
    ],

    "Street Light": [
        "street light",
        "lamp",
        "pole",
        "light",
        "electric pole"
    ],

    "Drainage": [
        "drain",
        "drainage",
        "sewage",
        "blocked drain",
        "overflow"
    ],

    "Electricity": [
        "power",
        "electricity",
        "wire",
        "transformer",
        "current",
        "short circuit"
    ]
}

# -------------------------------------
# Validate Category
# -------------------------------------

def validate_category(title,
                      description,
                      selected_category):

    text = preprocess(title + " " + description)

    score = {}

    for category, keywords in CATEGORY_KEYWORDS.items():

        count = 0

        for word in keywords:

            if word in text:
                count += 1

        score[category] = count

    predicted_category = max(score, key=score.get)

    matched = (
        predicted_category.lower()
        ==
        selected_category.lower()
    )

    confidence = (
        score[predicted_category]
        /
        max(len(CATEGORY_KEYWORDS[predicted_category]), 1)
    ) * 100

    return {

        "selected_category": selected_category,

        "predicted_category": predicted_category,

        "category_match": matched,

        "confidence": round(confidence,2)

    }

# -------------------------------------
# Testing
# -------------------------------------

if __name__ == "__main__":

    title = input("Title : ")

    description = input("Description : ")

    category = input("Selected Category : ")

    result = validate_category(

        title,

        description,

        category

    )

    print(result)