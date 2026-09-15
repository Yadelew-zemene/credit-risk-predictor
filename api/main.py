from typing import Any

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import RootModel

from scripts.inference import predict_applicant


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

    return { "status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: ApplicantRequest):
    """
    Predict loan default risk for one applicant.
    """

    try:
        applicant_data = request.root

        applicant = pd.DataFrame([applicant_data])

        result = predict_applicant(applicant)

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Prediction failed: {str(exc)}",
        ) from exc