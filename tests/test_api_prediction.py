from pathlib import Path

import pandas as pd
from fastapi.testclient import TestClient

from api.main import app


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

    print("\nAPI prediction:")
    print(result)