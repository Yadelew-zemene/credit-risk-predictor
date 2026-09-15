from pathlib import Path

import pandas as pd

from api.schemas import ApplicantRequest
from scripts.inference import load_model_artifact


def applicant_to_model_input(
    applicant: ApplicantRequest,
    artifact=None,
) -> pd.DataFrame:
    """
    Convert the frontend-friendly applicant contract into
    the exact raw feature schema expected by the ML pipeline.
    """

    if artifact is None:
        artifact = load_model_artifact()

    expected_columns = artifact["feature_transformer"].feature_names_in_

    data = {
        "SK_ID_CURR": 999999,
        "NAME_CONTRACT_TYPE": applicant.contract_type,
        "CODE_GENDER": applicant.gender,
        "FLAG_OWN_CAR": applicant.owns_car,
        "FLAG_OWN_REALTY": applicant.owns_realty,
        "CNT_CHILDREN": applicant.children_count,
        "AMT_INCOME_TOTAL": applicant.annual_income,
        "AMT_CREDIT": applicant.credit_amount,
        "AMT_ANNUITY": applicant.annuity_amount,
        "AMT_GOODS_PRICE": applicant.goods_price,
        "NAME_TYPE_SUITE": None,
        "NAME_INCOME_TYPE": applicant.income_type,
        "NAME_EDUCATION_TYPE": applicant.education_type,
        "NAME_FAMILY_STATUS": applicant.family_status,
        "NAME_HOUSING_TYPE": applicant.housing_type,
        "REGION_POPULATION_RELATIVE": applicant.region_population_relative,
        "DAYS_BIRTH": int(-applicant.age_years * 365.25),
        "DAYS_EMPLOYED": int(-applicant.employment_years * 365.25),
        "DAYS_REGISTRATION": int(-applicant.registration_years * 365.25),
        "DAYS_ID_PUBLISH": int(-applicant.id_published_years * 365.25),
        "OWN_CAR_AGE": applicant.car_age,
        "FLAG_MOBIL": 1,
        "FLAG_EMP_PHONE": 1,
        "FLAG_WORK_PHONE": 0,
        "FLAG_CONT_MOBILE": 1,
        "FLAG_PHONE": 0,
        "FLAG_EMAIL": 0,
        "OCCUPATION_TYPE": applicant.occupation_type,
        "CNT_FAM_MEMBERS": applicant.family_members,
        "REGION_RATING_CLIENT": applicant.region_rating,
        "REGION_RATING_CLIENT_W_CITY": applicant.region_rating_city,
        "EXT_SOURCE_1": applicant.external_source_1,
        "EXT_SOURCE_2": applicant.external_source_2,
        "EXT_SOURCE_3": applicant.external_source_3,
    }

    result = pd.DataFrame([data])

    for column in expected_columns:
        if column not in result.columns:
            result[column] = None

    return result[expected_columns]