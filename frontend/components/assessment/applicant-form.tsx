"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Home,
  Landmark,
  UserRound,
} from "lucide-react";

import {
  applicantSchema,
  type ApplicantFormValues,
} from "@/lib/validation";

import type { ApplicantRequest } from "@/lib/types";

import { FormSection } from "./form-section";
import { AssessmentReview } from "./review/assessment-review";

interface ApplicantFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: (values: ApplicantRequest) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

const TOTAL_STEPS = 4;

const stepFields: FieldPath<ApplicantFormValues>[][] = [
  [
    "contract_type",
    "gender",
    "age_years",
    "children_count",
    "family_members",
    "family_status",
    "education_type",
    "income_type",
    "occupation_type",
    "housing_type",
    "owns_car",
    "owns_realty",
  ],
  [
    "annual_income",
    "credit_amount",
    "annuity_amount",
    "goods_price",
  ],
  [
    "employment_years",
    "registration_years",
    "id_published_years",
    "car_age",
  ],
  [
    "region_population_relative",
    "region_rating",
    "region_rating_city",
    "external_source_1",
    "external_source_2",
    "external_source_3",
  ],
];

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-xs font-medium text-danger">
      {message}
    </p>
  );
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-primary-dark">
      {label}
      {required && (
        <span className="ml-1 text-danger">*</span>
      )}
    </label>
  );
}

