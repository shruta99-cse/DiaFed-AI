import unittest

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, roc_auc_score

from app.ml.baselines import MODEL_NAME, train_and_evaluate_logistic_regression
from app.ml.federated import FEATURE_COLUMNS, TARGET_COLUMN


class LogisticRegressionBaselineTests(unittest.TestCase):
    def setUp(self):
        # A deterministic separable clinical-style dataset keeps this unit test
        # independent of uploaded hospital files while exercising real training.
        rows = []
        for index in range(20):
            values = [index % 4, 80 + index * 2, 65 + index, 20 + index, 70 + index * 3, 22 + index / 2, 0.2 + index / 100, 25 + index]
            rows.append(values + [0 if index < 10 else 1])
        frame = pd.DataFrame(rows, columns=[*FEATURE_COLUMNS, TARGET_COLUMN])
        self.train = frame.iloc[:16].copy()
        # Ensure both outcome classes exist in the held-out data.
        self.test = pd.concat([frame.iloc[8:10], frame.iloc[18:20]], ignore_index=True)
        self.model, self.result = train_and_evaluate_logistic_regression(self.train, self.test)

    def test_real_logistic_regression_is_trained_and_predicts(self):
        self.assertIsInstance(self.model, LogisticRegression)
        self.assertEqual(len(self.model.predict(self.test[FEATURE_COLUMNS])), len(self.test))

    def test_metrics_are_dynamic_and_roc_auc_uses_probabilities(self):
        expected_auc = roc_auc_score(
            self.test[TARGET_COLUMN],
            self.model.predict_proba(StandardizedTestData(self.train, self.test))[..., 1],
        )
        self.assertEqual(self.result["roc_auc"], expected_auc)
        altered_test = self.test.copy()
        altered_test[TARGET_COLUMN] = 1 - altered_test[TARGET_COLUMN]
        altered_result = train_and_evaluate_logistic_regression(self.train, altered_test)[1]
        self.assertNotEqual(self.result["accuracy"], altered_result["accuracy"])

    def test_response_shape_and_confusion_matrix(self):
        required = {"model_name", "accuracy", "precision", "recall", "f1_score", "roc_auc", "confusion_matrix",
                    "true_negative", "false_positive", "false_negative", "true_positive", "evaluation_sample_count",
                    "training_time", "timestamp"}
        self.assertTrue(required.issubset(self.result))
        self.assertEqual(self.result["model_name"], MODEL_NAME)
        expected_matrix = confusion_matrix(
            self.test[TARGET_COLUMN],
            self.model.predict(StandardizedTestData(self.train, self.test)),
            labels=[0, 1],
        ).tolist()
        self.assertEqual(self.result["confusion_matrix"], expected_matrix)
        self.assertEqual(self.result["evaluation_sample_count"], len(self.test))


def StandardizedTestData(train, test):
    """Fit only on train data, matching the baseline's no-leakage scaler."""
    from sklearn.preprocessing import StandardScaler
    return StandardScaler().fit(train[FEATURE_COLUMNS]).transform(test[FEATURE_COLUMNS])
