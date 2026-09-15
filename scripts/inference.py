"""
Inference functions for the Loan Default Prediction project.

Provides a simple interface for making predictions
using the saved production artifact.
"""

from pathlib import Path

import joblib
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]

ARTIFACT_PATH = (
    PROJECT_ROOT
    / "artifacts"
    / "loan_default_pipeline.joblib"
)


def load_model_artifact():
    """
    Load the trained production artifact from disk.
    """

    return joblib.load(ARTIFACT_PATH)


def predict_applicant(applicant, artifact=None):
    """
    Predict loan default risk for a raw applicant.

    Parameters
    ----------
    applicant : pandas.DataFrame
        Raw applicant data with the original project features.

    artifact : dict, optional
        Loaded model artifact. If not provided, it is loaded
        automatically.

    Returns
    -------
    dict
        Default probability, threshold, prediction, and decision.
    """

    if artifact is None:
        artifact = load_model_artifact()

    if not isinstance(applicant, pd.DataFrame):
        raise TypeError(
            "applicant must be a pandas DataFrame.")

    # Feature engineering
    applicant = artifact[ "feature_transformer"].transform(applicant)

    # Identifier removal
    applicant = artifact["identifier_transformer" ].transform(applicant)

    # Preprocessing
    applicant_processed = artifact[ "preprocessor"].transform(applicant)

    # Prediction
    predictor = artifact["predictor"]

    probability = predictor.predict_probability( applicant_processed)[0]
    prediction = predictor.predict(applicant_processed)[0]

    if prediction == 1:
        decision = "DEFAULT RISK"
    else:
        decision = "NO DEFAULT RISK"

    return {
        "default_probability": float(probability),
        "threshold": float(predictor.threshold),
        "prediction": int(prediction),
        "decision": decision,
    }