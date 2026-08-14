import unittest

from app.ml.federated import secure_aggregation_matches_fedavg


class SecureAggregationTests(unittest.TestCase):
    def test_masked_fedavg_matches_plain_fedavg(self):
        self.assertTrue(secure_aggregation_matches_fedavg())


if __name__ == "__main__":
    unittest.main()
