"""
Preprocessing pipeline for the Home Credit Default Risk project.

Responsibilities:
    - Remove identifier columns
    - Identify numerical and categorical features
    - Handle missing values
    - Encode categorical features
    - Scale numerical features
    - Fit preprocessing using training data only
    - Transform validation and test data without refitting
"""

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


# Configuration

TARGET_COLUMN = "TARGET"
ID_COLUMNS = ["SK_ID_CURR"]


def remove_identifier_columns(X: pd.DataFrame) -> pd.DataFrame:
    """Remove columns that identify individual applications."""

    id_columns = [column for column in ID_COLUMNS if column in X.columns]

    return X.drop(columns=id_columns)


def identify_feature_types(
    X: pd.DataFrame,
) -> tuple[list[str], list[str]]:
    """Identify numerical and categorical feature columns."""

    numerical_features = X.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_features = X.select_dtypes(
        include="object"
    ).columns.tolist()

    return numerical_features, categorical_features


def build_preprocessor(
    numerical_features: list[str],
    categorical_features: list[str],
) -> ColumnTransformer:
    """Build the preprocessing pipeline."""

    numerical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=True,
                ),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numerical",
                numerical_pipeline,
                numerical_features,
            ),
            (
                "categorical",
                categorical_pipeline,
                categorical_features,
            ),
        ]
    )

    return preprocessor


def preprocess_train_validation(
    X_train: pd.DataFrame,
    X_valid: pd.DataFrame,
    preprocessor: ColumnTransformer,
):
    """
    Fit the preprocessor on training data only,
    then transform training and validation data.
    """

    print("\nFitting preprocessor on training data...")
    X_train_processed = preprocessor.fit_transform(X_train)

    print("Transforming validation data...")
    X_valid_processed = preprocessor.transform(X_valid)

    return X_train_processed, X_valid_processed


def preprocess_train_validation_test(
    X_train: pd.DataFrame,
    X_valid: pd.DataFrame,
    X_test: pd.DataFrame,
    preprocessor: ColumnTransformer,
):
    """
    Fit the preprocessor on training data only,
    then transform validation and test data.

    The validation and test sets are never used to fit
    preprocessing parameters.
    """

    print("\nFitting preprocessor on training data...")
    X_train_processed = preprocessor.fit_transform(X_train)

    print("Transforming validation data...")
    X_valid_processed = preprocessor.transform(X_valid)

    print("Transforming test data...")
    X_test_processed = preprocessor.transform(X_test)

    return (
        X_train_processed,
        X_valid_processed,
        X_test_processed,
    )


def main() -> None:
    """Demonstrate that the preprocessing module loads correctly."""

    print("Preprocessing module loaded successfully.")

    print("\nResponsibilities:")
    print("1. Remove identifier columns")
    print("2. Identify feature types")
    print("3. Build preprocessing pipeline")
    print("4. Fit preprocessing on training data only")
    print("5. Transform validation and test data")


if __name__ == "__main__":
    main()