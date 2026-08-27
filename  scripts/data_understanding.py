
"""
Initial dataset understanding for the Home Credit Default Risk dataset.

This script is intentionally exploratory.
It helps us understand:
- dataset dimensions
- target distribution
- data types
- missing values
- feature cardinality
- feature descriptions
"""
from pathlib import Path
import pandas as pd
from joblib import PrintTime

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[1]

TRAIN_PATH = (PROJECT_ROOT/ "data"/ "raw" / "home-credit-default-risk"/ "application_train.csv")
DESCRIPTION_PATH = (PROJECT_ROOT/ "data"/ "raw"/ "HomeCredit_columns_description.csv")



# Load data
print("HOME CREDIT DEFAULT RISK — DATA UNDERSTANDING")
print("\nLoading training data...")

df = pd.read_csv(TRAIN_PATH)

print(f"Training data loaded successfully.")
print(f"Shape: {df.shape}")

# Dataset structure
print("1. DATASET STRUCTURE")

print(f"Rows:    {df.shape[0]:,}")
print(f"Columns: {df.shape[1]:,}")

print("\nData types:")
print(df.dtypes.value_counts())

# Target distribution
print("2. TARGET DISTRIBUTION")

print("target_summary")
print("count: " , df["TARGET"].value_counts())
print("Percentage:" , df["TARGET"].value_counts(normalize=True).round(2)*100)


# Missing values
print("3. MISSING VALUES")


missing_summary = pd.DataFrame( {
                    "missing_count": df.isna().sum(),
                    "missing_percentage": (df.isna().mean() * 100).round(2), })

missing_summary = missing_summary[missing_summary["missing_count"] > 0
                  ].sort_values("missing_percentage", ascending=False,)

print(missing_summary.to_string())

# Missing values
print("4. FEATURE CARDINALITY")

cardinality = pd.DataFrame({"dtype": df.dtypes, "unique_count": df.nunique(),}
).sort_values("unique_count", ascending=True,)

print(cardinality.to_string())

# Feature documentation

print("5. FEATURE DOCUMENTATION")
description = pd.read_csv(DESCRIPTION_PATH, encoding="latin1",)

print(f"Documentation shape: {description.shape}")
print(f"Documentation columns: {description.columns.tolist()}")

application_description = description[ description["Table"] == "application_{train|test}.csv"]
print("\nApplication features:")
print(application_description[["Row", "Description", "Special"]].to_string(index=False))


