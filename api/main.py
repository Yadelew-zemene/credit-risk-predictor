from typing import Any

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import RootModel

from scripts.inference import load_model_artifact, predict_applicant


app = FastAPI(
    title="Loan Default Prediction API",
    description="API for predicting loan default risk.",
    version="1.0.0",
)


class ApplicantRequest(RootModel[dict[str, Any]]):
    """
    Raw applicant data using the Home Credit feature names.
    """


class PredictionResponse(RootModel[dict[str, Any]]):
    """
    Prediction returned by the production inference pipeline.
    """


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: ApplicantRequest):
    """
    Predict loan default risk for one applicant.
    """
    try:
        applicant_data = request.root

        if not applicant_data:
            raise HTTPException(
                status_code=422,
                detail="Applicant data cannot be empty.",
            )

        artifact = load_model_artifact()

        required_columns = set(
            artifact["feature_transformer"].feature_names_in_
        )

        missing_columns = required_columns - set(applicant_data.keys())

        if missing_columns:
            raise HTTPException(
                status_code=422,
                detail={
                    "message": "Missing required applicant fields.",
                    "missing_fields": sorted(missing_columns),
                },
            )

        applicant = pd.DataFrame([applicant_data])

        result = predict_applicant(
            applicant,
            artifact=artifact,
        )

        return result

    except HTTPException:
        raise

    except Exception:

     raise HTTPException(

       status_code=500,
       detail="Prediction service encountered an internal error.",)