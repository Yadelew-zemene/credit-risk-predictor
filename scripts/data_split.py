from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


RANDOM_STATE = 42

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATA_PATH = (PROJECT_ROOT / "data" / "raw"  / "home-credit-default-risk" / "application_train.csv")
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"

def split_data(df: pd.DataFrame,) -> tuple[
                   pd.DataFrame,pd.DataFrame,pd.DataFrame,
                   pd.Series,pd.Series,pd.Series,]:
    """Create a reproducible stratified train/validation/test split."""

    X = df.drop(columns=["TARGET"])
    y = df["TARGET"]

    # First split: 85% development, 15% final test
    X_development, X_test, y_development, y_test = train_test_split(X,y,test_size=0.15,random_state=RANDOM_STATE,stratify=y,)

    # Second split: development → 70% train, 15% validation
    # 15% / 85% = approximately 17.65% of development
    X_train, X_valid, y_train, y_valid = train_test_split(X_development,y_development, test_size=0.17647,random_state=RANDOM_STATE,stratify=y_development,)

    return (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
       )

def main():
    print("Loading dataset...")

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset shape: {df.shape}")

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    X_train.to_csv(OUTPUT_DIR / "X_train.csv", index=False)
    X_valid.to_csv(OUTPUT_DIR / "X_valid.csv", index=False)
    X_test.to_csv(OUTPUT_DIR / "X_test.csv", index=False)

    y_train.to_csv(OUTPUT_DIR / "y_train.csv", index=False)
    y_valid.to_csv(OUTPUT_DIR / "y_valid.csv", index=False)
    y_test.to_csv(OUTPUT_DIR / "y_test.csv", index=False)

    print("\nSplit complete")
    print("Training features:", X_train.shape , "\nValidations features: \n",X_valid.shape)

    print("\nTraining target distribution:\n",y_train.value_counts(normalize=True))
    print("\nValidation target distribution: \n",y_valid.value_counts(normalize=True))



if __name__ == "__main__":
    main()