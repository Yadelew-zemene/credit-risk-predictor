from typing import Any

import pandas as pd
from fastapi import FastAPI, HTTPException
from functools import lru_cache

from pydantic import BaseModel, RootModel
from scripts.inference import load_model_artifact, predict_applicant


app = FastAPI(
    title="Loan Default Prediction API",
    description="API for predicting loan default risk.",
    version="1.0.0",
)
@lru_cache(maxsize=1)
def get_model_artifact():
    return load_model_artifact()

class ApplicantRequest(RootModel[dict[str, Any]]):
    """
    Raw applicant data using the Home Credit feature names.
    """


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
        applicant_data = request.root

        if not applicant_data:
            raise HTTPException(
                status_code=422,
                detail="Applicant data cannot be empty.",
            )

        artifact = get_model_artifact()

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