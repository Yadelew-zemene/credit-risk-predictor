"""
Validate the raw Home Credit application training dataset to see is the dataset is as expected.
This script checks structural and basic data-quality assumptions before the dataset is used for model training.
"""

from pathlib import Path
import pandas as pd

# Paths
PROJECT_ROOT = Path(__file__).resolve().parents[1]
TRAIN_PATH = (PROJECT_ROOT / "data" / "raw" / "home-credit-default-risk" / "application_train.csv")

# Load data
print("HOME CREDIT DEFAULT RISK — DATA VALIDATION")
df = pd.read_csv(TRAIN_PATH)
print(f"\nLoaded: {TRAIN_PATH}", f"\nShape: {df.shape}")

# 1. Required columns
print("1. REQUIRED COLUMNS")

required_columns = {"SK_ID_CURR", "TARGET", }
missing_required = required_columns - set(df.columns)

if missing_required:
    raise ValueError(f"Missing required columns: {missing_required}")
else:
    print("PASS: Required columns exist.")


# 2. Target validation
print("2. TARGET VALIDATION")

target_values = set(df["TARGET"].dropna().unique())
print(f"Target values: {sorted(target_values)}")

if not target_values.issubset({0, 1}):
    raise ValueError(f"Unexpected TARGET values: {target_values}")

if df["TARGET"].isna().any():
    raise ValueError("TARGET contains missing values.")

print("PASS: TARGET contains only 0 and 1.")


# 3. ID validation
print("3. ID VALIDATION")

duplicate_ids = df["SK_ID_CURR"].duplicated().sum()
print(f"Duplicate SK_ID_CURR values: {duplicate_ids:,}")

if duplicate_ids > 0:
    raise ValueError("SK_ID_CURR contains duplicate application IDs.")

print("PASS: SK_ID_CURR is unique.")

# 4. Duplicate rows
print("4. DUPLICATE ROWS")

duplicate_rows = df.duplicated().sum()
print(f"Duplicate rows: {duplicate_rows:,}")

if duplicate_rows > 0:
    print("WARNING: Duplicate rows detected.")
else:
    print("PASS: No duplicate rows.")


# 5. Missing TARGET
print("5. TARGET MISSING")

target_missing = df["TARGET"].isna().sum()
print(f"Missing TARGET values: {target_missing:,}")

if target_missing > 0:
    raise ValueError("TARGET contains missing values.")

print("PASS: TARGET has no missing values.")

# 6. Constant columns
print("6. CONSTANT FEATURES")

feature_columns = [column for column in df.columns if column not in {"SK_ID_CURR", "TARGET"}]
constant_columns = [column for column in feature_columns if df[column].nunique(dropna=False) <= 1]

if constant_columns:
    print("Constant columns:")
    for column in constant_columns:
        print(f"  - {column}")
else:
    print("PASS: No constant features.")


# 7. Validation summary
print("VALIDATION COMPLETE")

print(f"Rows:             {len(df):,}")
print(f"Features:         {len(feature_columns):,}")
print(f"Target classes:   {sorted(target_values)}")
print(f"Duplicate IDs:    {duplicate_ids:,}")
print(f"Duplicate rows:   {duplicate_rows:,}")
print(f"Constant columns: {len(constant_columns)}")
