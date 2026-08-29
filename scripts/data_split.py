from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


RANDOM_STATE = 42

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATA_PATH = (PROJECT_ROOT / "data" / "raw"  / "home-credit-default-risk" / "application_train.csv")
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"


def main():
    print("Loading dataset...")

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset shape: {df.shape}")

    X,y = df.drop(columns=["TARGET"]), df["TARGET"]
    X_train, X_valid, y_train, y_valid = train_test_split(X, y,test_size=0.20,stratify=y,random_state=RANDOM_STATE,
                                                          )
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    X_train.to_csv(OUTPUT_DIR / "X_train.csv", index=False)
    X_valid.to_csv(OUTPUT_DIR / "X_valid.csv", index=False)

    y_train.to_csv(OUTPUT_DIR / "y_train.csv", index=False)
    y_valid.to_csv(OUTPUT_DIR / "y_valid.csv", index=False)

    print("\nSplit complete")
    print("Training features:", X_train.shape , "\nValidations features: \n",X_valid.shape)

    print("\nTraining target distribution:\n",y_train.value_counts(normalize=True))
    print("\nValidation target distribution: \n",y_valid.value_counts(normalize=True))



if __name__ == "__main__":
    main()