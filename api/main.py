

import pandas as pd
from fastapi import FastAPI, HTTPException
from functools import lru_cache

from api.adapter import applicant_to_model_input
from api.schemas import ApplicantRequest

from pydantic import BaseModel
from scripts.inference import load_model_artifact, predict_applicant


app = FastAPI(
    title="Loan Default Prediction API",
    description="API for predicting loan default risk.",
    version="1.0.0",
)
@lru_cache(maxsize=1)
def get_model_artifact():
    return load_model_artifact()


class PredictionResponse(BaseModel):
    """
    Prediction returned by the production inference pipeline.
    """

    default_probability: float
    threshold: float
    prediction: int
    decision: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: ApplicantRequest):
    """
    Predict loan default risk for one applicant.
    """
    try:
        artifact = get_model_artifact()

        applicant = applicant_to_model_input( request, artifact=artifact,)

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
            detail="Prediction service encountered an internal error.",
        )