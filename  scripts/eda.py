from pathlib import Path


import  matplotlib.pyplot as plt
import pandas as pd


# Configuration
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = (PROJECT_ROOT/ "data"/ "raw"/ "home-credit-default-risk"/ "application_train.csv")


#data loading
def load_data() -> pd.DataFrame:
    """Load the application training dataset."""
    return pd.read_csv(DATA_PATH)

def analyze_target(df:pd.DataFrame)-> None:
    """Analyze the distribution of the target variable."""
    counts, percentages= df["TARGET"].value_counts(),df["TARGET"].value_counts(normalize=True) * 100
    print("EDA-01: TARGET DISTRIBUTION")
    print(f"\n Counts: ",counts, "\n Percentages: ", percentages.round(2))

# define numerical variables
NUMERICAL_FEATURES = [
    "AMT_INCOME_TOTAL",
    "AMT_CREDIT",
    "AMT_ANNUITY",
    "DAYS_BIRTH",
    "DAYS_EMPLOYED",
]
def analyze_numerical_distributions(df: pd.DataFrame) -> None:
    """Analyze distributions of important numerical features."""
    print("EDA-02: NUMERICAL FEATURE DISTRIBUTIONS")
    print("\nSummary statistics: \n ", df[NUMERICAL_FEATURES].describe().T)
    print("\nSkewness:\n ",df[NUMERICAL_FEATURES].skew().sort_values(ascending=False) )

    # visualize the distribution
    for feature in NUMERICAL_FEATURES:
        plt.figure(figsize=(8, 5))

        df[feature].hist(bins=50)

        plt.title(f"Distribution of {feature}")
        plt.xlabel(feature)
        plt.ylabel("Number of applications")

        plt.tight_layout()
        plt.show()
# this function added to inspect the strange observation on DAYS_EMPLOYED
def investigate_days_employed(df: pd.DataFrame) -> None:
    """Investigate unusual values in DAYS_EMPLOYED."""

    print("EDA-03: DAYS_EMPLOYED INVESTIGATION")
    print("\nMost common DAYS_EMPLOYED values:")
    print( df["DAYS_EMPLOYED"].value_counts().head(10) )

    print("\nMaximum DAYS_EMPLOYED:",df["DAYS_EMPLOYED"].max())
    print("\nNumber of rows with DAYS_EMPLOYED = 365243:", (df["DAYS_EMPLOYED"] == 365243).sum())

# Main
def main() -> None:
    df = load_data()

    print(f"Loaded: {DATA_PATH}")
    print(f"Shape: {df.shape}")

    analyze_target(df)
    analyze_numerical_distributions(df)

    investigate_days_employed(df)


if __name__ == "__main__":
    main()