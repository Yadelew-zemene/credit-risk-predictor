"""
Build and save the final production model artifact.

Training data:Train + validation

Test data: Not used here.
"""
import pandas as pd
from pathlib import Path
import joblib

from data_understanding import load_data
from data_split import DATA_PATH, split_data

from scripts.model_pipeline import (
    FeatureEngineeringTransformer,
    IdentifierRemovalTransformer,
    PreprocessingTransformer,
    build_final_xgboost_model,
    LoanDefaultPredictor,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]

ARTIFACT_DIR = PROJECT_ROOT / "artifacts"

ARTIFACT_PATH = (ARTIFACT_DIR / "loan_default_pipeline.joblib")
def build_artifact():

    print("\nLoading data...")

    df = load_data(DATA_PATH)

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)


    # Combine train + validation
    X_development = pd.concat([X_train, X_valid], axis=0,)
    y_development = pd.concat([y_train, y_valid], axis=0,)

    print( "\nDevelopment samples:",len(X_development),)


    # Feature engineering
    feature_transformer = FeatureEngineeringTransformer()
    X_development = ( feature_transformer.fit_transform( X_development ) )


    # Remove identifier
    identifier_transformer = (IdentifierRemovalTransformer())
    X_development = (identifier_transformer.fit_transform( X_development))

    # Preprocessing
    preprocessing = PreprocessingTransformer()

    X_development_processed = (
        preprocessing.fit_transform( X_development, y_development,))

    print( "Processed development shape:", X_development_processed.shape,)

    # Train final model
    model = build_final_xgboost_model()
    print("\nTraining final model...")

    model.fit(X_development_processed,y_development,)

    print("Training complete.")

    # Prediction wrapper
    predictor = LoanDefaultPredictor( model=model, threshold=0.65, )

    # Artifact
    artifact = {
        "feature_transformer": feature_transformer,
        "identifier_transformer": identifier_transformer,
        "preprocessor": preprocessing,
        "predictor": predictor,
        "threshold": 0.65,
        "model_name": "XGBoost Tuned",
        "random_state": 42,
        "development_samples": len(X_development),
    }

    # Save
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True,  )
    joblib.dump( artifact, ARTIFACT_PATH,)

    print(f"\nArtifact saved to: {ARTIFACT_PATH}")


if __name__ == "__main__":
    build_artifact()