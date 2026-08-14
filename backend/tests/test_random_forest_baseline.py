import unittest
from unittest.mock import patch

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, roc_auc_score

from app.ml.baselines import (
    RANDOM_FOREST_MODEL_NAME,
    train_and_evaluate_random_forest,
)
from app.ml.federated import FEATURE_COLUMNS, TARGET_COLUMN
from app.routes.baselines import random_forest_baseline


class RandomForestBaselineTests(unittest.TestCase):

    def setUp(self):
        # Create a small deterministic dataset for testing.
        rows = []

        for index in range(30):
            values = [
                index % 5,
                80 + index * 3,
                65 + index,
                20 + index,
                70 + index * 4,
                22 + index / 2,
                0.2 + index / 100,
                25 + index,
            ]

            rows.append(
                values + [0 if index < 15 else 1]
            )

        frame = pd.DataFrame(
            rows,
            columns=[
                *FEATURE_COLUMNS,
                TARGET_COLUMN
            ]
        )

        self.train = frame.iloc[:24].copy()

        self.test = pd.concat(
            [
                frame.iloc[10:15],
                frame.iloc[25:30]
            ],
            ignore_index=True
        )

        self.model, self.result = (
            train_and_evaluate_random_forest(
                self.train,
                self.test
            )
        )

    # ---------------------------------------------------------
    # Test 1: Real Random Forest configuration
    # ---------------------------------------------------------

    def test_real_random_forest_is_trained_with_required_configuration(self):

        self.assertIsInstance(
            self.model,
            RandomForestClassifier
        )

        self.assertEqual(
            self.model.n_estimators,
            100
        )

        self.assertEqual(
            self.model.random_state,
            42
        )

        self.assertEqual(
            self.model.n_jobs,
            1
        )

        predictions = self.model.predict(
            self.test[FEATURE_COLUMNS]
        )

        self.assertEqual(
            len(predictions),
            len(self.test)
        )

    # ---------------------------------------------------------
    # Test 2: Dynamic metrics and ROC-AUC
    # ---------------------------------------------------------

    def test_metrics_are_dynamic_and_roc_auc_uses_probabilities(self):

        probabilities = self.model.predict_proba(
            self.test[FEATURE_COLUMNS]
        )[:, 1]

        expected_auc = roc_auc_score(
            self.test[TARGET_COLUMN],
            probabilities
        )

        self.assertEqual(
            self.result["roc_auc"],
            expected_auc
        )

        # Change the actual labels.
        altered_test = self.test.copy()

        altered_test[TARGET_COLUMN] = (
            1 - altered_test[TARGET_COLUMN]
        )

        altered_result = train_and_evaluate_random_forest(
            self.train,
            altered_test
        )[1]

        # Metrics must change when the evaluation labels change.
        self.assertNotEqual(
            self.result["accuracy"],
            altered_result["accuracy"]
        )

    # ---------------------------------------------------------
    # Test 3: Response fields and confusion matrix
    # ---------------------------------------------------------

    def test_response_shape_and_confusion_matrix(self):

        required_fields = {
            "model_name",
            "accuracy",
            "precision",
            "recall",
            "f1_score",
            "roc_auc",
            "confusion_matrix",
            "true_negative",
            "false_positive",
            "false_negative",
            "true_positive",
            "evaluation_sample_count",
            "training_time",
            "timestamp",
        }

        self.assertTrue(
            required_fields.issubset(
                self.result
            )
        )

        self.assertEqual(
            self.result["model_name"],
            RANDOM_FOREST_MODEL_NAME
        )

        predictions = self.model.predict(
            self.test[FEATURE_COLUMNS]
        )

        expected_matrix = confusion_matrix(
            self.test[TARGET_COLUMN],
            predictions,
            labels=[0, 1]
        ).tolist()

        self.assertEqual(
            self.result["confusion_matrix"],
            expected_matrix
        )

        self.assertEqual(
            self.result["evaluation_sample_count"],
            len(self.test)
        )


# =============================================================
# API ROUTE TESTS
# =============================================================

class RandomForestBaselineEndpointTests(unittest.TestCase):

    def test_endpoint_returns_dynamic_baseline_payload(self):

        payload = {
            "model_name": RANDOM_FOREST_MODEL_NAME,
            "accuracy": 0.8,
            "precision": 0.75,
            "recall": 0.7,
            "f1_score": 0.72,
            "roc_auc": 0.81,
            "confusion_matrix": [
                [4, 1],
                [2, 3]
            ],
            "true_negative": 4,
            "false_positive": 1,
            "false_negative": 2,
            "true_positive": 3,
            "evaluation_sample_count": 10,
            "training_time": 0.123,
            "timestamp": "2026-08-14T00:00:00+00:00",
        }

        with patch(
            "app.routes.baselines.evaluate_random_forest_baseline",
            return_value=payload
        ) as evaluate:

            response = random_forest_baseline(
                current_user={"id": 1}
            )

        self.assertEqual(
            response,
            payload
        )

        evaluate.assert_called_once_with()


if __name__ == "__main__":
    unittest.main()