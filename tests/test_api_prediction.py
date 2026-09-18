import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete

from api.db.database import get_db
from api.db.models import Assessment
from api.main import app


client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_assessments():
    yield

    db = next(get_db())

    try:
        db.execute(delete(Assessment))
        db.commit()
    finally:
        db.close()


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


def test_predict_endpoint_with_valid_applicant():
    response = client.post(
        "/predict",
        json=valid_applicant_payload(),
    )

    assert response.status_code == 200

    result = response.json()

    assert "default_probability" in result
    assert "threshold" in result
    assert "prediction" in result
    assert "decision" in result


def test_predict_endpoint_rejects_empty_applicant():
    response = client.post(
        "/predict",
        json={},
    )

    assert response.status_code == 422

    result = response.json()

    assert "detail" in result
    assert isinstance(result["detail"], list)


def test_predict_endpoint_rejects_missing_required_fields():
    payload = valid_applicant_payload()

    del payload["annual_income"]

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 422

    result = response.json()

    assert "detail" in result

    missing_fields = [
        error["loc"][-1]
        for error in result["detail"]
        if error["type"] == "missing"
    ]

    assert "annual_income" in missing_fields


def test_predict_endpoint_handles_internal_error(monkeypatch):
    def failing_prediction(*args, **kwargs):
        raise RuntimeError("simulated internal failure")

    monkeypatch.setattr(
        "api.main.predict_applicant",
        failing_prediction,
    )

    response = client.post(
        "/predict",
        json=valid_applicant_payload(),
    )

    assert response.status_code == 500

    result = response.json()

    assert result["detail"] == (
        "Prediction service encountered an internal error."
    )


def test_predict_rejects_invalid_field_type():
    payload = {
        "SK_ID_CURR": "not-a-number",
    }

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 422


def test_predict_handles_extra_field():
    payload = valid_applicant_payload()

    payload["unexpected_field"] = "test-value"

    response = client.post(
        "/predict",
        json=payload,
    )

    assert response.status_code == 200

    result = response.json()

    assert "default_probability" in result
    assert "prediction" in result