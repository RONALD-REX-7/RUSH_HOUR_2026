"""
Priority Prediction Module
"""

from nlp.preprocess import preprocess

# -------------------------------
# Keywords
# -------------------------------

HIGH_PRIORITY = [

    "fire",
    "accident",
    "gas leak",
    "electric shock",
    "electrocution",
    "collapsed bridge",
    "collapsed road",
    "hospital",
    "ambulance",
    "emergency",
    "live wire",
    "short circuit",
    "explosion"

]

MEDIUM_PRIORITY = [

    "garbage",
    "overflow",
    "drainage",
    "water leakage",
    "street light",
    "pothole",
    "broken road",
    "damaged road",
    "traffic signal",
    "sewage"

]

LOW_PRIORITY = [

    "painting",
    "cleaning",
    "dustbin",
    "park",
    "garden",
    "bench",
    "sign board"

]

# -------------------------------
# Predict Priority
# -------------------------------

def predict_priority(title,
                     description):

    text = preprocess(title + " " + description)

    # High Priority

    for word in HIGH_PRIORITY:

        if word in text:

            return {

                "priority": "High",

                "reason": word

            }

    # Medium Priority

    for word in MEDIUM_PRIORITY:

        if word in text:

            return {

                "priority": "Medium",

                "reason": word

            }

    # Low Priority

    for word in LOW_PRIORITY:

        if word in text:

            return {

                "priority": "Low",

                "reason": word

            }

    return {

        "priority": "Medium",

        "reason": "No keyword matched"

    }


# -------------------------------
# Test
# -------------------------------

if __name__ == "__main__":

    title = input("Title : ")

    description = input("Description : ")

    result = predict_priority(

        title,

        description

    )

    print("\nPrediction")

    print("-------------------")

    print("Priority :", result["priority"])

    print("Reason   :", result["reason"])