import unittest
from unittest.mock import patch

import pandas as pd
from fastapi.testclient import TestClient
from sklearn.metrics import confusion_matrix, roc_auc_score
from sklearn.svm import SVC

from app.auth import get_current_user
from app.main import app
from app.ml.baselines import (
    SVM_MODEL_NAME,
    train_and_evaluate_svm,
)
from app.ml.federated import FEATURE_COLUMNS, TARGET_COLUMN


class SVMBaselineTests(unittest.TestCase):

    def setUp(self):
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
            columns=[*FEATURE_COLUMNS, TARGET_COLUMN]
        )

        self.train = frame.iloc[:24].copy()

        self.test = pd.concat(
            [
                frame.iloc[10:15],
                frame.iloc[25:30]
            ],
            ignore_index=True
        )

        self.model, self.result = train_and_evaluate_svm(
            self.train,
            self.test
        )

    def test_real_svm_is_trained(self):

        self.assertIsInstance(
            self.model,
            SVC
        )

        self.assertEqual(
            self.model.random_state,
            42
        )

        predictions = self.model.predict(
            self.test[FEATURE_COLUMNS]
        )

        self.assertEqual(
            len(predictions),
            len(self.test)
        )

    def test_metrics_are_dynamic_and_roc_auc_uses_probabilities(self):

        probabilities = self.model.predict_proba(
            self.test[FEATURE_COLUMNS]
        )[:, 1]

        expected_auc = roc_auc_score(
            self.test[TARGET_COLUMN],
            probabilities
        )

        self.assertAlmostEqual(
            self.result["roc_auc"],
            expected_auc
        )

        altered_test = self.test.copy()

        altered_test[TARGET_COLUMN] = (
            1 - altered_test[TARGET_COLUMN]
        )

        altered_result = train_and_evaluate_svm(
            self.train,
            altered_test
        )[1]

        self.assertNotEqual(
            self.result["accuracy"],
            altered_result["accuracy"]
        )

    def test_response_shape_and_confusion_matrix(self):

        required = {
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
            required.issubset(self.result)
        )

        self.assertEqual(
            self.result["model_name"],
            SVM_MODEL_NAME
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


class SVMBaselineEndpointTests(unittest.TestCase):

    def setUp(self):

        app.dependency_overrides[
            get_current_user
        ] = lambda: {"id": 1}

        self.client = TestClient(app)

    def tearDown(self):

        app.dependency_overrides.clear()

    def test_endpoint_returns_dynamic_baseline_payload(self):

        payload = {
            "model_name": SVM_MODEL_NAME,
            "accuracy": 0.78,
            "precision": 0.77,
            "recall": 0.52,
            "f1_score": 0.62,
            "roc_auc": 0.85,
            "confusion_matrix": [
                [93, 8],
                [25, 28]
            ],
            "true_negative": 93,
            "false_positive": 8,
            "false_negative": 25,
            "true_positive": 28,
            "evaluation_sample_count": 154,
            "training_time": 0.218,
            "timestamp": "2026-08-14T00:00:00+00:00",
        }

        with patch(
            "app.routes.baselines.evaluate_svm_baseline",
            return_value=payload
        ) as evaluate:

            response = self.client.get(
                "/api/baselines/svm"
            )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertEqual(
            response.json(),
            payload
        )

        evaluate.assert_called_once_with()

    def test_endpoint_converts_validation_errors_to_conflict(self):

        with patch(
            "app.routes.baselines.evaluate_svm_baseline",
            side_effect=ValueError("Missing upload")
        ):

            response = self.client.get(
                "/api/baselines/svm"
            )

        self.assertEqual(
            response.status_code,
            409
        )

        self.assertEqual(
            response.json()["detail"],
            "Missing upload"
        )


if __name__ == "__main__":
    unittest.main()