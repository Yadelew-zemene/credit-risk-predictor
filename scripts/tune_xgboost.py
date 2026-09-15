"""
Hyperparameter tuning for the Home Credit Default Risk project.

Model:
    XGBoost classifier

Purpose:
    - Prepare the development training data
    - Build a leakage-safe preprocessing + model pipeline
    - Tune XGBoost hyperparameters using cross-validation
    - Select the best configuration using PR-AUC
    - Report the best cross-validation results
"""

from pathlib import Path

import xgboost as xgb
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline

from data_split import split_data, DATA_PATH
from data_understanding import load_data
from feature_engineering import create_features
from preprocessing import (
    remove_identifier_columns,
    identify_feature_types,
    build_preprocessor,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]

RANDOM_STATE = 42
CV_FOLDS = 5
N_ITER = 20


def prepare_training_data(df):
    """
    Prepare the development training data for cross-validation.
    The test set is intentionally not used here.
    """

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

    # Remove identifiers.
    X_train = remove_identifier_columns(X_train)

    return X_train, y_train


def build_pipeline(X_train):
    """
    Build a leakage-safe preprocessing + XGBoost pipeline.
    """

    numerical_features, categorical_features = (identify_feature_types(X_train))
    preprocessor = build_preprocessor(numerical_features,categorical_features,)
    model = xgb.XGBClassifier(
        objective="binary:logistic",
        eval_metric="aucpr",
        scale_pos_weight=11.4,
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ])

    return pipeline


def build_search_space():
    """
    Define the XGBoost hyperparameter search space.
    """

    param_distributions = {
        "model__n_estimators": [200,300,400,],
        "model__learning_rate": [0.03,0.05, 0.10,],
        "model__max_depth": [ 4, 6, 8,],
        "model__min_child_weight": [1,5, 10,],
        "model__subsample": [0.8,1.0,],
        "model__colsample_bytree": [ 0.8,1.0,],
    }

    return param_distributions


def run_tuning(X_train, y_train, pipeline):
    """
    Run randomized hyperparameter search using stratified CV.
    """

    cv = StratifiedKFold(
        n_splits=CV_FOLDS,
        shuffle=True,
        random_state=RANDOM_STATE,
    )

    search = RandomizedSearchCV(
        estimator=pipeline,
        param_distributions=build_search_space(),
        n_iter=N_ITER,
        scoring="average_precision",
        cv=cv,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        verbose=2,
        return_train_score=True,
    )

    print("\nStarting XGBoost hyperparameter tuning...")
    print(f"CV folds       : {CV_FOLDS}")
    print(f"Search trials  : {N_ITER}")
    print("Scoring metric : PR-AUC")

    search.fit(X_train, y_train)

    return search


def main():

    print("Loading dataset...")

    df = load_data(DATA_PATH)

    print("Preparing training data...")
    X_train, y_train = prepare_training_data(df)

    print(f"Training samples : {X_train.shape[0]}")
    print( f"Training features: {X_train.shape[1]}")

    print("\nBuilding ML pipeline...")
    pipeline = build_pipeline(X_train)

    print("\nRunning hyperparameter search...")
    search = run_tuning(X_train,y_train,pipeline,)

    print("\n==============================")
    print("BEST CROSS-VALIDATION RESULT")
    print("==============================")

    print(f"Best PR-AUC: {search.best_score_:.4f}")

    print("\nBest Hyperparameters:")
    for parameter, value in search.best_params_.items():
        print(f"{parameter}: {value}" )


if __name__ == "__main__":
    main()