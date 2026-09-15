from pathlib import Path
import  pytest
import pandas as pd
from fastapi.testclient import TestClient

from api.main import app
@pytest.fixture
def client():
    return TestClient(app)

client = TestClient(app)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "home-credit-default-risk" / "application_train.csv"


def test_predict_endpoint_with_real_applicant():
    """
    The API should accept a real raw applicant and return
    the prediction produced by the saved ML pipeline.
    """

    df = pd.read_csv(DATA_PATH)

    applicant = ( df.drop(columns=["TARGET"]).iloc[0]
        .where(lambda x: x.notna(), None)
        .to_dict()
    )

    response = client.post(
        "/predict",
        json=applicant,
    )

    assert response.status_code == 200

    result = response.json()

    assert "default_probability" in result
    assert "threshold" in result
    assert "prediction" in result
    assert "decision" in result

    assert 0.0 <= result["default_probability"] <= 1.0
    assert result["threshold"] == 0.65
    assert result["prediction"] in [0, 1]

    print(f"\nAPI prediction:\n {result}")


def test_predict_endpoint_rejects_empty_applicant():
    response = client.post(
        "/predict", json={},)

    assert response.status_code == 422

    result = response.json()
    assert result["detail"] == "Applicant data cannot be empty."


def test_predict_endpoint_rejects_missing_required_fields():
    response = client.post(
        "/predict",
        json={ "SK_ID_CURR": 100002,},)

    assert response.status_code == 422
    result = response.json()

    assert result["detail"]["message"] == "Missing required applicant fields."
    assert len(result["detail"]["missing_fields"]) > 0
def test_predict_endpoint_handles_internal_error(monkeypatch):
    df = pd.read_csv(DATA_PATH)

    applicant = (
        df.drop(columns=["TARGET"])
        .iloc[0]
        .where(lambda x: x.notna(), None)
        .to_dict()
    )

    def failing_prediction(*args, **kwargs):
        raise RuntimeError("simulated internal failure")

    monkeypatch.setattr(
        "api.main.predict_applicant",
        failing_prediction,
    )

    response = client.post(
        "/predict",
        json=applicant,
    )

    assert response.status_code == 500

    result = response.json()

    assert result["detail"] == (
        "Prediction service encountered an internal error."
    )

    assert "simulated internal failure" not in str(result)

def test_predict_rejects_invalid_field_type():
    client = TestClient(app)

    payload = {
        "SK_ID_CURR": "not-a-number",
    }


    response = client.post("/predict", json=payload)

    assert response.status_code == 422
def test_predict_handles_extra_field():
    client = TestClient(app)

    df = pd.read_csv(DATA_PATH)

    applicant = (
        df.drop(columns=["TARGET"]).iloc[0]
        .where(lambda x: x.notna(), None)
        .to_dict()
    )

    applicant["UNEXPECTED_FIELD"] = "test-value"

    response = client.post("/predict", json=applicant)

    assert response.status_code == 200

    result = response.json()

    assert "default_probability" in result
    assert "prediction" in result