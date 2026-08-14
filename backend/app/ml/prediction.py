"""Prediction and per-patient SHAP explanation using the latest global model."""
import os

import joblib
import numpy as np
import pandas as pd
import shap

from app.ml.federated import FEATURE_COLUMNS, GLOBAL_MODEL_PATH, GLOBAL_SCALER_PATH

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FALLBACK_MODEL_PATH = os.path.join(BASE_DIR, "saved_models", "diabetes_model.pkl")
FALLBACK_SCALER_PATH = os.path.join(BASE_DIR, "saved_models", "scaler.pkl")


def _artifacts():
    """Prefer the FedAvg model; retain the original model until first FL run."""
    model_path = str(GLOBAL_MODEL_PATH) if GLOBAL_MODEL_PATH.exists() else FALLBACK_MODEL_PATH
    scaler_path = str(GLOBAL_SCALER_PATH) if GLOBAL_SCALER_PATH.exists() else FALLBACK_SCALER_PATH
    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        raise FileNotFoundError("No model is available. Complete federated training first.")
    return joblib.load(model_path), joblib.load(scaler_path), GLOBAL_MODEL_PATH.exists()


def calculate_risk(probability: float):
    return "High" if probability >= 0.70 else "Moderate" if probability >= 0.40 else "Low"


def predict_diabetes_risk(glucose, bmi, age, blood_pressure, insulin=80.0, dpf=0.47, pregnancies=0, skin_thickness=20.0):
    input_data = pd.DataFrame([{
        "Pregnancies": pregnancies, "Glucose": glucose, "BloodPressure": blood_pressure,
        "SkinThickness": skin_thickness, "Insulin": insulin, "BMI": bmi,
        "DiabetesPedigreeFunction": dpf, "Age": age,
    }], columns=FEATURE_COLUMNS)
    model, scaler, is_global = _artifacts()
    scaled = scaler.transform(input_data)
    probability = float(model.predict_proba(scaled)[0, 1])
    prediction_value = int(model.predict(scaled)[0])
    # LinearExplainer produces genuine SHAP values for this fitted linear model.
    values = np.asarray(shap.LinearExplainer(model, np.zeros((1, len(FEATURE_COLUMNS)))).shap_values(scaled)).reshape(-1)
    explanation = []
    for feature, raw_value, shap_value in zip(FEATURE_COLUMNS, input_data.iloc[0], values):
        contribution = float(shap_value)
        direction = "positive" if contribution > 0 else "negative" if contribution < 0 else "neutral"
        explanation.append({
            "feature": feature, "value": round(float(raw_value), 3), "shap_value": round(contribution, 4),
            "val": f"{contribution:+.4f}", "direction": direction,
            "impact": "increases risk" if contribution > 0 else "decreases risk" if contribution < 0 else "no significant impact",
        })
    explanation.sort(key=lambda item: abs(item["shap_value"]), reverse=True)
    confidence = probability if prediction_value else 1 - probability
    return {
        "prediction": "Positive" if prediction_value else "Negative", "risk_level": calculate_risk(probability),
        "probability": round(probability, 4), "confidence": round(confidence * 100, 2),
        "shap_explanation": explanation, "model": "federated_global" if is_global else "baseline_local",
    }
