"""
Centralized baseline models for comparison with the federated model.

IMPORTANT:
These baseline models are used ONLY for research comparison.
They never participate in FedAvg or secure aggregation.

Current baseline algorithms:
1. Logistic Regression
2. Random Forest
3. Support Vector Machine (SVM)
"""

from __future__ import annotations

from time import perf_counter

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

from app.ml.federated import (
    FEATURE_COLUMNS,
    HOSPITALS,
    TARGET_COLUMN,
    _split_hospital_frame,
    calculate_classification_metrics,
)


# ============================================================
# COMMON CENTRALIZED BASELINE DATA
# ============================================================

def centralized_comparison_splits():
    """Create centralized baseline train/test datasets.

    The three hospital datasets are combined ONLY for baseline
    comparison experiments.

    This DOES NOT change the federated-learning pipeline.

    Federated learning still keeps:

        Hospital A -> local training
        Hospital B -> local training
        Hospital C -> local training

    For centralized baseline experiments, the corresponding
    training partitions are combined.

    The untouched test partitions are also combined separately.

    Therefore, all baseline models and the Global Federated Model
    are evaluated using the same held-out evaluation cohort.
    """

    local_splits = [
        _split_hospital_frame(hospital)
        for hospital in HOSPITALS
    ]

    # Combine only training partitions.
    train = pd.concat(
        [split[0] for split in local_splits],
        ignore_index=True
    )

    # Combine only untouched test partitions.
    test = pd.concat(
        [split[1] for split in local_splits],
        ignore_index=True
    )

    return train, test


# ============================================================
# 1. LOGISTIC REGRESSION BASELINE
# ============================================================

MODEL_NAME = "Centralized Logistic Regression"


def train_and_evaluate_logistic_regression(
    train: pd.DataFrame,
    test: pd.DataFrame
):
    """Train and evaluate centralized Logistic Regression.

    Logistic Regression is a linear classification algorithm.

    It estimates the probability that a patient belongs to the
    diabetes-positive class using the clinical features.

    It is used as a conventional centralized ML baseline.

    IMPORTANT:
        - Does NOT participate in FedAvg.
        - Does NOT use secure aggregation.
        - Does NOT receive hospital model updates.
    """

    # --------------------------------------------------------
    # Feature preparation
    # --------------------------------------------------------

    # StandardScaler standardizes each feature.
    #
    # The scaler is fitted ONLY on training data.
    # This prevents information leakage from the test dataset.
    scaler = StandardScaler()

    X_train = scaler.fit_transform(
        train[FEATURE_COLUMNS]
    )

    X_test = scaler.transform(
        test[FEATURE_COLUMNS]
    )

    # Target:
    # 0 = Non-Diabetic
    # 1 = Diabetic
    y_train = train[TARGET_COLUMN].to_numpy(dtype=int)

    y_test = test[TARGET_COLUMN].to_numpy(dtype=int)

    # --------------------------------------------------------
    # Logistic Regression model
    # --------------------------------------------------------

    model = LogisticRegression(
        random_state=42,
        max_iter=1000
    )

    # Measure actual training time.
    started_at = perf_counter()

    model.fit(
        X_train,
        y_train
    )

    training_time = perf_counter() - started_at

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    predictions = model.predict(
        X_test
    ).astype(int)

    # Probability of class 1.
    #
    # ROC-AUC must use probabilities rather than only
    # predicted 0/1 labels.
    probabilities = model.predict_proba(
        X_test
    )[:, 1]

    # --------------------------------------------------------
    # Dynamic classification metrics
    # --------------------------------------------------------

    metrics = calculate_classification_metrics(
        y_test,
        predictions,
        probabilities
    )

    metrics.pop("model", None)

    metrics["model_name"] = MODEL_NAME

    metrics["training_time"] = round(
        float(training_time),
        6
    )

    metrics["timestamp"] = metrics.pop(
        "evaluation_timestamp"
    )

    return model, metrics


def evaluate_logistic_regression_baseline():
    """Train and dynamically evaluate Logistic Regression."""

    train, test = centralized_comparison_splits()

    _, metrics = train_and_evaluate_logistic_regression(
        train,
        test
    )

    return metrics


# ============================================================
# 2. RANDOM FOREST BASELINE
# ============================================================

RANDOM_FOREST_MODEL_NAME = "Centralized Random Forest"


