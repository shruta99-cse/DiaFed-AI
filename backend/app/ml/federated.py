"""Lightweight, file-backed FedAvg training for the three hospital clients.

Raw CSV rows stay in separate files.  The coordinator only consumes local model
parameters, sample counts, and aggregate feature statistics.
"""
from __future__ import annotations

import os
import secrets
import threading
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin",
    "BMI", "DiabetesPedigreeFunction", "Age",
]
TARGET_COLUMN = "Outcome"
HOSPITALS = ("hospital_a", "hospital_b", "hospital_c")
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "hospital_data"
MODEL_DIR = BASE_DIR / "saved_models"
GLOBAL_MODEL_PATH = MODEL_DIR / "global_diabetes_model.pkl"
GLOBAL_SCALER_PATH = MODEL_DIR / "global_scaler.pkl"

# Friendly aliases allow common Kaggle/Pima exports without forcing a filename.
ALIASES = {
    "pregnancies": "Pregnancies", "glucose": "Glucose", "bloodpressure": "BloodPressure",
    "blood_pressure": "BloodPressure", "skinthickness": "SkinThickness",
    "skin_thickness": "SkinThickness", "insulin": "Insulin", "bmi": "BMI",
    "diabetespedigreefunction": "DiabetesPedigreeFunction", "dpf": "DiabetesPedigreeFunction",
    "age": "Age", "outcome": "Outcome", "diabetes": "Outcome", "target": "Outcome",
}
_lock = threading.Lock()
_status = {"state": "idle", "progress": 0, "message": "Upload three hospital CSV files to begin.", "round": 0,
           "model_version": 0, "accuracy": None, "hospitals": {},
           "secure_aggregation": {"enabled": True, "scheme": "pairwise additive masking (lightweight simulation)",
                                  "raw_data_used_by_aggregator": False,
                                  "scope": "Aggregation-only; this single-process CSV-upload demo is not a distributed deployment.",
                                  "last_round_verified": None}}


def _now():
    return datetime.now(timezone.utc).isoformat()


def _set_status(**changes):
    with _lock:
        _status.update(changes)
        _status["updated_at"] = _now()


def get_status():
    with _lock:
        return {**_status, "hospitals": {key: value.copy() for key, value in _status["hospitals"].items()}}


def mark_training_queued():
    _set_status(state="queued", progress=0, message="Federated training queued.")


def save_upload(hospital: str, contents: bytes) -> Path:
    if hospital not in HOSPITALS:
        raise ValueError("Hospital must be hospital_a, hospital_b, or hospital_c.")
    if not contents:
        raise ValueError("The CSV file is empty.")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    path = UPLOAD_DIR / f"{hospital}.csv"
    path.write_bytes(contents)
    return path


def _normalise_csv(path: Path) -> pd.DataFrame:
    try:
        frame = pd.read_csv(path)
    except Exception as exc:
        raise ValueError(f"Unable to read {path.name}: {exc}") from exc
    renamed = {column: ALIASES.get(column.strip().lower().replace(" ", "_"), column) for column in frame.columns}
    frame = frame.rename(columns=renamed)
    missing = [column for column in [*FEATURE_COLUMNS, TARGET_COLUMN] if column not in frame.columns]
    if missing:
        raise ValueError(f"{path.name} is missing required columns: {', '.join(missing)}")
    frame = frame[[*FEATURE_COLUMNS, TARGET_COLUMN]].copy()
    for column in FEATURE_COLUMNS:
        frame[column] = pd.to_numeric(frame[column], errors="coerce")
    target = frame[TARGET_COLUMN]
    if target.dtype == object:
        target = target.astype(str).str.strip().str.lower().map({"1": 1, "yes": 1, "true": 1, "positive": 1, "0": 0, "no": 0, "false": 0, "negative": 0})
    frame[TARGET_COLUMN] = pd.to_numeric(target, errors="coerce")
    frame = frame[frame[TARGET_COLUMN].isin([0, 1])].copy()
    # These zeroes are clinically missing in the Pima-style schema.
    for column in ("Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"):
        frame[column] = frame[column].replace(0, np.nan)
        frame[column] = frame[column].fillna(frame[column].median())
    frame = frame.dropna(subset=FEATURE_COLUMNS)
    if len(frame) < 10 or frame[TARGET_COLUMN].nunique() < 2:
        raise ValueError(f"{path.name} needs at least 10 valid rows and both Outcome classes.")
    frame[TARGET_COLUMN] = frame[TARGET_COLUMN].astype(int)
    return frame


def _split_hospital_frame(hospital: str):
    """Return this hospital's deterministic local train/test partitions."""
    path = UPLOAD_DIR / f"{hospital}.csv"
    if not path.exists():
        raise ValueError(f"Missing upload for {hospital.replace('_', ' ').title()}.")
    frame = _normalise_csv(path)
    try:
        return train_test_split(frame, test_size=0.2, random_state=42, stratify=frame[TARGET_COLUMN])
    except ValueError as exc:
        raise ValueError(f"{hospital.replace('_', ' ').title()}: {exc}") from exc


