# Roommate Compatibility Predictor 🤝

An AI-powered application that predicts compatibility scores between potential roommates based on their habits and preferences using a Random Forest machine learning model.

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
- Python 3.10 or higher
- `pip` (Python package installer)

### 2. Setup Virtual Environment
It is recommended to use a virtual environment to manage dependencies.

```powershell
# Create a virtual environment
python -m venv .venv

# Activate the environment (Windows)
.\.venv\Scripts\Activate.ps1

# Activate the environment (macOS/Linux)
# source .venv/bin/activate
```

### 3. Install Dependencies
Install the required Python packages:

```powershell
# In the activated virtual environment
pip install -r requirements.txt
```

### 4. Train the Machine Learning Model
Ensure `roommate_compatibility_dataset.csv` is in the root directory, then train the model:

```powershell
python train_model.py
```
This will generate a `model.pkl` file in your directory.

### 5. Run the Flask API
Start the backend server to handle compatibility predictions:

```powershell
python app.py
```
The server will start running at `http://127.0.0.1:5000`.

---

## 🛠 Testing with Postman

To test the compatibility score using Postman, follow these steps:

1.  **Open Postman** and click on the **+** button to create a new request.
2.  **Method**: Set the request method to `POST`.
3.  **URL**: Enter `http://127.0.0.1:5000/predict`.
4.  **Headers**:
    - Click the **Headers** tab.
    - Add a new key: `Content-Type` with value `application/json`.
5.  **Body**:
    - Click the **Body** tab.
    - Select the **raw** radio button.
    - Ensure the format dropdown (to the right of 'raw') is set to **JSON**.
    - Paste the following example JSON query:
    ```json
    {
      "sleep_diff": 0,
      "noise_diff": 1,
      "social_diff": 0,
      "profession_diff": 1,
      "foodie_diff": 0,
      "cleanliness_diff": 2
    }
    ```
6.  **Send**: Click the **Send** button.
7.  **Result**: You should see a response like this in the bottom pane:
    ```json
    {
      "score": 82.5,
      "status": "success"
    }
    ```

---

## 🎨 Design Note
This project is built with **CORS support**, making it ready for integration with modern frontend frameworks like React or Vite.

