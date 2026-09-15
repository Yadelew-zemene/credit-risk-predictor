"""
Test loading the saved production artifact
and making a prediction without retraining.
"""

from pathlib import Path
import joblib

from data_understanding import load_data
from data_split import DATA_PATH, split_data


PROJECT_ROOT = Path(__file__).resolve().parents[1]

ARTIFACT_PATH = (
    PROJECT_ROOT
    / "artifacts"
    / "loan_default_pipeline.joblib"
)


def main():


    #  Load saved artifact
    print("\nLoading saved artifact...")

    artifact = joblib.load(ARTIFACT_PATH)
    print("Artifact loaded successfully.")

    #  Get one raw applicant
    df = load_data(DATA_PATH)

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    applicant = X_valid.iloc[[0]].copy()
    print("\nApplicant shape:", applicant.shape)

    # Apply saved feature engineering
    applicant = artifact[ "feature_transformer" ].transform(applicant)

    #  Remove identifier
    applicant = artifact["identifier_transformer"].transform(applicant)

    #  Apply saved preprocessing
    applicant_processed = artifact[ "preprocessor"].transform(applicant)
    print("Processed applicant shape:",applicant_processed.shape,)


    # Predict
    predictor = artifact["predictor"]

    probability = predictor.predict_probability( applicant_processed)[0]
    prediction = predictor.predict( applicant_processed)[0]


    print("\nPrediction result\n-----------------")


    print(f"Default probability: {probability:.4f}")
    print(f"Decision threshold: {predictor.threshold:.2f}")
    print(f"Prediction: {prediction}")

    if prediction == 1:
        print("Decision: DEFAULT RISK")
    else:
        print("Decision: NO DEFAULT RISK")

    print("\nSaved artifact inference test PASSED.")


if __name__ == "__main__":
    main()