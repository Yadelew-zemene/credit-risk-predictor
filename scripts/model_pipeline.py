"""
Production components for the Loan Default Prediction project.

Contains:
    - Feature engineering transformer
    - Identifier removal transformer
    - Production preprocessing transformer
    - Final XGBoost model builder
    - Prediction wrapper
"""

import xgboost as xgb

from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


class FeatureEngineeringTransformer(
    BaseEstimator,
    TransformerMixin,
):
    """
    Apply deterministic project feature engineering.
    """

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()

        from scripts.feature_engineering import create_features

        return create_features(X)


class IdentifierRemovalTransformer(
    BaseEstimator,
    TransformerMixin,
):
    """
    Remove identifier columns before preprocessing.
    """

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()

        if "SK_ID_CURR" in X.columns:
            X = X.drop(columns=["SK_ID_CURR"])

        return X


class PreprocessingTransformer(
    BaseEstimator,
    TransformerMixin,
):
    """
    Fit the project's preprocessing on training data
    and reuse it for validation, test, and inference.
    """

    def __init__(self):
        self.preprocessor = None
        self.numerical_features = None
        self.categorical_features = None

    def fit(self, X, y=None):
        X = X.copy()

        self.numerical_features = X.select_dtypes(
            include=["number"]
        ).columns.tolist()

        self.categorical_features = X.select_dtypes(
            include=["object"]
        ).columns.tolist()

        numerical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="median"),
                )
            ]
        )

        categorical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="most_frequent"),
                ),
                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore",
                        sparse_output=True,
                    ),
                ),
            ]
        )

        self.preprocessor = ColumnTransformer(
            transformers=[
                (
                    "numerical",
                    numerical_pipeline,
                    self.numerical_features,
                ),
                (
                    "categorical",
                    categorical_pipeline,
                    self.categorical_features,
                ),
            ]
        )

        self.preprocessor.fit(X, y)

        return self

    def transform(self, X):
        if self.preprocessor is None:
            raise RuntimeError(
                "PreprocessingTransformer must be fitted before transform()."
            )

        X = X.copy()

        return self.preprocessor.transform(X)


def build_final_xgboost_model():
    """
    Build the selected final XGBoost model.
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


class LoanDefaultPredictor:
    """
    Convert model probabilities into final loan-default decisions.
    """

    def __init__(self, model, threshold=0.65):
        self.model = model
        self.threshold = threshold

    def predict_probability(self, X):
        """
        Return probability of loan default.
        """

        return self.model.predict_proba(X)[:, 1]

    def predict(self, X):
        """
        Return binary default decisions using the locked threshold.
        """

        probabilities = self.predict_probability(X)

        return (probabilities >= self.threshold).astype(int)