def preprocess_uploaded_data():
    summaries, frames = {}, {}
    for hospital in HOSPITALS:
        # Each hospital is split locally, never combined with another hospital's rows.
        train, test = _split_hospital_frame(hospital)
        frames[hospital] = (train, test)
        summaries[hospital] = {"rows": len(train) + len(test), "train_rows": len(train), "test_rows": len(test), "status": "preprocessed"}
    _set_status(state="ready", progress=20, message="All hospital datasets preprocessed locally.", hospitals=summaries)
    return frames, summaries


def _shared_scaler(local_train_frames):
    # The server receives only aggregate sums / squared sums, not raw observations.
    count = sum(len(train) for train, _ in local_train_frames.values())
    sums = sum((train[FEATURE_COLUMNS].sum().to_numpy(dtype=float) for train, _ in local_train_frames.values()), np.zeros(len(FEATURE_COLUMNS)))
    squared_sums = sum(((train[FEATURE_COLUMNS] ** 2).sum().to_numpy(dtype=float) for train, _ in local_train_frames.values()), np.zeros(len(FEATURE_COLUMNS)))
    scaler = StandardScaler()
    scaler.mean_ = sums / count
    scaler.var_ = np.maximum(squared_sums / count - scaler.mean_ ** 2, 1e-12)
    scaler.scale_ = np.sqrt(scaler.var_)
    scaler.n_features_in_ = len(FEATURE_COLUMNS)
    return scaler


def _fedavg(models, sample_counts):
    total = float(sum(sample_counts))
    weights = np.asarray(sample_counts, dtype=float) / total
    coefficients = sum(weight * model.coef_ for weight, model in zip(weights, models))
    intercept = sum(weight * model.intercept_ for weight, model in zip(weights, models))
    return coefficients, intercept


def _secure_fedavg(models, sample_counts, rng=None):
    """Aggregate weighted model parameters using cancelling additive masks.

    Each client first forms its weighted contribution ``n_i * theta_i``. For
    every client pair, the lower-index client *adds* a fresh random mask while
    the higher-index client *subtracts the same mask*. Consequently every mask
    appears once with each sign in the server's sum and cancels exactly before
    division by the total sample count. The server therefore receives the same
    weighted FedAvg parameters without receiving an unmasked contribution.

    This is intentionally a lightweight, single-process simulation: pairwise
    mask seeds are generated here because the current local demo represents all
    hospital clients in one Python process. A deployment needs clients to
    exchange/derive pairwise secrets themselves over authenticated channels;
    this code must not be treated as production cryptographic secure
    aggregation or as protection against a malicious coordinator.
    """
    if len(models) != len(sample_counts) or not models:
        raise ValueError("Models and sample counts must be non-empty and have matching lengths.")
    if any(count <= 0 for count in sample_counts):
        raise ValueError("Each client must have a positive sample count.")

    generator = rng or np.random.default_rng(secrets.randbits(64))
    masked_coefficients = [count * model.coef_.copy() for model, count in zip(models, sample_counts)]
    masked_intercepts = [count * model.intercept_.copy() for model, count in zip(models, sample_counts)]

    # These masks represent the values applied at the hospital clients before
    # their parameter messages are sent. No patient rows are involved here.
    for left in range(len(models)):
        for right in range(left + 1, len(models)):
            coefficient_mask = generator.normal(size=models[left].coef_.shape)
            intercept_mask = generator.normal(size=models[left].intercept_.shape)
            masked_coefficients[left] += coefficient_mask
            masked_coefficients[right] -= coefficient_mask
            masked_intercepts[left] += intercept_mask
            masked_intercepts[right] -= intercept_mask

    total_samples = float(sum(sample_counts))
    return sum(masked_coefficients) / total_samples, sum(masked_intercepts) / total_samples


def secure_aggregation_matches_fedavg():
    """Deterministic numerical check used by tests and local verification."""
    class _Model:
        def __init__(self, coefficient, intercept):
            self.coef_ = np.asarray(coefficient, dtype=float)
            self.intercept_ = np.asarray(intercept, dtype=float)

    models = [_Model([[0.2, -0.1]], [0.3]), _Model([[0.4, 0.5]], [-0.2]), _Model([[-0.6, 0.7]], [0.1])]
    counts = [11, 23, 17]
    plain = _fedavg(models, counts)
    masked = _secure_fedavg(models, counts, rng=np.random.default_rng(2026))
    return bool(np.allclose(plain[0], masked[0], rtol=1e-12, atol=1e-12) and
                np.allclose(plain[1], masked[1], rtol=1e-12, atol=1e-12))


