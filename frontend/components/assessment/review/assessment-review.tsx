"use client";

import {
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Home,
  Loader2,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
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
    <section className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:border-slate-300">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100/70">
            <Icon size={19} className="stroke-[2.25]" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Pencil size={13} className="text-slate-500" />
          <span>Edit</span>
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {children}
        </dl>
      </div>
    </section>
  );
}

interface ReviewFieldProps {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function ReviewField({ label, value, highlight = false }: ReviewFieldProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50/60 px-3.5 py-2.5 transition-colors hover:bg-slate-50">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd
        className={`break-words text-sm ${
          highlight
            ? "font-bold text-slate-900"
            : "font-semibold text-slate-800"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

// Utility Formatter Helpers
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
  if (value === 1) return "1 year";
  return `${formatNumber(value)} years`;
}

function formatNullableNumber(value: number | null) {
  return value === null ? (
    <span className="font-normal italic text-slate-400">Not provided</span>
  ) : (
    formatNumber(value)
  );
}

function formatYesNoBadge(value: "Y" | "N") {
  const isYes = value === "Y";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
        isYes
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/10"
      }`}
    >
      {isYes ? <Check size={12} /> : <X size={12} />}
      {isYes ? "Yes" : "No"}
    </span>
  );
}

function formatContractType(value: ApplicantRequest["contract_type"]) {
  return value === "Cash loans" ? "Cash loan" : "Revolving loan";
}

function formatExternalScore(value: number | null) {
  if (value === null) {
    return <span className="font-normal italic text-slate-400">Not provided</span>;
  }
  return (
    <span className="font-mono text-xs font-bold tracking-tight text-slate-900">
      {value.toFixed(3)}
    </span>
  );
}

export function AssessmentReview({
  values,
  onEditStep,
  onBack,
  onConfirm,
  isSubmitting = false,
}: AssessmentReviewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Banner Notice */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/80 via-indigo-50/30 to-blue-50/50 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <FileCheck2 size={20} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">
              Review Applicant Information
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              Please verify all entries below before triggering the risk assessment engine.
              Clicking <span className="font-medium text-slate-900">Edit</span> on any section will allow you to modify parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        {/* Section 1: Applicant Information */}
        <ReviewSection
          title="Applicant Details"
          description="Personal, household, and demographic details"
          icon={UserRound}
          onEdit={() => onEditStep(1)}
        >
          <ReviewField
            label="Contract type"
            value={formatContractType(values.contract_type)}
          />
          <ReviewField
            label="Gender"
            value={values.gender === "M" ? "Male" : "Female"}
          />
          <ReviewField
            label="Age"
            value={formatYears(values.age_years)}
          />
          <ReviewField
            label="Children count"
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
            label="Education type"
            value={values.education_type}
          />
          <ReviewField
            label="Income type"
            value={values.income_type}
          />
          <ReviewField
            label="Occupation"
            value={
              values.occupation_type ?? (
                <span className="font-normal italic text-slate-400">
                  Not provided
                </span>
              )
            }
          />
          <ReviewField
            label="Housing type"
            value={values.housing_type}
          />
          <ReviewField
            label="Owns a car"
            value={formatYesNoBadge(values.owns_car)}
          />
          <ReviewField
            label="Owns realty"
            value={formatYesNoBadge(values.owns_realty)}
          />
        </ReviewSection>

        {/* Section 2: Financial Information */}
        <ReviewSection
          title="Financial Profile"
          description="Income, credit lines, and requested amounts"
          icon={CircleDollarSign}
          onEdit={() => onEditStep(2)}
        >
          <ReviewField
            label="Annual income"
            value={formatCurrency(values.annual_income)}
            highlight
          />
          <ReviewField
            label="Credit amount"
            value={formatCurrency(values.credit_amount)}
            highlight
          />
          <ReviewField
            label="Annuity amount"
            value={formatCurrency(values.annuity_amount)}
          />
          <ReviewField
            label="Goods price"
            value={
              values.goods_price === null
                ? <span className="font-normal italic text-slate-400">Not provided</span>
                : formatCurrency(values.goods_price)
            }
          />
        </ReviewSection>

        {/* Section 3: Employment and History */}
        <ReviewSection
          title="Employment & History"
          description="Work experience and official record duration"
          icon={BriefcaseBusiness}
          onEdit={() => onEditStep(3)}
        >
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
                ? <span className="font-normal italic text-slate-400">Not provided</span>
                : formatYears(values.car_age)
            }
          />
        </ReviewSection>

        {/* Section 4: Additional Signals */}
        <ReviewSection
          title="External Signals & Ratings"
          description="Regional data inputs and third-party scoring"
          icon={Home}
          onEdit={() => onEditStep(4)}
        >
          <ReviewField
            label="Region population relative"
            value={formatNullableNumber(values.region_population_relative)}
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
        </ReviewSection>
      </div>

      {/* Confirmation Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Ready to submit assessment?
            </h4>
            <p className="text-xs text-slate-500">
              CrediSense will calculate default probabilities and render an evaluation decision instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back to information
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Evaluating model...
            </>
          ) : (
            <>
              <ShieldCheck size={17} />
              Run assessment
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}