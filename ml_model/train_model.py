import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load dataset
data = pd.read_csv("roommate_compatibility_dataset.csv")

# Features (X) and Target (y) — matches the 8 survey questions from the frontend
X = data[[
    "cleanliness_diff",
    "social_diff",
    "sleep_diff",
    "guestPolicy_diff",
    "noise_diff",
    "cooking_diff",
    "workSchedule_diff",
    "petFriendly_diff"
]]

y = data["score"]

# Create model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Train model
model.fit(X, y)

# Save model
joblib.dump(model, "model.pkl")

print("✅ Model trained and saved as model.pkl")