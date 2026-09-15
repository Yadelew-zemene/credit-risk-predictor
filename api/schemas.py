from typing import Literal

from pydantic import BaseModel, Field


class ApplicantRequest(BaseModel):
    """
    User-facing loan application data.

    The API converts this human-friendly representation
    into the raw Home Credit feature format expected by
    the machine learning pipeline.
    """

    contract_type: Literal["Cash loans", "Revolving loans"]

    gender: Literal["M", "F"]

    owns_car: Literal["Y", "N"]

    owns_realty: Literal["Y", "N"]

    children_count: int = Field(ge=0)

    family_members: float = Field(gt=0)

    family_status: str

    education_type: str

    income_type: str

    occupation_type: str | None = None

    housing_type: str

    annual_income: float = Field(gt=0)

    credit_amount: float = Field(gt=0)

    annuity_amount: float = Field(gt=0)

    goods_price: float | None = Field(default=None, gt=0)

    age_years: float = Field(gt=18, lt=100)

    employment_years: float = Field(ge=0)

    registration_years: float = Field(ge=0)

    id_published_years: float = Field(ge=0)

    car_age: float | None = Field(default=None, ge=0)

    region_population_relative: float | None = Field(
        default=None,
        ge=0,
    )

    region_rating: int | None = Field(
        default=None,
        ge=1,
        le=3,
    )

    region_rating_city: int | None = Field(
        default=None,
        ge=1,
        le=3,
    )

    external_source_1: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    external_source_2: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    external_source_3: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )