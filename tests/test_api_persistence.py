from fastapi.testclient import TestClient
from sqlalchemy import select

from api.db.database import get_db
from api.db.models import Assessment
from api.main import app


client = TestClient(app)


def valid_applicant_payload():
    return {
        "contract_type": "Cash loans",
        "gender": "M",
        "owns_car": "Y",
        "owns_realty": "Y",
        "children_count": 0,
        "family_members": 2,
        "family_status": "Married",
        "education_type": "Higher education",
        "income_type": "Working",
        "occupation_type": "Managers",
        "housing_type": "House / apartment",
        "annual_income": 180000,
        "credit_amount": 500000,
        "annuity_amount": 25000,
        "goods_price": 450000,
        "age_years": 32,
        "employment_years": 5,
        "registration_years": 10,
        "id_published_years": 4,
        "car_age": 3,
        "region_population_relative": 0.02,
        "region_rating": 2,
        "region_rating_city": 2,
        "external_source_1": 0.5,
        "external_source_2": 0.6,
        "external_source_3": 0.7,
    }


def test_predict_persists_assessment():
    payload = valid_applicant_payload()

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 200

    result = response.json()

    db = next(get_db())

    try:
        assessment = db.scalar(
            select(Assessment)
            .where(Assessment.annual_income == payload["annual_income"])
            .order_by(Assessment.created_at.desc())
        )

        assert assessment is not None
        assert assessment.contract_type == payload["contract_type"]
        assert assessment.gender == payload["gender"]
        assert assessment.annual_income == payload["annual_income"]
        assert float(assessment.default_probability) == round(result["default_probability"], 6)
        assert float(assessment.decision_threshold) == round(result["threshold"], 6)
        assert assessment.prediction == result["prediction"]
        assert assessment.decision == result["decision"]

        db.delete(assessment)
        db.commit()

    finally:
        db.close()