function InputShell({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-surface transition-all",
        error
          ? "border-danger ring-2 ring-danger/10"
          : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function ApplicantForm({
  currentStep,
  onStepChange,
  onNext,
  onBack,
  isSubmitting = false,
}: ApplicantFormProps) {
  const [isReviewing, setIsReviewing] = useState(false);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
    shouldFocusError: true,

    defaultValues: {
      contract_type: "Cash loans",
      gender: "M",
      owns_car: "N",
      owns_realty: "Y",

      children_count: 0,
      family_members: 1,

      family_status: "",
      education_type: "",
      income_type: "",
      occupation_type: null,
      housing_type: "",

      annual_income: undefined,
      credit_amount: undefined,
      annuity_amount: undefined,
      goods_price: null,

      age_years: undefined,
      employment_years: 0,
      registration_years: 0,
      id_published_years: 0,
      car_age: null,

      region_population_relative: null,
      region_rating: null,
      region_rating_city: null,

      external_source_1: null,
      external_source_2: null,
      external_source_3: null,
    },
  });

  /*
   * ---------------------------------------------------------
   * STEP NAVIGATION
   * ---------------------------------------------------------
   */

  async function handleNext() {
    const fields = stepFields[currentStep - 1];

    if (!fields) {
      return;
    }

    const valid = await trigger(fields, {
      shouldFocus: true,
    });

    if (!valid) {
      return;
    }

    /*
     * Steps 1-3:
     * Validate current step and move forward.
     */
    if (currentStep < TOTAL_STEPS) {
      onStepChange(currentStep + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    /*
     * Step 4:
     * Do NOT immediately submit.
     *
     * First show the review screen so the user can verify
     * everything before sending it to the ML API.
     */
    setIsReviewing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleBack() {
    /*
     * If we are editing step 2-4, move to the previous step.
     */
    if (currentStep > 1) {
      onStepChange(currentStep - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    /*
     * If we are already on step 1, allow the parent page
     * to decide what "Back" means.
     */
    onBack?.();
  }

  /*
   * ---------------------------------------------------------
   * REVIEW SCREEN
   * ---------------------------------------------------------
   */

  function handleReviewEdit(step: number) {
    setIsReviewing(false);

    onStepChange(step);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleReviewBack() {
    /*
     * Return from review to the final form step.
     *
     * We intentionally keep the current form values because
     * React Hook Form is still mounted.
     */
    setIsReviewing(false);

    onStepChange(TOTAL_STEPS);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleReviewConfirm() {
    /*
     * The user has reviewed the complete application.
     *
     * getValues() returns the latest values from React Hook Form.
     */
    const values = getValues();

    onNext(values as ApplicantRequest);
  }

  /*
   * ---------------------------------------------------------
   * REVIEW RENDER
   * ---------------------------------------------------------
   */

  if (isReviewing) {
    return (
      <AssessmentReview
        values={getValues() as ApplicantRequest}
        onEditStep={handleReviewEdit}
        onBack={handleReviewBack}
        onConfirm={handleReviewConfirm}
        isSubmitting={isSubmitting}
      />
    );
  }

  /*
   * ---------------------------------------------------------
   * CURRENT STEP STATE
   * ---------------------------------------------------------
   */

  const currentFields = stepFields[currentStep - 1] ?? [];

  const errorCount = Object.keys(errors).filter((key) =>
    currentFields.includes(
      key as FieldPath<ApplicantFormValues>,
    ),
  ).length;

  /*
   * ---------------------------------------------------------
   * FORM
   * ---------------------------------------------------------
   */

  return (
    <div className="space-y-6">
      {/* =====================================================
          STEP 1 — APPLICANT PROFILE
          ===================================================== */}

      {currentStep === 1 && (
        <FormSection
          title="Applicant profile"
          description="Basic information about the applicant and household."
          icon={UserRound}
        >
          {/* Loan type */}
          <div>
            <FieldLabel label="Loan type" required />

            <InputShell error={!!errors.contract_type}>
              <select
                {...register("contract_type")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="Cash loans">
                  Cash loan
                </option>

                <option value="Revolving loans">
                  Revolving loan
                </option>
              </select>
            </InputShell>

            <FieldError
              message={errors.contract_type?.message}
            />
          </div>

          {/* Gender */}
          <div>
            <FieldLabel label="Gender" required />

            <InputShell error={!!errors.gender}>
              <select
                {...register("gender")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </InputShell>

            <FieldError
              message={errors.gender?.message}
            />
          </div>

          {/* Age */}
          <div>
            <FieldLabel label="Age" required />

            <InputShell error={!!errors.age_years}>
              <input
                type="number"
                min="18"
                max="100"
                step="0.1"
                placeholder="e.g. 35"
                {...register("age_years", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.age_years?.message}
            />
          </div>

          {/* Children */}
          <div>
            <FieldLabel
              label="Number of children"
              required
            />

            <InputShell
              error={!!errors.children_count}
            >
              <input
                type="number"
                min="0"
                step="1"
                {...register("children_count", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              />
            </InputShell>

            <FieldError
              message={errors.children_count?.message}
            />
          </div>

          {/* Family members */}
          <div>
            <FieldLabel
              label="Family members"
              required
            />

            <InputShell
              error={!!errors.family_members}
            >
              <input
                type="number"
                min="1"
                step="1"
                {...register("family_members", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              />
            </InputShell>

            <FieldError
              message={errors.family_members?.message}
            />
          </div>

          {/* Family status */}
          <div>
            <FieldLabel
              label="Family status"
              required
            />

            <InputShell
              error={!!errors.family_status}
            >
              <select
                {...register("family_status")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="">
                  Select status
                </option>

                <option value="Single / not married">
                  Single / not married
                </option>

                <option value="Married">
                  Married
                </option>

                <option value="Civil marriage">
                  Civil marriage
                </option>

                <option value="Widow">
                  Widow
                </option>

                <option value="Separated">
                  Separated
                </option>

                <option value="Unknown">
                  Unknown
                </option>
              </select>
            </InputShell>

            <FieldError
              message={errors.family_status?.message}
            />
          </div>

          {/* Education */}
          <div>
            <FieldLabel
              label="Education"
              required
            />

            <InputShell
              error={!!errors.education_type}
            >
              <select
                {...register("education_type")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="">
                  Select education
                </option>

                <option value="Lower secondary">
                  Lower secondary
                </option>

                <option value="Secondary / secondary special">
                  Secondary
                </option>

                <option value="Incomplete higher">
                  Incomplete higher
                </option>

                <option value="Higher education">
                  Higher education
                </option>

                <option value="Academic degree">
                  Academic degree
                </option>
              </select>
            </InputShell>

            <FieldError
              message={errors.education_type?.message}
            />
          </div>

          {/* Income type */}
          <div>
            <FieldLabel
              label="Income type"
              required
            />

            <InputShell
              error={!!errors.income_type}
            >
              <select
                {...register("income_type")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="">
                  Select income type
                </option>

                <option value="Working">
                  Working
                </option>

                <option value="Commercial associate">
                  Commercial associate
                </option>

                <option value="Pensioner">
                  Pensioner
                </option>

                <option value="State servant">
                  State servant
                </option>

                <option value="Student">
                  Student
                </option>

                <option value="Businessman">
                  Businessman
                </option>

                <option value="Maternity leave">
                  Maternity leave
                </option>

                <option value="Unemployed">
                  Unemployed
                </option>
              </select>
            </InputShell>

            <FieldError
              message={errors.income_type?.message}
            />
          </div>

          {/* Occupation */}
          <div>
            <FieldLabel label="Occupation" />

            <InputShell
              error={!!errors.occupation_type}
            >
              <input
                type="text"
                placeholder="e.g. IT staff"
                {...register("occupation_type")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.occupation_type?.message}
            />
          </div>

          {/* Housing */}
          <div>
            <FieldLabel
              label="Housing type"
              required
            />

            <InputShell
              error={!!errors.housing_type}
            >
              <select
                {...register("housing_type")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="">
                  Select housing
                </option>

                <option value="House / apartment">
                  House / apartment
                </option>

                <option value="With parents">
                  With parents
                </option>

                <option value="Municipal apartment">
                  Municipal apartment
                </option>

                <option value="Rented apartment">
                  Rented apartment
                </option>

                <option value="Office apartment">
                  Office apartment
                </option>

                <option value="Co-op apartment">
                  Co-op apartment
                </option>
              </select>
            </InputShell>

            <FieldError
              message={errors.housing_type?.message}
            />
          </div>

          {/* Car */}
          <div>
            <FieldLabel
              label="Owns a car"
              required
            />

            <InputShell error={!!errors.owns_car}>
              <select
                {...register("owns_car")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="N">No</option>
                <option value="Y">Yes</option>
              </select>
            </InputShell>

            <FieldError
              message={errors.owns_car?.message}
            />
          </div>

          {/* Real estate */}
          <div>
            <FieldLabel
              label="Owns real estate"
              required
            />

            <InputShell
              error={!!errors.owns_realty}
            >
              <select
                {...register("owns_realty")}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </InputShell>

            <FieldError
              message={errors.owns_realty?.message}
            />
          </div>
        </FormSection>
      )}

      {/* =====================================================
          STEP 2 — FINANCIAL INFORMATION
          ===================================================== */}

      {currentStep === 2 && (
        <FormSection
          title="Financial information"
          description="Provide the applicant's income and loan-related financial information."
          icon={Landmark}
        >
          {/* Annual income */}
          <div>
            <FieldLabel
              label="Annual income"
              required
            />

            <InputShell
              error={!!errors.annual_income}
            >
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 180000"
                {...register("annual_income", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.annual_income?.message}
            />
          </div>

          {/* Credit amount */}
          <div>
            <FieldLabel
              label="Credit amount"
              required
            />

            <InputShell
              error={!!errors.credit_amount}
            >
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 500000"
                {...register("credit_amount", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.credit_amount?.message}
            />
          </div>

          {/* Annuity */}
          <div>
            <FieldLabel
              label="Annuity amount"
              required
            />

            <InputShell
              error={!!errors.annuity_amount}
            >
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 25000"
                {...register("annuity_amount", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.annuity_amount?.message}
            />
          </div>

          {/* Goods price */}
          <div>
            <FieldLabel label="Goods price" />

            <InputShell
              error={!!errors.goods_price}
            >
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Optional"
                {...register("goods_price", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.goods_price?.message}
            />
          </div>
        </FormSection>
      )}

      {/* =====================================================
          STEP 3 — EMPLOYMENT & HISTORY
          ===================================================== */}

      {currentStep === 3 && (
        <FormSection
          title="Employment & history"
          description="Provide employment duration and relevant applicant history."
          icon={BriefcaseBusiness}
        >
          {/* Employment */}
          <div>
            <FieldLabel
              label="Employment duration"
              required
            />

            <InputShell
              error={!!errors.employment_years}
            >
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Years"
                {...register("employment_years", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.employment_years?.message
              }
            />
          </div>

          {/* Registration */}
          <div>
            <FieldLabel
              label="Registration duration"
              required
            />

            <InputShell
              error={!!errors.registration_years}
            >
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Years"
                {...register("registration_years", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.registration_years?.message
              }
            />
          </div>

          {/* ID publication */}
          <div>
            <FieldLabel
              label="ID publication duration"
              required
            />

            <InputShell
              error={!!errors.id_published_years}
            >
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Years"
                {...register("id_published_years", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.id_published_years?.message
              }
            />
          </div>

          {/* Car age */}
          <div>
            <FieldLabel label="Car age" />

            <InputShell error={!!errors.car_age}>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Optional"
                {...register("car_age", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={errors.car_age?.message}
            />
          </div>
        </FormSection>
      )}

      {/* =====================================================
          STEP 4 — ADDITIONAL SIGNALS
          ===================================================== */}

      {currentStep === 4 && (
        <FormSection
          title="Additional signals"
          description="Optional regional and external model signals."
          icon={Home}
        >
          {/* Population */}
          <div>
            <FieldLabel label="Region population relative" />

            <InputShell
              error={
                !!errors.region_population_relative
              }
            >
              <input
                type="number"
                min="0"
                step="0.000001"
                placeholder="Optional"
                {...register(
                  "region_population_relative",
                  {
                    setValueAs: (value) =>
                      value === ""
                        ? null
                        : Number(value),
                  },
                )}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.region_population_relative
                  ?.message
              }
            />
          </div>

          {/* Region rating */}
          <div>
            <FieldLabel label="Region rating" />

            <InputShell
              error={!!errors.region_rating}
            >
              <select
                {...register("region_rating", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="">
                  Not provided
                </option>

                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </InputShell>

            <FieldError
              message={errors.region_rating?.message}
            />
          </div>

          {/* City rating */}
          <div>
            <FieldLabel label="Region city rating" />

            <InputShell
              error={!!errors.region_rating_city}
            >
              <select
                {...register("region_rating_city", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none"
              >
                <option value="">
                  Not provided
                </option>

                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </InputShell>

            <FieldError
              message={
                errors.region_rating_city?.message
              }
            />
          </div>

          {/* External source 1 */}
          <div>
            <FieldLabel label="External source 1" />

            <InputShell
              error={!!errors.external_source_1}
            >
              <input
                type="number"
                min="0"
                max="1"
                step="0.000001"
                placeholder="0 to 1"
                {...register("external_source_1", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.external_source_1?.message
              }
            />
          </div>

          {/* External source 2 */}
          <div>
            <FieldLabel label="External source 2" />

            <InputShell
              error={!!errors.external_source_2}
            >
              <input
                type="number"
                min="0"
                max="1"
                step="0.000001"
                placeholder="0 to 1"
                {...register("external_source_2", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.external_source_2?.message
              }
            />
          </div>

          {/* External source 3 */}
          <div>
            <FieldLabel label="External source 3" />

            <InputShell
              error={!!errors.external_source_3}
            >
              <input
                type="number"
                min="0"
                max="1"
                step="0.000001"
                placeholder="0 to 1"
                {...register("external_source_3", {
                  setValueAs: (value) =>
                    value === ""
                      ? null
                      : Number(value),
                })}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-muted/60"
              />
            </InputShell>

            <FieldError
              message={
                errors.external_source_3?.message
              }
            />
          </div>
        </FormSection>
      )}

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <div className="sticky bottom-4 z-10 rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur sm:p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Back */}
          <button
            type="button"
            onClick={handleBack}
            disabled={
              isSubmitting ||
              (currentStep === 1 && !onBack)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} />

            Back
          </button>

          <div className="flex items-center gap-3">
            {/* Desktop validation message */}
            {errorCount > 0 && (
              <span className="hidden text-xs font-medium text-danger sm:block">
                {errorCount} field
                {errorCount > 1 ? "s" : ""} need attention
              </span>
            )}

            {/* Mobile step indicator */}
            <span className="text-xs font-medium text-muted sm:hidden">
              Step {currentStep} of {TOTAL_STEPS}
            </span>

            {/* Continue / Review */}
            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentStep === TOTAL_STEPS
                ? "Review assessment"
                : "Continue"}

              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}