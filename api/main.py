from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache

from sqlalchemy.orm import Session

from api.adapter import applicant_to_model_input
from api.db.database import get_db
from api.db.repository import save_assessment
from api.schemas import ApplicantRequest

from pydantic import BaseModel
from scripts.inference import load_model_artifact, predict_applicant

from api.db.repository import get_assessments
from api.schemas import AssessmentHistoryItem

app = FastAPI(
    title="Loan Default Prediction API",
    description="API for predicting loan default risk.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
def predict(
    request: ApplicantRequest,
    db: Session = Depends(get_db),
):
    """
    Predict loan default risk for one applicant.
    """
    try:
        artifact = get_model_artifact()

        applicant = applicant_to_model_input(
            request,
            artifact=artifact,
        )

        result = predict_applicant(
            applicant,
            artifact=artifact,
        )

        save_assessment(
            db,
            request,
            result,
        )

        return result

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Prediction service encountered an internal error.",
        )
@app.get(
    "/assessments",
    response_model=list[AssessmentHistoryItem],
)
def get_assessment_history(
    db: Session = Depends(get_db),
):
    assessments = get_assessments(db)

    return [
        AssessmentHistoryItem(
            id=assessment.id,
            created_at=assessment.created_at,
            model_version=assessment.model_version,
            default_probability=float(assessment.default_probability),
            decision_threshold=float(assessment.decision_threshold),
            prediction=assessment.prediction,
            decision=assessment.decision,
        )
        for assessment in assessments
    ]