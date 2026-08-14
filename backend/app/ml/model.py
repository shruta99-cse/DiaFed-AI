import os
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)

from app.ml.preprocessing import preprocess_pipeline


# =========================================================
# PATHS
# =========================================================

DATASET_PATH = "data/diabetes.csv"

MODEL_DIR = "app/ml/saved_models"

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "diabetes_model.pkl"
)

SCALER_PATH = os.path.join(
    MODEL_DIR,
    "scaler.pkl"
)


# =========================================================
# TRAIN MODEL
# =========================================================

def train_model():

    print("\n==============================")
    print("DiaFed AI - Model Training")
    print("==============================")

    # -----------------------------------------------------
    # Preprocessing
    # -----------------------------------------------------

    (
        X_train,
        X_test,
        y_train,
        y_test,
        scaler,
    ) = preprocess_pipeline(DATASET_PATH)

    print("\nPreprocessing completed.")
    print("Training samples:", len(X_train))
    print("Testing samples :", len(X_test))

    # -----------------------------------------------------
    # Create Logistic Regression model
    # -----------------------------------------------------

    model = LogisticRegression(
        max_iter=1000,
        random_state=42
    )

    # -----------------------------------------------------
    # Train
    # -----------------------------------------------------

    print("\nTraining model...")

    model.fit(
        X_train,
        y_train
    )

    print("Model training completed.")

    # -----------------------------------------------------
    # Predictions
    # -----------------------------------------------------

    y_pred = model.predict(X_test)

    y_probability = model.predict_proba(X_test)[:, 1]

    # -----------------------------------------------------
    # Evaluation
    # -----------------------------------------------------

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

    auc = roc_auc_score(
        y_test,
        y_probability
    )

    print("\n==============================")
    print("MODEL PERFORMANCE")
    print("==============================")

    print(
        f"Accuracy : {accuracy * 100:.2f}%"
    )

    print(
        f"ROC-AUC  : {auc:.4f}"
    )

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            y_pred
        )
    )

    print("Confusion Matrix:")

    print(
        confusion_matrix(
            y_test,
            y_pred
        )
    )

    # -----------------------------------------------------
    # Create model directory
    # -----------------------------------------------------

    os.makedirs(
        MODEL_DIR,
        exist_ok=True
    )

    # -----------------------------------------------------
    # Save model
    # -----------------------------------------------------

    joblib.dump(
        model,
        MODEL_PATH
    )

    # -----------------------------------------------------
    # Save scaler
    # -----------------------------------------------------

    joblib.dump(
        scaler,
        SCALER_PATH
    )

    print("\n==============================")
    print("FILES SAVED")
    print("==============================")

    print(
        "Model:",
        MODEL_PATH
    )

    print(
        "Scaler:",
        SCALER_PATH
    )

    return model, scaler


# =========================================================
# LOAD SAVED MODEL
# =========================================================

def load_model():

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Trained model not found. "
            "Run train_model() first."
        )

    return joblib.load(
        MODEL_PATH
    )


def load_scaler():

    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(
            "Scaler not found. "
            "Run train_model() first."
        )

    return joblib.load(
        SCALER_PATH
    )


# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    train_model()