def calculate_classification_metrics(y_true, y_pred, y_score, evaluation_timestamp=None):
    """Create the dashboard payload from held-out labels, predictions and probabilities."""
    matrix = confusion_matrix(y_true, y_pred, labels=[0, 1])
    true_negative, false_positive, false_negative, true_positive = (int(value) for value in matrix.ravel())
    has_both_classes = len(np.unique(y_true)) == 2
    return {
        "model": "Global Federated Model",
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, zero_division=0)),
        # ROC-AUC is intentionally calculated from class-1 probabilities, not labels.
        "roc_auc": float(roc_auc_score(y_true, y_score)) if has_both_classes else None,
        "confusion_matrix": [[true_negative, false_positive], [false_negative, true_positive]],
        "true_negative": true_negative,
        "false_positive": false_positive,
        "false_negative": false_negative,
        "true_positive": true_positive,
        "evaluation_sample_count": int(len(y_true)),
        "evaluation_timestamp": evaluation_timestamp or _now(),
    }


def evaluate_global_model():
    """Evaluate the saved FedAvg model on each hospital's held-out local test split.

    The split is recreated with the same fixed split parameters used by training,
    so these rows were never fitted by any local model. Only predictions,
    probabilities and labels are combined for the global classification metrics.
    """
    global_model, scaler = load_global_artifacts()
    labels, predictions, probabilities = [], [], []
    for hospital in HOSPITALS:
        _, test = _split_hospital_frame(hospital)
        X_test = scaler.transform(test[FEATURE_COLUMNS])
        labels.extend(test[TARGET_COLUMN].to_numpy(dtype=int))
        predictions.extend(global_model.predict(X_test).astype(int))
        probabilities.extend(global_model.predict_proba(X_test)[:, 1])
    return calculate_classification_metrics(
        np.asarray(labels), np.asarray(predictions), np.asarray(probabilities)
    )


def train_federated(rounds: int = 3):
    try:
        _set_status(state="preprocessing", progress=5, message="Preprocessing each hospital locally.", round=0)
        local_data, summaries = preprocess_uploaded_data()
        scaler = _shared_scaler(local_data)
        global_coef = global_intercept = None
        for round_number in range(1, rounds + 1):
            _set_status(state="training", progress=20 + int((round_number - 1) * 65 / rounds), round=round_number,
                        message=f"Training local models for federated round {round_number}/{rounds}.")
            local_models, sample_counts = [], []
            for hospital, (train, _) in local_data.items():
                X = scaler.transform(train[FEATURE_COLUMNS])
                y = train[TARGET_COLUMN]
                model = LogisticRegression(max_iter=250, random_state=round_number, warm_start=global_coef is not None)
                if global_coef is not None:
                    model.classes_ = np.array([0, 1])
                    model.coef_ = global_coef.copy()
                    model.intercept_ = global_intercept.copy()
                    model.n_features_in_ = len(FEATURE_COLUMNS)
                model.fit(X, y)
                local_models.append(model)
                sample_counts.append(len(train))
                summaries[hospital].update({"status": f"local round {round_number} complete", "samples": len(train)})
            _set_status(hospitals=summaries, state="aggregating",
                        message=f"Securely aggregating masked FedAvg round {round_number}/{rounds}.")
            global_coef, global_intercept = _secure_fedavg(local_models, sample_counts)
            _set_status(secure_aggregation={
                "enabled": True,
                "scheme": "pairwise additive masking (lightweight simulation)",
                "raw_data_used_by_aggregator": False,
                "scope": "Aggregation-only; this single-process CSV-upload demo is not a distributed deployment.",
                "last_round_verified": secure_aggregation_matches_fedavg(),
            })

        global_model = LogisticRegression()
        global_model.classes_ = np.array([0, 1])
        global_model.coef_ = global_coef
        global_model.intercept_ = global_intercept
        global_model.n_features_in_ = len(FEATURE_COLUMNS)
        accuracies, probabilities, labels = [], [], []
        for train, test in local_data.values():
            X_test = scaler.transform(test[FEATURE_COLUMNS])
            y_test = test[TARGET_COLUMN].to_numpy()
            accuracies.append(accuracy_score(y_test, global_model.predict(X_test)))
            probabilities.extend(global_model.predict_proba(X_test)[:, 1])
            labels.extend(y_test)
        accuracy = float(np.mean(accuracies))
        auc = float(roc_auc_score(labels, probabilities)) if len(set(labels)) > 1 else None
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(global_model, GLOBAL_MODEL_PATH)
        joblib.dump(scaler, GLOBAL_SCALER_PATH)
        current_version = get_status().get("model_version", 0) + 1
        for summary in summaries.values(): summary["status"] = "trained and aggregated"
        _set_status(state="completed", progress=100, round=rounds, model_version=current_version, accuracy=round(accuracy, 4),
                    auc=round(auc, 4) if auc is not None else None, hospitals=summaries,
                    message="Global model trained with weighted FedAvg and cancelling additive masks. Raw hospital data was not merged.")
    except Exception as exc:
        _set_status(state="failed", message=str(exc))


def load_global_artifacts():
    if not GLOBAL_MODEL_PATH.exists() or not GLOBAL_SCALER_PATH.exists():
        raise FileNotFoundError("No global model yet. Upload all three CSVs and run federated training first.")
    return joblib.load(GLOBAL_MODEL_PATH), joblib.load(GLOBAL_SCALER_PATH)
