from api.db.database import get_db
from api.db.repository import save_assessment,get_assessments
from api.schemas import ApplicantRequest


def test_save_assessment():
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
        goods_price=500000,
        age_years=35,
        employment_years=8,
        registration_years=5,
        id_published_years=10,
        car_age=5,
        region_population_relative=0.02,
        region_rating=2,
        region_rating_city=2,
        external_source_1=0.7,
        external_source_2=0.6,
        external_source_3=0.8,
    )

    prediction = {
        "default_probability": 0.35,
        "threshold": 0.65,
        "prediction": 0,
        "decision": "NO DEFAULT RISK",
    }

    db = next(get_db())

    try:
        assessment = save_assessment(db, applicant, prediction)

        assert assessment.id is not None
        assert assessment.contract_type == applicant.contract_type
        assert assessment.annual_income == applicant.annual_income
        assert float(assessment.default_probability) == prediction["default_probability"]
        assert assessment.decision == prediction["decision"]

        db.delete(assessment)
        db.commit()
    finally:
        db.close()
def test_get_assessments():
    db = next(get_db())

    try:
        assessments = get_assessments(db, limit=20)

        assert isinstance(assessments, list)
        assert len(assessments) <= 20

        for assessment in assessments:
            assert assessment.id is not None
            assert assessment.created_at is not None
            assert assessment.decision in (
                "DEFAULT RISK",
                "NO DEFAULT RISK",
            )
    finally:
        db.close()