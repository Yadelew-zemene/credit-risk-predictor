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


PROJECT_ROOT = Path(__file__).resolve().parents[1]
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

def main() -> None:

    model = build_xgboost_model()

    print("\nXGBoost baseline configuration \n --------------------------------")

    print(model.get_params())



if __name__ == "__main__":
    main()