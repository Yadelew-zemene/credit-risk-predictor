"""
XGBoost baseline model for the Home Credit Default Risk project.

Model 02:
    XGBoost classifier

Purpose:
    - Load the training/validation data
    - Train a baseline XGBoost model
    - Generate default-risk probabilities
    - Evaluate the model against the Logistic Regression baseline
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

from data_split import split_data
from data_understanding import load_data
from preprocessing import (

    remove_identifier_columns,
    identify_feature_types,
    build_preprocessor,
    preprocess_train_validation,
)

from scripts.feature_engineering import DATA_PATH

PROJECT_ROOT = Path(__file__).resolve().parents[1]

def prepare_data(df):
    """Prepare train, validation, and test data using the existing pipeline."""

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    # Remove identifiers from all feature sets
    X_train = remove_identifier_columns(X_train)
    X_valid = remove_identifier_columns(X_valid)
    X_test = remove_identifier_columns(X_test)

    # Determine feature types using training data only
    numerical_features, categorical_features = identify_feature_types( X_train)

    # Build preprocessor
    preprocessor = build_preprocessor(numerical_features,categorical_features,)

    # The preprocessor must be fitted using X_train only.
    X_train_processed, X_valid_processed = preprocess_train_validation(X_train,X_valid,preprocessor,)

    # Transform test using the already-fitted preprocessor.
    X_test_processed = preprocessor.transform(X_test)

    return (
        X_train_processed,
        X_valid_processed,
        X_test_processed,
        y_train,
        y_valid,
        y_test,
        preprocessor,
    )

def build_xgboost_model() -> xgb.XGBClassifier:
    """Build the baseline XGBoost classifier."""

    model = xgb.XGBClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="auc",
        scale_pos_weight=11.4,
        random_state=42,
        n_jobs=-1,
    )

    return model
def train_model(model: xgb.XGBClassifier, X_train, y_train,):
    """Train the XGBoost baseline model."""

    print("\nTraining XGBoost model...")
    model.fit(X_train,y_train,)
    print("Training complete.")

    return model

def predict_probabilities(model, X_valid):
    """Generate probability of default for validation data."""

    print("\nGenerating validation predictions...")

    y_valid_proba = model.predict_proba(X_valid)[:, 1]

    return y_valid_proba
def evaluate_model(model, X_valid, y_valid):
    """Evaluate model using the same metrics as Model 01."""

    y_valid_proba = model.predict_proba(X_valid)[:, 1]
    y_valid_pred = (y_valid_proba >= 0.5).astype(int)

    roc_auc = roc_auc_score(y_valid, y_valid_proba)
    pr_auc = average_precision_score(y_valid, y_valid_proba)

    precision = precision_score(y_valid, y_valid_pred)
    recall = recall_score(y_valid, y_valid_pred)
    f1 = f1_score(y_valid, y_valid_pred)

    tn, fp, fn, tp = confusion_matrix(y_valid, y_valid_pred).ravel()

    print("\nValidation Results \n ------------------")
    print(f"ROC-AUC : {roc_auc:.4f}")
    print(f"PR-AUC  : {pr_auc:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")

    print("\nConfusion Matrix \n ----------------")

    print(f"True Negatives : {tn}")
    print(f"False Positives: {fp}")
    print(f"False Negatives: {fn}")
    print(f"True Positives : {tp}")

def threshold_analysis(y_valid, y_valid_proba,thresholds=None,):
    """Evaluate classification performance at different thresholds."""
    if thresholds is None:
        thresholds = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70]

    print("\nThreshold Analysis\n -------------------")

    print("Threshold | Precision | Recall | F1")
    for threshold in thresholds:
        y_valid_pred = (y_valid_proba >= threshold).astype(int)
        precision = precision_score(y_valid,y_valid_pred, zero_division=0,)

        recall = recall_score(y_valid,y_valid_pred,zero_division=0,)
        f1 = f1_score(y_valid,y_valid_pred,zero_division=0,)

        print(f"{threshold:9.2f} | " f"{precision:9.4f} | " f"{recall:6.4f} | " f"{f1:6.4f}")
def show_feature_importance(model, feature_names, top_n=20):
    importance = model.feature_importances_

    feature_importance = sorted( zip(feature_names, importance),key=lambda x: x[1],reverse=True)

    print("\nTop Feature Importances \n -----------------------")
    for feature, score in feature_importance[:top_n]:
        print(f"{feature:40} {score:.6f}")

def main() -> None:

    df = load_data(DATA_PATH)

    (
        X_train_processed,
        X_valid_processed,
        X_test_processed,
        y_train,
        y_valid,
        y_test,
        preprocessor,
    ) = prepare_data(df)

    feature_names = preprocessor.get_feature_names_out()
    model = build_xgboost_model()
    model = train_model(model,X_train_processed,y_train,)
    show_feature_importance( model, feature_names,top_n=20)
    y_valid_proba = predict_probabilities( model, X_valid_processed,)

    print("\nPrediction complete.")
    print(y_valid_proba[:10])

    evaluate_model( model, X_valid_processed,y_valid,)
    threshold_analysis(y_valid,y_valid_proba,)

if __name__ == "__main__":
    main()