import unittest

import numpy as np

from app.ml.federated import calculate_classification_metrics


class ClassificationMetricTests(unittest.TestCase):
    def setUp(self):
        self.y_true = np.array([0, 0, 1, 1])
        self.y_pred = np.array([0, 1, 0, 1])
        # Deliberately differs from y_pred so the test proves ROC-AUC uses scores.
        self.y_score = np.array([0.05, 0.30, 0.35, 0.90])
        self.result = calculate_classification_metrics(
            self.y_true, self.y_pred, self.y_score, "2026-08-14T00:00:00+00:00"
        )

    def test_all_metrics_are_calculated(self):
        self.assertEqual(self.result["accuracy"], 0.5)
        self.assertEqual(self.result["precision"], 0.5)
        self.assertEqual(self.result["recall"], 0.5)
        self.assertEqual(self.result["f1_score"], 0.5)

    def test_roc_auc_uses_probabilities(self):
        self.assertEqual(self.result["roc_auc"], 1.0)

    def test_confusion_matrix_and_required_fields(self):
        self.assertEqual(self.result["confusion_matrix"], [[1, 1], [1, 1]])
        self.assertEqual((self.result["true_negative"], self.result["false_positive"],
                          self.result["false_negative"], self.result["true_positive"]), (1, 1, 1, 1))
        self.assertTrue({"accuracy", "precision", "recall", "f1_score", "roc_auc", "confusion_matrix",
                         "true_negative", "false_positive", "false_negative", "true_positive",
                         "evaluation_sample_count", "evaluation_timestamp"}.issubset(self.result))

    def test_roc_auc_is_null_for_one_class(self):
        result = calculate_classification_metrics(np.array([0, 0]), np.array([0, 0]), np.array([0.1, 0.2]))
        self.assertIsNone(result["roc_auc"])

    def test_metrics_change_with_actual_predictions(self):
        result = calculate_classification_metrics(self.y_true, np.array([0, 0, 1, 1]), self.y_score)
        self.assertEqual(result["accuracy"], 1.0)
        self.assertNotEqual(result["accuracy"], self.result["accuracy"])