def train_and_evaluate_random_forest(
    train: pd.DataFrame,
    test: pd.DataFrame
):
    """Train and evaluate centralized Random Forest.

    Random Forest is an ensemble learning algorithm.

    It creates multiple decision trees and combines their
    predictions to produce the final classification.

    Unlike Logistic Regression, Random Forest does not require
    feature scaling because it is based on decision-tree splits.

    IMPORTANT:
        - Does NOT participate in FedAvg.
        - Does NOT use secure aggregation.
        - Used ONLY as a centralized research baseline.
    """

    # --------------------------------------------------------
    # Feature preparation
    # --------------------------------------------------------

    # Tree-based models do not require normalization/scaling.
    X_train = train[FEATURE_COLUMNS]

    X_test = test[FEATURE_COLUMNS]

    # Target:
    # 0 = Non-Diabetic
    # 1 = Diabetic
    y_train = train[TARGET_COLUMN].to_numpy(dtype=int)

    y_test = test[TARGET_COLUMN].to_numpy(dtype=int)

    # --------------------------------------------------------
    # Random Forest model
    # --------------------------------------------------------

    model = RandomForestClassifier(
        # Number of decision trees.
        n_estimators=100,

        # Makes results reproducible.
        random_state=42,

        # Single worker gives predictable behaviour in the
        # current project environment.
        n_jobs=1
    )

    # Measure actual training time.
    started_at = perf_counter()

    model.fit(
        X_train,
        y_train
    )

    training_time = perf_counter() - started_at

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    predictions = model.predict(
        X_test
    ).astype(int)

    # Probability of diabetes-positive class.
    #
    # Used by the common metric utility for ROC-AUC.
    probabilities = model.predict_proba(
        X_test
    )[:, 1]

    # --------------------------------------------------------
    # Dynamic classification metrics
    # --------------------------------------------------------

    metrics = calculate_classification_metrics(
        y_test,
        predictions,
        probabilities
    )

    metrics.pop("model", None)

    metrics["model_name"] = RANDOM_FOREST_MODEL_NAME

    metrics["training_time"] = round(
        float(training_time),
        6
    )

    metrics["timestamp"] = metrics.pop(
        "evaluation_timestamp"
    )

    return model, metrics


def evaluate_random_forest_baseline():
    """Train and dynamically evaluate Random Forest."""

    train, test = centralized_comparison_splits()

    _, metrics = train_and_evaluate_random_forest(
        train,
        test
    )

    return metrics


# ============================================================
# 3. SUPPORT VECTOR MACHINE (SVM) BASELINE
# ============================================================

SVM_MODEL_NAME = "Centralized SVM"


def train_and_evaluate_svm(
    train: pd.DataFrame,
    test: pd.DataFrame
):
    """Train and evaluate centralized Support Vector Machine.

    SVM (Support Vector Machine) is a supervised classification
    algorithm that attempts to find an optimal decision boundary
    between different classes.

    For this project we use an RBF (Radial Basis Function) kernel.

    The RBF kernel allows SVM to model non-linear relationships
    between clinical features and diabetes outcomes.

    IMPORTANT:
        SVM is a centralized comparison baseline only.

        It does NOT:
            - participate in FedAvg
            - receive federated model updates
            - send model parameters to the federated server
            - use secure aggregation

    The returned SVC model is trained directly using the same
    feature representation that is supplied during prediction.
    This ensures that:

        model.predict(test[FEATURE_COLUMNS])

    and:

        model.predict_proba(test[FEATURE_COLUMNS])

    produce the same predictions and probabilities used for
    calculating the evaluation metrics.
    """

    # --------------------------------------------------------
    # Feature preparation
    # --------------------------------------------------------

    # Keep the feature representation identical between:
    #
    #   1. model training
    #   2. model evaluation
    #   3. returned SVC predictions
    #
    # The unit tests directly call:
    #
    #     model.predict(test[FEATURE_COLUMNS])
    #
    # Therefore the SVC must be trained using this same
    # feature representation.
    X_train = train[FEATURE_COLUMNS]

    X_test = test[FEATURE_COLUMNS]

    # Target:
    # 0 = Non-Diabetic
    # 1 = Diabetic
    y_train = train[TARGET_COLUMN].to_numpy(dtype=int)

    y_test = test[TARGET_COLUMN].to_numpy(dtype=int)

    # --------------------------------------------------------
    # SVM model
    # --------------------------------------------------------

    model = SVC(
        # RBF allows non-linear decision boundaries.
        kernel="rbf",

        # Required because ROC-AUC uses probabilities.
        probability=True,

        # Makes the experiment reproducible.
        random_state=42
    )

    # --------------------------------------------------------
    # Training
    # --------------------------------------------------------

    started_at = perf_counter()

    model.fit(
        X_train,
        y_train
    )

    training_time = perf_counter() - started_at

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    predictions = model.predict(
        X_test
    ).astype(int)

    # --------------------------------------------------------
    # Probabilities
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        X_test
    )[:, 1]

    # --------------------------------------------------------
    # Dynamic classification metrics
    # --------------------------------------------------------

    metrics = calculate_classification_metrics(
        y_test,
        predictions,
        probabilities
    )

    # Never return internal model objects through the API.
    metrics.pop("model", None)

    metrics["model_name"] = SVM_MODEL_NAME

    # Actual measured SVM training time.
    metrics["training_time"] = round(
        float(training_time),
        6
    )

    # Keep timestamp naming consistent with the other
    # centralized baseline APIs.
    metrics["timestamp"] = metrics.pop(
        "evaluation_timestamp"
    )

    return model, metrics


def evaluate_svm_baseline():
    """Train and dynamically evaluate centralized SVM."""

    train, test = centralized_comparison_splits()

    _, metrics = train_and_evaluate_svm(
        train,
        test
    )

    return metrics