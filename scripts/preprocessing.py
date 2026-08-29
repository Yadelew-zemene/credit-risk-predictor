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
from sklearn.preprocessing import OneHotEncoder


from  data_split import  split_data



# Configuration
PROJECT_ROOT =Path (__file__).resolve().parents[1]
TRAIN_PATH = ( PROJECT_ROOT / "data" / "raw" / "home-credit-default-risk" / "application_train.csv")

TARGET_COLUMN ,ID_COLUMNS= "TARGET" , ["SK_ID_CURR"]


# ---------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------
def load_data(path:Path)->pd.DataFrame:
    """Load the training dataset."""
    df = pd.read_csv(path)
    print("Dataset shape: ",df.shape)
    return  df

# Separate features and target
def split_features_target(df:pd.DataFrame)->tuple[pd.DataFrame, pd.Series]:

    X , y = df.drop(columns=[TARGET_COLUMN]),  df[TARGET_COLUMN]
    return X ,y

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

    numerical_pipeline = Pipeline(steps=[("imputer",SimpleImputer(strategy="median"))])
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
    df = load_data(TRAIN_PATH)

    # Split into train/validation first
    X_train, X_valid, y_train, y_valid = split_data(df)

    # Remove identifier from both feature sets
    X_train = remove_identifier_columns(X_train)
    X_valid = remove_identifier_columns(X_valid)
    numerical_features, categorical_features = identify_feature_types(X_train)

    print("\nFeature information \n -------------------")

    print( f"Numerical features: {len(numerical_features)} \nCategorical features: {len(categorical_features)}")

    print( f"Total features before encoding: {X_train.shape[1]}")

    preprocessor = build_preprocessor(numerical_features,categorical_features, )


    X_train_processed, X_valid_processed = (preprocess_train_validation(X_train,X_valid,preprocessor,))

    print("\nPreprocessing complete")
    print(f"Original training shape: {X_train.shape}")
    print(f"Processed training shape: " f"{X_train_processed.shape}")

    print(f"Original validation shape: {X_valid.shape}" )
    print(f"Processed validation shape: "f"{X_valid_processed.shape}"
          )
    print(f"\nTarget distribution : \n   {y_train.value_counts(normalize=True).round(4)}")


if __name__ == "__main__":
    main()