"""
Image Verification Module
"""

import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image

from tensorflow.keras.applications.mobilenet_v2 import (

    MobileNetV2,

    preprocess_input,

    decode_predictions

)

# ----------------------------------------

print("Loading MobileNetV2...")

model = MobileNetV2(

    weights="imagenet"

)

print("Model Loaded")

# ----------------------------------------

def classify_image(image_path):

    img = image.load_img(

        image_path,

        target_size=(224,224)

    )

    img = image.img_to_array(img)

    img = np.expand_dims(

        img,

        axis=0

    )

    img = preprocess_input(img)

    prediction = model.predict(img)

    results = decode_predictions(

        prediction,

        top=5

    )[0]

    predictions = []

    for item in results:

        predictions.append({

            "class": item[1],

            "confidence": round(

                float(item[2]) * 100,

                2

            )

        })

    return predictions


# ----------------------------------------

if __name__ == "__main__":

    path = input("Image Path : ")

    result = classify_image(path)

    print()

    for r in result:

        print(r)