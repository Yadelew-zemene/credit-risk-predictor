"""
Final model training and test evaluation.

Purpose:
    - Combine training and validation data.
    - Fit preprocessing on the full development dataset.
    - Train the selected tuned XGBoost model.
    - Evaluate exactly once on the untouched test set.

Important:
    The test set must not be used for model or threshold selection.
"""

import xgboost as xgb
import pandas as pd
from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)

from feature_engineering import create_features
from data_split import split_data, DATA_PATH
from data_understanding import load_data

from preprocessing import (
    remove_identifier_columns,
    identify_feature_types,
    build_preprocessor,
    preprocess_train_validation_test,)


FINAL_THRESHOLD = 0.65

def prepare_final_data(df):
    """
    Prepare the final development data and untouched test data.
    """

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    # 1. Feature engineering
    # --------------------------------------------------

    X_train = create_features(X_train)
    X_valid = create_features(X_valid)
    X_test = create_features(X_test)

    # 2. Combine train + validation
    # --------------------------------------------------

    X_development = pd.concat([X_train, X_valid], axis=0,)
    y_development = pd.concat( [y_train, y_valid],  axis=0,)


    # 3. Remove identifier
    # --------------------------------------------------
    X_development = remove_identifier_columns(X_development )
    X_test = remove_identifier_columns(X_test)


    # 4. Identify feature types from development data
    # --------------------------------------------------

    (  numerical_features,categorical_features,) = identify_feature_types(X_development)
    # 5. Build preprocessor
    # --------------------------------------------------
    preprocessor = build_preprocessor(numerical_features,categorical_features, )


    # 6. Fit preprocessing on development data and transform test data
    # --------------------------------------------------
    X_development_processed = preprocessor.fit_transform(X_development)
    X_test_processed = preprocessor.transform( X_test)

    return (
        X_development_processed,
        X_test_processed,
        y_development,
        y_test,
    )


def build_final_model():
    """
    Build the selected tuned XGBoost model.
    """

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


def evaluate_final_model( model, X_test, y_test,):
    """
    Evaluate the final model on the untouched test set.
    """

    y_test_proba = model.predict_proba(  X_test )[:, 1]
    y_test_pred = (  y_test_proba >= FINAL_THRESHOLD).astype(int)

    roc_auc = roc_auc_score( y_test,y_test_proba,)
    pr_auc = average_precision_score(y_test,y_test_proba,)

    precision = precision_score(y_test,y_test_pred,zero_division=0,)
    recall = recall_score(y_test, y_test_pred, zero_division=0,)

    f1 = f1_score(y_test,y_test_pred,zero_division=0, )
    tn, fp, fn, tp = confusion_matrix(y_test,y_test_pred,).ravel()

    print("\nFINAL TEST RESULTS")
    print("==================")

    print(f"Threshold : {FINAL_THRESHOLD:.2f}")
    print(f"ROC-AUC   : {roc_auc:.4f}")
    print(f"PR-AUC    : {pr_auc:.4f}")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1 Score  : {f1:.4f}")

    print("\nConfusion Matrix")
    print("================")

    print(f"True Negatives : {tn}")
    print(f"False Positives: {fp}")
    print(f"False Negatives: {fn}")
    print(f"True Positives : {tp}")


def main():

    print("\nLoading data...")

    df = load_data(DATA_PATH)

    print("Preparing final development and test data...")

    (
        X_development_processed,
        X_test_processed,
        y_development,
        y_test,
    ) = prepare_final_data(df)

    print( f"\nDevelopment samples: " f"{len(y_development)}")
    print( f"Test samples: " f"{len(y_test)}")
    print(f"Processed development shape: " f"{X_development_processed.shape}")
    print( f"Processed test shape: " f"{X_test_processed.shape}")

    print("\nBuilding final XGBoost model...")

    model = build_final_model()
    print("\nTraining final model...")

    model.fit(X_development_processed, y_development,)
    print("Final training complete.")
    print("\nEvaluating on the test set ...")
    evaluate_final_model(model, X_test_processed,y_test,)


if __name__ == "__main__":
    main()