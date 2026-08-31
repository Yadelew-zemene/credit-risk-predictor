"""
Feature engineering for the Home Credit Default Risk project.

FE-01:
    Convert DAYS_BIRTH into an interpretable AGE_YEARS feature.
"""

from pathlib import Path
import pandas as pd

from data_split import split_data
from preprocessing import  load_data



# Configuration

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = (PROJECT_ROOT / "data" / "raw" / "home-credit-default-risk" / "application_train.csv")




# FE-01: Age
def create_age_feature(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create AGE_YEARS from DAYS_BIRTH.

    DAYS_BIRTH represents age in days relative to the application date
    and is stored as a negative number.
    """

    df = df.copy()
    df["AGE_YEARS"] = -df["DAYS_BIRTH"] / 365.25

    return df
def create_employment_feature(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create EMPLOYMENT_YEARS from DAYS_EMPLOYED.
    The value 365243 is an anomalous encoded value and is treated
    as missing before conversion to years.
    """
    df = df.copy()
    employment_days = df["DAYS_EMPLOYED"].replace(365243, pd.NA)
    df["EMPLOYMENT_YEARS"] = -employment_days / 365.25

    return df

def create_credit_income_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create CREDIT_INCOME_RATIO.
    Measures requested credit relative to the applicant's income.
    """
    df = df.copy()
    df["CREDIT_INCOME_RATIO"] = ( df["AMT_CREDIT"] / df["AMT_INCOME_TOTAL"])
    return df

def create_annuity_income_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Create loan payment burden relative to income."""

    df = df.copy()
    df["ANNUITY_INCOME_RATIO"] = (df["AMT_ANNUITY"] / df["AMT_INCOME_TOTAL"])

    return df


def create_credit_annuity_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """Create the ratio between credit amount and loan annuity."""

    df = df.copy()
    df["CREDIT_ANNUITY_RATIO"] = ( df["AMT_CREDIT"] / df["AMT_ANNUITY"])

    return df

def create_employment_anomaly_flag(df: pd.DataFrame) -> pd.DataFrame:
    """Flag the anomalous DAYS_EMPLOYED value."""

    df = df.copy()
    df["EMPLOYED_ANOMALY"] = (df["DAYS_EMPLOYED"] == 365243).astype(int)

    return df

def create_ext_source_mean(df: pd.DataFrame) -> pd.DataFrame:
    """Create the mean of available external credit scores."""

    df = df.copy()
    ext_source_columns = [ "EXT_SOURCE_1","EXT_SOURCE_2","EXT_SOURCE_3",]
    df["EXT_SOURCE_MEAN"] = df[ext_source_columns].mean(axis=1)


    return df

def create_income_per_family_member(df: pd.DataFrame) -> pd.DataFrame:
    """Create income relative to family size."""

    df = df.copy()
    df["INCOME_PER_FAMILY_MEMBER"] = ( df["AMT_INCOME_TOTAL"]/ df["CNT_FAM_MEMBERS"])

    return df

# Main
def main() -> None:

    df = load_data(DATA_PATH)

    # Create the feature
    df = create_age_feature(df)

    print("\nFE-01: AGE_YEARS \n ----------------")
    print(df["AGE_YEARS"].describe())
    print(f" First 10 values{df[["DAYS_BIRTH", "AGE_YEARS"]].head(10)}")

    df = create_employment_feature(df)

    print("\nFE-02: EMPLOYMENT_YEARS \n ----------------------")
    print(df["EMPLOYMENT_YEARS"].describe())
    print(f"\nAnomalous employment values: {df["DAYS_EMPLOYED"].eq(365243).sum()}")
    print(f"\nFirst 10 values:  \n {df[["DAYS_EMPLOYED", "EMPLOYMENT_YEARS"]].head(10)}")

    df = create_credit_income_ratio(df)

    print("\nFE-03: CREDIT_INCOME_RATIO \n--------------------------")
    print(df["CREDIT_INCOME_RATIO"].describe())
    print( df[["AMT_INCOME_TOTAL","AMT_CREDIT","CREDIT_INCOME_RATIO", ] ].head(10) )

    df = create_annuity_income_ratio(df)

    print("\nFE-04: ANNUITY_INCOME_RATIO \n ---------------------------")
    print(df["ANNUITY_INCOME_RATIO"].describe())
    print(df[["AMT_INCOME_TOTAL","AMT_ANNUITY","ANNUITY_INCOME_RATIO"]].head(10))

    df = create_credit_annuity_ratio(df)

    print("\nFE-05: CREDIT_ANNUITY_RATIO \n ---------------------------")
    print(df["CREDIT_ANNUITY_RATIO"].describe())
    print(df[["AMT_CREDIT", "AMT_ANNUITY","CREDIT_ANNUITY_RATIO"]].head(10))

    df = create_employment_anomaly_flag(df)

    print("\nFE-06: EMPLOYED_ANOMALY \n  ---------------------")
    print(df["EMPLOYED_ANOMALY"].value_counts())
    print(f"Default rate by employment anomaly:{df.groupby("EMPLOYED_ANOMALY")["TARGET"].mean().mul(100).round(2)}")

    df = create_ext_source_mean(df)

    print("\nFE-07: EXT_SOURCE_MEAN \n------------------------")
    print(df["EXT_SOURCE_MEAN"].describe())

    print(f"\nMissing values: {df["EXT_SOURCE_MEAN"].isna().sum()}")
    print(df[["EXT_SOURCE_1","EXT_SOURCE_2","EXT_SOURCE_3","EXT_SOURCE_MEAN",] ].head(10))


    df = create_income_per_family_member(df)

    print("\nFE-08: INCOME_PER_FAMILY_MEMBER\n --------------------------------  ")
    print(df["INCOME_PER_FAMILY_MEMBER"].describe())

    print(f"\nMissing values: \n {df["INCOME_PER_FAMILY_MEMBER"].isna().sum()}")
    print( df[["AMT_INCOME_TOTAL", "CNT_FAM_MEMBERS","INCOME_PER_FAMILY_MEMBER"]].head(10))

if __name__ == "__main__":
    main()