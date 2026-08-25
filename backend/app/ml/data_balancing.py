"""
Dataset Balancing for DiaFed AI
--------------------------------
Addresses panel suggestion 5: "Do dataset balancing"

The Pima Indians Diabetes Dataset is imbalanced (~65% non-diabetic, ~35% diabetic).
This script uses SMOTE (Synthetic Minority Oversampling Technique) to balance
the classes BEFORE splitting into federated client datasets, so every simulated
hospital trains on a fairly balanced local dataset.

Usage:
    from data_balancing import balance_dataset
    X_balanced, y_balanced = balance_dataset(X, y)
"""

import pandas as pd
from imblearn.over_sampling import SMOTE
from collections import Counter


def balance_dataset(X, y, random_state=42):
    """
    Balances the dataset using SMOTE.

    Parameters
    ----------
    X : pd.DataFrame or np.ndarray
        Feature matrix (Glucose, BMI, Age, etc.)
    y : pd.Series or np.ndarray
        Target labels (0 = Non-Diabetic, 1 = Diabetic)
    random_state : int
        Seed for reproducibility

    Returns
    -------
    X_resampled, y_resampled : balanced feature matrix and labels
    """
    print("Class distribution before balancing:", Counter(y))

    smote = SMOTE(random_state=random_state)
    X_resampled, y_resampled = smote.fit_resample(X, y)

    print("Class distribution after balancing:", Counter(y_resampled))

    return X_resampled, y_resampled


def balance_and_save(input_csv_path, output_csv_path, target_column="Outcome"):
    """
    Convenience function: reads a raw CSV, balances it, and saves the
    balanced version to a new CSV. Useful for balancing each hospital's
    dataset partition before local training.

    Parameters
    ----------
    input_csv_path : str
        Path to the raw (imbalanced) dataset CSV
    output_csv_path : str
        Path where the balanced CSV should be saved
    target_column : str
        Name of the label column (default "Outcome" for Pima dataset)
    """
    df = pd.read_csv(input_csv_path)

    X = df.drop(columns=[target_column])
    y = df[target_column]

    X_balanced, y_balanced = balance_dataset(X, y)

    balanced_df = pd.DataFrame(X_balanced, columns=X.columns)
    balanced_df[target_column] = y_balanced

    balanced_df.to_csv(output_csv_path, index=False)
    print(f"Balanced dataset saved to: {output_csv_path}")

    return balanced_df


if __name__ == "__main__":
    # Example demonstration with synthetic Pima-style data
    import numpy as np

    np.random.seed(42)
    n_samples = 200
    n_diabetic = 70   # imbalanced: 130 non-diabetic vs 70 diabetic

    demo_df = pd.DataFrame({
        "Glucose": np.random.randint(70, 200, n_samples),
        "BMI": np.random.uniform(18, 45, n_samples),
        "Age": np.random.randint(21, 80, n_samples),
        "Insulin": np.random.randint(0, 300, n_samples),
        "BloodPressure": np.random.randint(50, 120, n_samples),
        "Outcome": [1] * n_diabetic + [0] * (n_samples - n_diabetic)
    })

    demo_df.to_csv("/home/claude/demo_pima_sample.csv", index=False)

    balance_and_save(
        "/home/claude/demo_pima_sample.csv",
        "/home/claude/demo_pima_balanced.csv"
    )