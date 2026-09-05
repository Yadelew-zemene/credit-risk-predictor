"""
Preprocessing pipeline for the Home Credit Default Risk project.

Purpose:
    - Separate features and target
    - Remove identifier columns
    - Identify numerical and categorical features
    - Handle missing values
    - Encode categorical features
    - Keep preprocessing reproducible
    - Prevent data leakage by fitting transformations only on training data
"""

from pathlib import Path

import pandas as pd


from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler




# Configuration


TARGET_COLUMN ,ID_COLUMNS= "TARGET" , ["SK_ID_CURR"]


# Remove identifier columns
def remove_identifier_columns(X:pd.DataFrame)->pd.DataFrame:
    """Remove columns that identify individual applications."""

    id_columns= [column for column in ID_COLUMNS if column in X.columns]
    X = X.drop(columns=id_columns)

    return X

# Identify feature types
def identify_feature_types(X:pd.DataFrame)->tuple[list[str],list[str]]:

    """Identify numerical and categorical columns."""

    numerical_features=X.select_dtypes(include="number").columns.tolist()
    categorical_features = X.select_dtypes(include="str").columns.tolist()

    return  numerical_features, categorical_features

# preprocessing pipeline
def build_preprocessor(numerical_features:list[str],categotical_features:list[str])->ColumnTransformer:
    """Build the preprocessing pipeline."""

    numerical_pipeline = Pipeline(steps=[
                                        ("imputer",SimpleImputer(strategy="median")),
                                        ("scaler", StandardScaler()),])
    categorical_pipeline =Pipeline(steps=[
                                          ("imputer" , SimpleImputer(strategy="most_frequent")),
                                         ("encoder", OneHotEncoder(handle_unknown="ignore",sparse_output=True))

                                       ])
    preprocessor= (ColumnTransformer
                             (
                             transformers= [("numerical", numerical_pipeline,numerical_features),
                                            ("catigorical" , categorical_pipeline ,categotical_features)])
                             )

    return preprocessor

def preprocess_train_validation(X_train: pd.DataFrame,X_valid: pd.DataFrame, preprocessor: ColumnTransformer,):
    """
    Fit the preprocessor using training data only,
    then transform both training and validation data.
    """

    print("\nFitting preprocessor on training data...")
    X_train_processed = preprocessor.fit_transform(X_train)

    print("Transforming validation data...")
    X_valid_processed = preprocessor.transform(X_valid)

    return X_train_processed, X_valid_processed

# Main
def main() -> None:
    """
        Demonstrate the preprocessing module.

        The actual project workflow will later be orchestrated by train.py.
        """

    print("Preprocessing module loaded successfully.")

    print("\nResponsibilities:")
    print("1. Remove identifier columns")
    print("2. Identify feature types")
    print("3. Build preprocessing pipeline")
    print("4. Fit preprocessing on training data only")
    print("5. Transform training and validation data")



if __name__ == "__main__":
    main()