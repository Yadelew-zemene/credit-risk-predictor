"""
Fine-grained threshold selection for the Home Credit Default Risk project.

Purpose:
    Find a suitable classification threshold for the selected
    tuned XGBoost model.

Important:
    - Threshold selection uses validation data only.
    - The test set remains untouched.
    - The model configuration is fixed from the previous
      model-selection step.
"""

from pathlib import Path

import numpy as np
import xgboost as xgb

from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
)

from feature_engineering import create_features
from data_split import split_data, DATA_PATH
from data_understanding import load_data

from preprocessing import (
    remove_identifier_columns,
    identify_feature_types,
    build_preprocessor,
    preprocess_train_validation_test,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def prepare_data(df):
    """Prepare train, validation, and test data."""

    X_train, X_valid, X_test, y_train, y_valid, y_test = split_data(df)

    # Feature engineering
    X_train = create_features(X_train)
    X_valid = create_features(X_valid)
    X_test = create_features(X_test)

    # Remove identifiers
    X_train = remove_identifier_columns(X_train)
    X_valid = remove_identifier_columns(X_valid)
    X_test = remove_identifier_columns(X_test)

    # Identify feature types using training data only
    numerical_features, categorical_features = identify_feature_types( X_train)

    # Build preprocessing pipeline
    preprocessor = build_preprocessor(numerical_features, categorical_features,)

    # Fit preprocessing on training data only
    (
        X_train_processed,
        X_valid_processed,
        X_test_processed,
    ) = preprocess_train_validation_test(
        X_train,
        X_valid,
        X_test,
        preprocessor,
    )

    return (
        X_train_processed,
        X_valid_processed,
        y_train,
        y_valid,
    )


def build_model():
    """Build the selected tuned XGBoost model."""

    return xgb.XGBClassifier(
        n_estimators=400,
        learning_rate=0.1,
        max_depth=4,
        min_child_weight=10,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="auc",
        scale_pos_weight=11.4,
        random_state=42,
        n_jobs=-1,
    )


def find_best_threshold(y_valid, y_valid_proba):
    """Find the validation threshold with the highest F1 score."""

    thresholds = np.arange(0.05, 0.96, 0.01)

    results = []

    for threshold in thresholds:
        y_valid_pred = (y_valid_proba >= threshold).astype(int)
        precision = precision_score(y_valid,y_valid_pred, zero_division=0,)
        recall = recall_score(y_valid,y_valid_pred, zero_division=0,)
        f1 = f1_score( y_valid,y_valid_pred,zero_division=0,)

        results.append(
            {
                "threshold": threshold,
                "precision": precision,
                "recall": recall,
                "f1": f1,
            }
        )

    best_result = max( results, key=lambda result: result["f1"], )

    return best_result, results


def main():

    print("\nLoading data...")
    df = load_data(DATA_PATH)

    (
        X_train_processed,
        X_valid_processed,
        y_train,
        y_valid,
    ) = prepare_data(df)

    print("\nTraining selected XGBoost model...")

    model = build_model()

    model.fit( X_train_processed,y_train,)

    print("Training complete.")
    print("\nGenerating validation probabilities...")

    y_valid_proba = model.predict_proba(X_valid_processed)[:, 1]

    best_result, results = find_best_threshold(y_valid, y_valid_proba,)

    print("\nBEST VALIDATION THRESHOLD")
    print("=========================")

    print(f"Threshold : {best_result['threshold']:.2f}")
    print(f"Precision : {best_result['precision']:.4f}")
    print( f"Recall    : {best_result['recall']:.4f}" )
    print( f"F1 Score  : {best_result['f1']:.4f}" )

    print("\nThreshold Results Around Best")
    print("==============================")

    print( "Threshold | Precision | Recall | F1")

    print("-" * 45)
    for result in results:

        if abs(result["threshold"]- best_result["threshold"]) <= 0.05:

            print(
                f"{result['threshold']:9.2f} | "
                f"{result['precision']:9.4f} | "
                f"{result['recall']:6.4f} | "
                f"{result['f1']:6.4f}"
            )


if __name__ == "__main__":
    main()