import os
import joblib
import numpy as np
import pandas as pd
import shap


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "diabetes_model.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "scaler.pkl"
)


# =========================================================
# FEATURE NAMES
# =========================================================

FEATURE_NAMES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]


# =========================================================
# LOAD MODEL AND SCALER
# =========================================================

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


# =========================================================
# LOAD TRAINING DATA FOR SHAP BACKGROUND
# =========================================================

DATASET_PATH = os.path.join(
    BASE_DIR,
    "..",
    "..",
    "data",
    "diabetes.csv"
)

DATASET_PATH = os.path.abspath(DATASET_PATH)


def create_background_data():
    """
    Create background data using the same preprocessing
    applied during model training.
    """

    df = pd.read_csv(DATASET_PATH)

    # Replace impossible zero values
    zero_as_missing = [
        "Glucose",
        "BloodPressure",
        "SkinThickness",
        "Insulin",
        "BMI",
    ]

    for column in zero_as_missing:
        df[column] = df[column].replace(0, np.nan)
        df[column] = df[column].fillna(df[column].median())

    X = df[FEATURE_NAMES]

    # Apply the SAME scaler used during training
    X_scaled = scaler.transform(X)

    return X_scaled


# =========================================================
# CREATE SHAP LINEAR EXPLAINER
# =========================================================

background_data = create_background_data()

explainer = shap.LinearExplainer(
    model,
    background_data
)


# =========================================================
# GENERATE SHAP EXPLANATION
# =========================================================

def explain_prediction(patient_data: dict):
    """
    Generate SHAP feature contributions for one patient.
    """

    # -----------------------------------------------------
    # Create patient dataframe
    # -----------------------------------------------------

    input_data = pd.DataFrame(
        [[
            patient_data["Pregnancies"],
            patient_data["Glucose"],
            patient_data["BloodPressure"],
            patient_data["SkinThickness"],
            patient_data["Insulin"],
            patient_data["BMI"],
            patient_data["DiabetesPedigreeFunction"],
            patient_data["Age"],
        ]],
        columns=FEATURE_NAMES
    )

    # -----------------------------------------------------
    # Apply same scaler
    # -----------------------------------------------------

    input_scaled = scaler.transform(input_data)

    # -----------------------------------------------------
    # Calculate SHAP values
    # -----------------------------------------------------

    shap_values = explainer(input_scaled)

    values = shap_values.values

    # For one patient
    if values.ndim > 1:
        values = values[0]

    # -----------------------------------------------------
    # Build explanation
    # -----------------------------------------------------

    explanation = []

    for feature, value in zip(FEATURE_NAMES, values):

        explanation.append({
            "feature": feature,
            "shap_value": float(value),
            "impact": (
                "increases risk"
                if value > 0
                else "decreases risk"
            )
        })

    # -----------------------------------------------------
    # Sort by strongest impact
    # -----------------------------------------------------

    explanation.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    return explanation


# =========================================================
# TEST SHAP
# =========================================================

if __name__ == "__main__":

    sample_patient = {
        "Pregnancies": 6,
        "Glucose": 148,
        "BloodPressure": 72,
        "SkinThickness": 35,
        "Insulin": 80,
        "BMI": 33.6,
        "DiabetesPedigreeFunction": 0.627,
        "Age": 50,
    }

    result = explain_prediction(sample_patient)

    print("\n==============================")
    print("DiaFed AI - SHAP Explanation")
    print("==============================")

    for item in result:

        print(
            f"{item['feature']:30} "
            f"{item['shap_value']:+.4f} "
            f"-> {item['impact']}"
        )