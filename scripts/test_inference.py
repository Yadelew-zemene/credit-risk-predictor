from data_understanding import load_data
from data_split import DATA_PATH, split_data

from inference import predict_applicant


def main():

    df = load_data(DATA_PATH)

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    # Use one raw applicant as an inference example.
    applicant = X_valid.iloc[[0]].copy()

    print("Applicant shape:", applicant.shape)
    result = predict_applicant(applicant)

    print("\nInference result ----------------")

    print(f"Default probability: {result['default_probability']:.4f}" )
    print(f"Threshold: {result['threshold']:.2f}")
    print(f"Prediction: {result['prediction']}" )
    print( f"Decision: {result['decision']}")



if __name__ == "__main__":
    main()