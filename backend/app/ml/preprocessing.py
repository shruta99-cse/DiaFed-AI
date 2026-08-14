import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


FEATURE_COLUMNS = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]

TARGET_COLUMN = "Outcome"


def load_dataset(csv_path: str):
    """
    Load diabetes dataset.
    """

    df = pd.read_csv(csv_path)

    return df


def clean_dataset(df: pd.DataFrame):
    """
    Basic cleaning and validation.
    """

    df = df.copy()

    # Replace impossible zero values with NaN
    zero_as_missing = [
        "Glucose",
        "BloodPressure",
        "SkinThickness",
        "Insulin",
        "BMI",
    ]

    for column in zero_as_missing:
        df[column] = df[column].replace(0, np.nan)

    # Fill missing values using median
    for column in zero_as_missing:
        df[column] = df[column].fillna(df[column].median())

    return df


def prepare_features(df: pd.DataFrame):
    """
    Separate features and target.
    """

    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()

    return X, y


def split_data(X, y, test_size=0.2, random_state=42):
    """
    Train/test split using stratification.
    """

    return train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )


def scale_features(X_train, X_test):
    """
    Standardize numerical features.
    """

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, scaler


def preprocess_pipeline(csv_path: str):
    """
    Complete preprocessing pipeline.
    """

    # Load
    df = load_dataset(csv_path)

    # Clean
    df = clean_dataset(df)

    # Features and target
    X, y = prepare_features(df)

    # Split
    X_train, X_test, y_train, y_test = split_data(X, y)

    # Scale
    X_train_scaled, X_test_scaled, scaler = scale_features(
        X_train,
        X_test
    )

    return (
        X_train_scaled,
        X_test_scaled,
        y_train,
        y_test,
        scaler,
    )