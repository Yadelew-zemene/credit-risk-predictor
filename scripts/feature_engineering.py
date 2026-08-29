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


# Main

def main() -> None:

    df = load_data(DATA_PATH)

    # Create the feature
    df = create_age_feature(df)
    df = create_employment_feature(df)

    print("\nFE-01: AGE_YEARS \n ----------------")
    print(df["AGE_YEARS"].describe())


    print(f" First 10 values{df[["DAYS_BIRTH", "AGE_YEARS"]].head(10)}")
    print("\nFE-02: EMPLOYMENT_YEARS \n ----------------------")

    print(df["EMPLOYMENT_YEARS"].describe())

    print(f"\nAnomalous employment values: {df["DAYS_EMPLOYED"].eq(365243).sum()}")
    print(f"\nFirst 10 values:  \n {df[["DAYS_EMPLOYED", "EMPLOYMENT_YEARS"]].head(10)}")


if __name__ == "__main__":
    main()