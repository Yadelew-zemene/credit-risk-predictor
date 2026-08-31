"""
Model training for the Home Credit Default Risk project.
Model 01:Logistic Regression

Responsibilities:
    - Load the dataset
    - Create train/validation split
    - Apply feature engineering
    - Apply preprocessing
    - Train Logistic Regression
    - Evaluate validation performance
"""

from pathlib import Path

import pandas as pd
from fontTools.misc.cython import returns
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)


from data_split import split_data
from  data_understanding import  load_data
from preprocessing import (

    remove_identifier_columns,
    identify_feature_types,
    build_preprocessor,
    preprocess_train_validation,
)
from feature_engineering import (

    create_age_feature,
    create_employment_feature,
    create_credit_income_ratio,
    create_annuity_income_ratio,
    create_credit_annuity_ratio,
    create_employment_anomaly_flag,
    create_ext_source_mean,
    create_income_per_family_member,
)



# Configuration

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = (PROJECT_ROOT / "data" / "raw" / "home-credit-default-risk" / "application_train.csv")

RANDOM_STATE = 42

def prepare_data():
    """Load data and create the train/validation split."""

    df = load_data(DATA_PATH)
    X_train, X_valid, y_train, y_valid = split_data(df)

    return X_train, X_valid, y_train, y_valid

def apply_feature_engineering(X_train: pd.DataFrame,X_valid: pd.DataFrame,):
    """Apply deterministic feature engineering to train and validation data."""

    feature_functions = [
        create_age_feature,
        create_employment_feature,
        create_credit_income_ratio,
        create_annuity_income_ratio,
        create_credit_annuity_ratio,
        create_employment_anomaly_flag,
        create_ext_source_mean,
        create_income_per_family_member,
    ]

    for feature_function in feature_functions:
        X_train = feature_function(X_train)
        X_valid = feature_function(X_valid)

    return X_train, X_valid

def prepare_preprocessor(X_train: pd.DataFrame,X_valid: pd.DataFrame,):
    """Fit preprocessing on training data and transform both datasets."""

    X_train = remove_identifier_columns(X_train)
    X_valid = remove_identifier_columns(X_valid)

    numerical_features, categorical_features = identify_feature_types(X_train)
    preprocessor = build_preprocessor(numerical_features,categorical_features,)

    X_train_processed, X_valid_processed = preprocess_train_validation(X_train,X_valid,preprocessor,)

    return X_train_processed, X_valid_processed, preprocessor

def build_model()-> LogisticRegression:
    """Create the baseline Logistic Regression model."""
    model = LogisticRegression(
         max_iter= 1000,
         class_weight= "balanced",
        random_state= RANDOM_STATE)
    return  model
def train_model(model: LogisticRegression, X_train ,y_train)->LogisticRegression:
    """Train the model using training data only."""
    print("\n Traing the  logistic regression model...")
    model.fit(X_train,y_train)

    print("Training complete")

    return  model
def evaluate_model(model,X_valid_processed, y_valid,):
    """Evaluate the trained model on the validation set."""

    print("\nEvaluating Logistic Regression...")

    # Probability of class 1 (default)
    y_valid_proba = model.predict_proba(X_valid_processed)[:, 1]

    # Default classification threshold
    threshold = 0.5
    y_valid_pred = (y_valid_proba >= threshold).astype(int)

    # Ranking metrics
    roc_auc = roc_auc_score(y_valid, y_valid_proba)
    pr_auc = average_precision_score(y_valid, y_valid_proba)

    # Classification metrics
    precision = precision_score(y_valid, y_valid_pred, zero_division=0)
    recall = recall_score(y_valid, y_valid_pred, zero_division=0)
    f1 = f1_score(y_valid, y_valid_pred, zero_division=0)

    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_valid,y_valid_pred,).ravel()

    print("\nValidation Results \n ------------------")

    print(f"ROC-AUC : {roc_auc:.4f}")
    print(f"PR-AUC  : {pr_auc:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")

    print("\nConfusion Matrix \n --------------------")

    print(f"True Negatives : {tn}")
    print(f"False Positives: {fp}")
    print(f"False Negatives: {fn}")
    print(f"True Positives : {tp}")

    return {
        "roc_auc": roc_auc,
        "pr_auc": pr_auc,
        "precision": precision,
        "recall": recall,
        "f1": f1,}

def main() -> None:

    print("Loading and splitting data...")

    X_train, X_valid, y_train, y_valid = prepare_data()
    print(f"Training samples: {X_train.shape[0]}  &&  Validation samples: {X_valid.shape[0]}")


    print("\nApplying feature engineering...")

    X_train, X_valid = apply_feature_engineering( X_train, X_valid,)
    print(f"Training features after FE: {X_train.shape[1]}")
    print(f"Validation features after FE: {X_valid.shape[1]}")

    print("\nApplying preprocessing...")
    (X_train_processed, X_valid_processed, preprocessor,) = prepare_preprocessor(X_train,X_valid, )

    print(f"Processed training shape: " f"{X_train_processed.shape}")
    print( f"Processed validation shape: "f"{X_valid_processed.shape}")

    model = build_model()

    model = train_model(model,X_train_processed,y_train,)
    metrics = evaluate_model(model,X_valid_processed,y_valid,)


if __name__ == "__main__":
    main()