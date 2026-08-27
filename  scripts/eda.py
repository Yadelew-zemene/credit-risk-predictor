from pathlib import Path

import pandas as pd
from svgwrite.data.pattern import percentage

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


# Main
def main() -> None:
    df = load_data()

    print(f"Loaded: {DATA_PATH}")
    print(f"Shape: {df.shape}")

    analyze_target(df)


if __name__ == "__main__":
    main()