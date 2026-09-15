"""
Feature engineering for the Home Credit Default Risk project.

All transformations in this module are deterministic and row-level.
They do not learn parameters from the dataset, so they can be applied
consistently to training, validation, test, and future applicant data.
"""

import pandas as pd


def create_age_feature(df: pd.DataFrame) -> pd.DataFrame:
    """Create AGE_YEARS from DAYS_BIRTH."""

    df = df.copy()
    df["AGE_YEARS"] = -df["DAYS_BIRTH"] / 365.25

    return df


def create_employment_feature(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create EMPLOYMENT_YEARS from DAYS_EMPLOYED.

    Home Credit uses 365243 as an anomalous encoded value.
    Treat it as missing before converting days to years.
    """

    df = df.copy()

    employment_days = df["DAYS_EMPLOYED"].replace(365243, float("nan"))
    df["EMPLOYMENT_YEARS"] = -employment_days / 365.25

    return df


def create_credit_income_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Create credit amount relative to applicant income."""

    df = df.copy()

    df["CREDIT_INCOME_RATIO"] = (
        df["AMT_CREDIT"] / df["AMT_INCOME_TOTAL"]
    )

    return df


def create_annuity_income_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Create loan payment burden relative to income."""

    df = df.copy()

    df["ANNUITY_INCOME_RATIO"] = (
        df["AMT_ANNUITY"] / df["AMT_INCOME_TOTAL"]
    )

    return df


def create_credit_annuity_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Create credit amount relative to loan annuity."""

    df = df.copy()

    df["CREDIT_ANNUITY_RATIO"] = (
        df["AMT_CREDIT"] / df["AMT_ANNUITY"]
    )

    return df


def create_employment_anomaly_flag(df: pd.DataFrame) -> pd.DataFrame:
    """Flag the anomalous DAYS_EMPLOYED value."""

    df = df.copy()

    df["EMPLOYED_ANOMALY"] = (
        df["DAYS_EMPLOYED"] == 365243
    ).astype(int)

    return df


def create_ext_source_mean(df: pd.DataFrame) -> pd.DataFrame:
    """Create the mean of available external credit scores."""

    df = df.copy()

    ext_source_columns = [
        "EXT_SOURCE_1",
        "EXT_SOURCE_2",
        "EXT_SOURCE_3",
    ]

    df["EXT_SOURCE_MEAN"] = df[ext_source_columns].mean(axis=1)

    return df


def create_income_per_family_member(df: pd.DataFrame) -> pd.DataFrame:
    """Create income relative to family size."""

    df = df.copy()

    df["INCOME_PER_FAMILY_MEMBER"] = (
        df["AMT_INCOME_TOTAL"] / df["CNT_FAM_MEMBERS"]
    )

    return df


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Apply all deterministic feature engineering transformations.
    """

    df = create_age_feature(df)
    df = create_employment_feature(df)
    df = create_credit_income_ratio(df)
    df = create_annuity_income_ratio(df)
    df = create_credit_annuity_ratio(df)
    df = create_employment_anomaly_flag(df)
    df = create_ext_source_mean(df)
    df = create_income_per_family_member(df)

    return df