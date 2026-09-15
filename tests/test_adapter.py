import pandas as pd
from scripts.inference import load_model_artifact
from api.adapter import applicant_to_model_input
from api.schemas import ApplicantRequest


def create_test_applicant():
    return ApplicantRequest(
        contract_type="Cash loans",
        gender="M",
        owns_car="Y",
        owns_realty="Y",
        children_count=0,
        family_members=2,
        family_status="Married",
        education_type="Higher education",
        income_type="Working",
        occupation_type="Managers",
        housing_type="House / apartment",
        annual_income=180000,
        credit_amount=500000,
        annuity_amount=25000,
        goods_price=450000,
        age_years=32,
        employment_years=5,
        registration_years=10,
        id_published_years=4,
        car_age=3,
        region_population_relative=0.02,
        region_rating=2,
        region_rating_city=2,
        external_source_1=0.5,
        external_source_2=0.6,
        external_source_3=0.7,
    )


def test_adapter_returns_dataframe():
    applicant = create_test_applicant()

    result = applicant_to_model_input(applicant)

    assert isinstance(result, pd.DataFrame)
    assert len(result) == 1


def test_adapter_converts_age_and_employment():
    applicant = create_test_applicant()

    result = applicant_to_model_input(applicant)

    assert result.loc[0, "DAYS_BIRTH"] < 0
    assert result.loc[0, "DAYS_EMPLOYED"] < 0


def test_adapter_maps_financial_fields():
    applicant = create_test_applicant()

    result = applicant_to_model_input(applicant)

    assert result.loc[0, "AMT_INCOME_TOTAL"] == 180000
    assert result.loc[0, "AMT_CREDIT"] == 500000
    assert result.loc[0, "AMT_ANNUITY"] == 25000
def test_adapter_matches_model_input_schema():
    applicant = create_test_applicant()

    result = applicant_to_model_input(applicant)

    artifact = load_model_artifact()

    expected_columns = artifact[
        "feature_transformer"
    ].feature_names_in_

    assert list(result.columns) == list(expected_columns)
    assert result.shape == (1, 121)