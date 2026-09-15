"""
Evaluate the tuned XGBoost model for the Home Credit Default Risk project.

Purpose:
    - Recreate the same train/validation/test split
    - Apply the same feature engineering
    - Fit preprocessing only on training data
    - Train XGBoost using the selected hyperparameters
    - Evaluate the tuned model on the development validation set
    - Compare different classification thresholds

Important:
    The test set is not used here.
"""

from pathlib import Path

import xgboost as xgb

from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)

from data_split import split_data, DATA_PATH
from data_understanding import load_data
from feature_engineering import create_features
from preprocessing import (
    remove_identifier_columns,
    identify_feature_types,
    build_preprocessor,
    preprocess_train_validation_test,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def prepare_data(df):
    """Prepare train, validation, and test data."""

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    # Apply deterministic feature engineering.
    X_train = create_features(X_train)
    X_valid = create_features(X_valid)
    X_test = create_features(X_test)

    # Remove identifiers before modeling.
    X_train = remove_identifier_columns(X_train)
    X_valid = remove_identifier_columns(X_valid)
    X_test = remove_identifier_columns(X_test)

    # Identify feature types using training data only.
    numerical_features, categorical_features = identify_feature_types( X_train)

    # Build preprocessing pipeline.
    preprocessor = build_preprocessor(numerical_features, categorical_features,)

    # Fit preprocessing on training data only.
    ( X_train_processed,X_valid_processed, X_test_processed,) = (
        preprocess_train_validation_test(
        X_train,
        X_valid,
        X_test,
        preprocessor,
    ))

    return (
        X_train_processed,
        X_valid_processed,
        X_test_processed,
        y_train,
        y_valid,
        y_test,
    )


def build_tuned_xgboost_model():
    """Build XGBoost using the best hyperparameters from CV."""

    model = xgb.XGBClassifier(
        n_estimators=400,
        learning_rate=0.1,
        max_depth=4,
        min_child_weight=10,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="aucpr",
        scale_pos_weight=11.4,
        random_state=42,
        n_jobs=-1,
    )

    return model


def train_model(model, X_train, y_train):
    """Train the tuned XGBoost model."""

    print("\nTraining tuned XGBoost model...")
    model.fit(X_train, y_train)
    print("Training complete.")

    return model


def evaluate_model(model, X_valid, y_valid):
    """Evaluate the tuned model on the validation set."""

    y_valid_proba = model.predict_proba(X_valid)[:, 1]

    # Default classification threshold.
    threshold = 0.50
    y_valid_pred = (y_valid_proba >= threshold).astype(int)

    roc_auc = roc_auc_score(y_valid, y_valid_proba)
    pr_auc = average_precision_score(y_valid, y_valid_proba)

    precision = precision_score(y_valid, y_valid_pred, zero_division=0,)
    recall = recall_score( y_valid, y_valid_pred, zero_division=0,)

    f1 = f1_score(y_valid,y_valid_pred,zero_division=0,)
    tn, fp, fn, tp = confusion_matrix( y_valid, y_valid_pred,).ravel()

    print("\nTuned XGBoost Validation Results")
    print("--------------------------------")
    print(f"ROC-AUC  : {roc_auc:.4f}")
    print(f"PR-AUC   : {pr_auc:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")

    print("\nConfusion Matrix")
    print("----------------")
    print(f"True Negatives : {tn}")
    print(f"False Positives: {fp}")
    print(f"False Negatives: {fn}")
    print(f"True Positives : {tp}")

    return y_valid_proba


def threshold_analysis(y_valid, y_valid_proba):
    """Evaluate classification performance at different thresholds."""

    thresholds = [ 0.20, 0.30, 0.40, 0.50, 0.60, 0.70,]

    print("\nThreshold Analysis")
    print("------------------")
    print("Threshold | Precision | Recall | F1")

    for threshold in thresholds:
        y_valid_pred = ( y_valid_proba >= threshold).astype(int)

        precision = precision_score( y_valid, y_valid_pred, zero_division=0, )
        recall = recall_score(y_valid, y_valid_pred,zero_division=0,)
        f1 = f1_score( y_valid, y_valid_pred, zero_division=0, )
        print(
            f"{threshold:9.2f} | "
            f"{precision:9.4f} | "
            f"{recall:6.4f} | "
            f"{f1:6.4f}"
        )


def main():
    print("Loading dataset...")
    df = load_data(DATA_PATH)

    print("Preparing data...")
    (
        X_train_processed,
        X_valid_processed,
        X_test_processed,
        y_train,
        y_valid,
        y_test,
    ) = prepare_data(df)

    print("\nData shapes")
    print("-----------")
    print(f"Training   : {X_train_processed.shape}")
    print(f"Validation : {X_valid_processed.shape}")
    print(f"Test       : {X_test_processed.shape}")

    model = build_tuned_xgboost_model()
    model = train_model( model, X_train_processed, y_train,)

    y_valid_proba = evaluate_model(model, X_valid_processed,  y_valid,)
    threshold_analysis( y_valid,y_valid_proba,)


if __name__ == "__main__":
    main()