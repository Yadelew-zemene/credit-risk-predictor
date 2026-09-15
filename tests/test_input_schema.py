from api.schemas import ApplicantRequest


def test_applicant_request_accepts_valid_data():
    applicant = ApplicantRequest(
        contract_type="Cash loans",
        gender="M",
        owns_car="Y",
        owns_realty="Y",
        children_count=0,
        family_members=2,
        family_status="Married",
        education_type="Higher education",
        income_type="Working",
        occupation_type="Managers",
        housing_type="House / apartment",
        annual_income=180000,
        credit_amount=500000,
        annuity_amount=25000,
        goods_price=450000,
        age_years=32,
        employment_years=5,
        registration_years=10,
        id_published_years=4,
        car_age=3,
        region_population_relative=0.02,
        region_rating=2,
        region_rating_city=2,
        external_source_1=0.5,
        external_source_2=0.6,
        external_source_3=0.7,
    )

    assert applicant.annual_income == 180000
    assert applicant.age_years == 32