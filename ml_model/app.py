from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model
model = joblib.load("model.pkl")

# Feature names must match the 8 survey questions from the frontend
FEATURE_NAMES = [
    "cleanliness_diff",
    "social_diff",
    "sleep_diff",
    "guestPolicy_diff",
    "noise_diff",
    "cooking_diff",
    "workSchedule_diff",
    "petFriendly_diff"
]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Roommate Compatibility API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        # Create DataFrame with matching feature names to avoid UserWarning
        features_df = pd.DataFrame([[
            data["cleanliness_diff"],
            data["social_diff"],
            data["sleep_diff"],
            data["guestPolicy_diff"],
            data["noise_diff"],
            data["cooking_diff"],
            data["workSchedule_diff"],
            data["petFriendly_diff"]
        ]], columns=FEATURE_NAMES)

        prediction = model.predict(features_df)[0]

        return jsonify({
            "score": round(float(prediction), 2),
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 400

if __name__ == "__main__":
    app.run(debug=True, port=5001)