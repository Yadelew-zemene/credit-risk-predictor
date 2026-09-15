from data_understanding import load_data
from data_split import DATA_PATH, split_data

from feature_engineering import create_features

from model_pipeline import (
    FeatureEngineeringTransformer,
    IdentifierRemovalTransformer,
    PreprocessingTransformer,
    build_final_xgboost_model,
    LoanDefaultPredictor,
)


def main():

    print("\nLoading data...")
    df = load_data(DATA_PATH)

    (
        X_train,
        X_valid,
        X_test,
        y_train,
        y_valid,
        y_test,
    ) = split_data(df)

    print("Train shape:", X_train.shape)
    print("Validation shape:", X_valid.shape)
    print("Test shape:", X_test.shape)


   # Feature engineering
    feature_transformer = FeatureEngineeringTransformer()

    X_train = feature_transformer.fit_transform(X_train)
    X_valid = feature_transformer.transform(X_valid)
    X_test = feature_transformer.transform(X_test)

    print("\nAfter feature engineering:")
    print("Train:", X_train.shape)
    print("Validation:", X_valid.shape)
    print("Test:", X_test.shape)


     # Identifier removal
    identifier_transformer = IdentifierRemovalTransformer()

    X_train = identifier_transformer.fit_transform(X_train)
    X_valid = identifier_transformer.transform(X_valid)
    X_test = identifier_transformer.transform(X_test)

    print("\nAfter identifier removal:")
    print("Train:", X_train.shape)
    print("SK_ID_CURR present:", "SK_ID_CURR" in X_train.columns)


    # Preprocessing
    preprocessing = PreprocessingTransformer()
    X_train_processed = preprocessing.fit_transform(X_train,y_train, )

    X_valid_processed = preprocessing.transform( X_valid )
    X_test_processed = preprocessing.transform( X_test)

    print("\nAfter preprocessing:")
    print("Train:", X_train_processed.shape)
    print("Validation:", X_valid_processed.shape)
    print("Test:", X_test_processed.shape)

    print("\nNumerical features:",len(preprocessing.numerical_features), )
    print("Categorical features:",len(preprocessing.categorical_features),)


    #  Build and train final model
    model = build_final_xgboost_model()
    print("\nTraining final XGBoost model...")

    model.fit( X_train_processed, y_train,)
    print("Training complete.")


    # 5. Prediction wrapper
    predictor = LoanDefaultPredictor(
        model=model,
        threshold=0.65, )

    probabilities = predictor.predict_probability( X_valid_processed )
    predictions = predictor.predict( X_valid_processed )

    print("\nPrediction test:")
    print("First probabilities:", probabilities[:5])
    print("First predictions:", predictions[:5])

    print( "\nProbability range:",probabilities.min(),"to", probabilities.max(),)
    print("Threshold:", predictor.threshold,)




if __name__ == "__main__":
    main()