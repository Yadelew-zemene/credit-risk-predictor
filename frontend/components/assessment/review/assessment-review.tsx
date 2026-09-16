"use client";

import {
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Home,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type { ApplicantRequest } from "@/lib/types";

interface AssessmentReviewProps {
  values: ApplicantRequest;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

interface ReviewSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({
  title,
  description,
  icon: Icon,
  onEdit,
  children,
}: ReviewSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-border bg-surface-muted/40 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <Icon size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-primary-dark sm:text-lg">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-primary-dark transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-sm"
        >
          <Pencil size={14} />
          <span>Edit</span>
        </button>
      </div>

      <div className="divide-y divide-border px-5 sm:px-6">
        {children}
      </div>
    </section>
  );
}

interface ReviewFieldProps {
  label: string;
  value: string;
}

function ReviewField({ label, value }: ReviewFieldProps) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:gap-6">
      <dt className="text-xs font-medium text-muted sm:text-sm">{label}</dt>

      <dd className="break-words text-sm font-semibold text-primary-dark">
        {value}
      </dd>
    </div>
  );
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(value: number) {
  if (value === 1) {
    return "1 year";
  }

  return `${formatNumber(value)} years`;
}

function formatNullableNumber(value: number | null) {
  return value === null ? "Not provided" : formatNumber(value);
}

function formatYesNo(value: "Y" | "N") {
  return value === "Y" ? "Yes" : "No";
}

function formatGender(value: "M" | "F") {
  return value === "M" ? "Male" : "Female";
}

function formatContractType(value: ApplicantRequest["contract_type"]) {
  return value === "Cash loans" ? "Cash loan" : "Revolving loan";
}

function formatExternalScore(value: number | null) {
  return value === null ? "Not provided" : value.toFixed(3);
}

export function AssessmentReview({
  values,
  onEditStep,
  onBack,
  onConfirm,
  isSubmitting = false,
}: AssessmentReviewProps) {
  return (
    <div className="space-y-6">
      {/* Review introduction */}
      <div className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileCheck2 size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary-dark sm:text-base">
              Review before assessment
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted">
              Please verify the applicant information below before running the
              credit-risk model. You can edit any section before continuing.
            </p>
          </div>
        </div>
      </div>

      {/* Applicant information */}
      <ReviewSection
        title="Applicant information"
        description="Personal, household, and demographic information"
        icon={UserRound}
        onEdit={() => onEditStep(1)}
      >
        <dl>
          <ReviewField
            label="Contract type"
            value={formatContractType(values.contract_type)}
          />
          <ReviewField
            label="Gender"
            value={formatGender(values.gender)}
          />
          <ReviewField
            label="Age"
            value={formatYears(values.age_years)}
          />
          <ReviewField
            label="Children"
            value={formatNumber(values.children_count, 0)}
          />
          <ReviewField
            label="Family members"
            value={formatNumber(values.family_members)}
          />
          <ReviewField
            label="Family status"
            value={values.family_status}
          />
          <ReviewField
            label="Education"
            value={values.education_type}
          />
          <ReviewField
            label="Income type"
            value={values.income_type}
          />
          <ReviewField
            label="Occupation"
            value={values.occupation_type ?? "Not provided"}
          />
          <ReviewField
            label="Housing type"
            value={values.housing_type}
          />
          <ReviewField
            label="Owns a car"
            value={formatYesNo(values.owns_car)}
          />
          <ReviewField
            label="Owns realty"
            value={formatYesNo(values.owns_realty)}
          />
        </dl>
      </ReviewSection>

      {/* Financial information */}
      <ReviewSection
        title="Financial information"
        description="Income, credit, and loan details"
        icon={CircleDollarSign}
        onEdit={() => onEditStep(2)}
      >
        <dl>
          <ReviewField
            label="Annual income"
            value={formatCurrency(values.annual_income)}
          />
          <ReviewField
            label="Credit amount"
            value={formatCurrency(values.credit_amount)}
          />
          <ReviewField
            label="Annuity amount"
            value={formatCurrency(values.annuity_amount)}
          />
          <ReviewField
            label="Goods price"
            value={
              values.goods_price === null
                ? "Not provided"
                : formatCurrency(values.goods_price)
            }
          />
        </dl>
      </ReviewSection>

      {/* Employment and history */}
      <ReviewSection
        title="Employment & history"
        description="Employment and applicant history"
        icon={BriefcaseBusiness}
        onEdit={() => onEditStep(3)}
      >
        <dl>
          <ReviewField
            label="Employment duration"
            value={formatYears(values.employment_years)}
          />
          <ReviewField
            label="Registration duration"
            value={formatYears(values.registration_years)}
          />
          <ReviewField
            label="ID published duration"
            value={formatYears(values.id_published_years)}
          />
          <ReviewField
            label="Car age"
            value={
              values.car_age === null
                ? "Not provided"
                : formatYears(values.car_age)
            }
          />
        </dl>
      </ReviewSection>

      {/* Additional signals */}
      <ReviewSection
        title="Additional signals"
        description="Regional and external model inputs"
        icon={Home}
        onEdit={() => onEditStep(4)}
      >
        <dl>
          <ReviewField
            label="Region population relative"
            value={formatNullableNumber(
              values.region_population_relative,
            )}
          />
          <ReviewField
            label="Region rating"
            value={formatNullableNumber(values.region_rating)}
          />
          <ReviewField
            label="City rating"
            value={formatNullableNumber(values.region_rating_city)}
          />
          <ReviewField
            label="External source 1"
            value={formatExternalScore(values.external_source_1)}
          />
          <ReviewField
            label="External source 2"
            value={formatExternalScore(values.external_source_2)}
          />
          <ReviewField
            label="External source 3"
            value={formatExternalScore(values.external_source_3)}
          />
        </dl>
      </ReviewSection>

      {/* Confirmation notice */}
      <div className="rounded-2xl border border-border bg-surface px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-primary">
            <ShieldCheck size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-primary-dark">
              Ready to run the assessment?
            </p>

            <p className="mt-1 text-xs leading-5 text-muted sm:text-sm">
              CrediSense will send the reviewed information to the prediction
              service and return an estimated default probability and model
              classification.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back to information
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck size={17} />
          Run assessment
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}