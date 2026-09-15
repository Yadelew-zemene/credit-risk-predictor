import pandas as pd
import pytest

from scripts.inference import ( load_model_artifact, predict_applicant,)
from scripts.data_understanding import load_data
from scripts.data_split import DATA_PATH, split_data


@pytest.fixture
def applicant():
    """
    Provide one real applicant from the validation dataset.
    """
    df = load_data(DATA_PATH)

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    return X_valid.iloc[[0]].copy()


def test_artifact_can_be_loaded():
    """
    The saved production artifact must load successfully.
    """
    artifact = load_model_artifact()
    assert artifact is not None


def test_prediction_probability_is_valid(applicant):
    """
    Default probability must be between 0 and 1.
    """

    result = predict_applicant(applicant)
    probability = result["default_probability"]
    assert 0.0 <= probability <= 1.0


def test_prediction_is_binary(applicant):
    """
    Prediction must be either 0 or 1.
    """

    result = predict_applicant(applicant)
    assert result["prediction"] in [0, 1]


def test_threshold_is_locked(applicant):
    """
    The production decision threshold must remain 0.65.
    """
    result = predict_applicant(applicant)
    assert result["threshold"] == 0.65


def test_decision_matches_prediction(applicant):
    """
    Human-readable decision must match the binary prediction.
    """

    result = predict_applicant(applicant)
    if result["prediction"] == 1:
        assert result["decision"] == "DEFAULT RISK"
    else:
        assert result["decision"] == "NO DEFAULT RISK"


def test_prediction_uses_expected_input_shape(applicant):
    """
    A raw applicant should successfully pass through
    the complete inference pipeline.
    """

    result = predict_applicant(applicant)

    assert isinstance(result, dict)

    assert "default_probability" in result
    assert "threshold" in result
    assert "prediction" in result
    assert "decision" in result

def test_inference_handles_missing_values(applicant):
    """
    Inference should handle missing values because the preprocessing
    pipeline contains imputers.
    """
    applicant = applicant.copy()

    # Introduce missing values into two fields.
    applicant.iloc[0, applicant.columns.get_loc("AMT_INCOME_TOTAL")] = float("nan")
    applicant.iloc[0, applicant.columns.get_loc("EXT_SOURCE_1")] = float("nan")

    result = predict_applicant(applicant)

    assert 0.0 <= result["default_probability"] <= 1.0
    assert result["prediction"] in [0, 1]


def test_inference_handles_unknown_category(applicant):
    """
    Inference should handle a categorical value that was not present
    during model training.
    """
    applicant = applicant.copy()

    # Find a categorical column.
    categorical_columns = applicant.select_dtypes(include=["object"]).columns
    assert len(categorical_columns) > 0
    column = categorical_columns[0]

    # Inject a category that should not exist in the training data.
    applicant.loc[applicant.index[0], column] = "UNSEEN_PRODUCTION_CATEGORY"
    result = predict_applicant(applicant)

    assert 0.0 <= result["default_probability"] <= 1.0
    assert result["prediction"] in [0, 1]


def test_inference_handles_multiple_applicants(applicant):
    """
    Inference should work for a batch of applicants, not only one row.
    """
    batch = applicant.copy()

    # Use the same applicant three times to test batch processing.
    batch = batch.loc[batch.index.repeat(3)].reset_index(drop=True)
    result = predict_applicant(batch)

    assert 0.0 <= result["default_probability"] <= 1.0
    assert result["prediction"] in [0, 1]