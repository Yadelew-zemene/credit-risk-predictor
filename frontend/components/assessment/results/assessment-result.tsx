"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { PredictionResponse } from "@/lib/types";

interface AssessmentResultProps {
  result: PredictionResponse;
  onNewAssessment: () => void;
}

function getProbabilityLabel(probability: number) {
  if (probability < 0.2) {
    return "Lower estimated risk";
  }

  if (probability < 0.4) {
    return "Moderate estimated risk";
  }

  if (probability < 0.65) {
    return "Elevated estimated risk";
  }

  return "Higher estimated risk";
}

export function AssessmentResult({
  result,
  onNewAssessment,
}: AssessmentResultProps) {
  const probabilityPercent = result.default_probability * 100;
  const thresholdPercent = result.threshold * 100;

  const isDefaultRisk = result.prediction === 1;

  const probabilityLabel = getProbabilityLabel(
    result.default_probability,
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-primary-dark transition-colors hover:text-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              C
            </span>
            CrediSense
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <ShieldCheck size={15} />
            Secure assessment workflow
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <span className="hidden text-xs font-medium text-muted sm:block">
            Credit risk assessment
          </span>
        </div>

        {/* Completion heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles size={25} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Assessment complete
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Applicant risk assessment
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            CrediSense has analyzed the submitted applicant information using
            the trained credit-risk model.
          </p>
        </div>

        {/* Main result card */}
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          {/* Decision */}
          <div
            className={
              isDefaultRisk
                ? "border-b border-danger/15 bg-danger/5 px-5 py-8 sm:px-8 sm:py-10"
                : "border-b border-success/15 bg-success/5 px-5 py-8 sm:px-8 sm:py-10"
            }
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={
                  isDefaultRisk
                    ? "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger"
                    : "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success"
                }
              >
                {isDefaultRisk ? (
                  <CircleAlert size={28} />
                ) : (
                  <CheckCircle2 size={28} />
                )}
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Model decision
              </p>

              <h2
                className={
                  isDefaultRisk
                    ? "mt-2 text-2xl font-bold text-danger sm:text-3xl"
                    : "mt-2 text-2xl font-bold text-success sm:text-3xl"
                }
              >
                {result.decision}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                {isDefaultRisk
                  ? "The estimated default probability is at or above the model's decision threshold."
                  : "The estimated default probability is below the model's decision threshold."}
              </p>
            </div>
          </div>

          {/* Probability */}
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary-dark">
                      Estimated default probability
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Model-estimated likelihood based on the submitted
                      applicant information.
                    </p>
                  </div>

                  <p className="shrink-0 text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
                    {probabilityPercent.toFixed(1)}%
                  </p>
                </div>

                {/* Probability meter */}
                <div className="mt-8">
                  <div
                    className="relative h-3 rounded-full bg-surface-muted"
                    role="progressbar"
                    aria-label="Estimated default probability"
                    aria-valuenow={probabilityPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={
                        isDefaultRisk
                          ? "absolute inset-y-0 left-0 rounded-full bg-danger transition-all duration-700"
                          : "absolute inset-y-0 left-0 rounded-full bg-success transition-all duration-700"
                      }
                      style={{
                        width: `${Math.min(
                          Math.max(probabilityPercent, 0),
                          100,
                        )}%`,
                      }}
                    />

                    {/* Threshold marker */}
                    <div
                      className="absolute -top-2 h-7 w-0.5 bg-primary-dark"
                      style={{
                        left: `${thresholdPercent}%`,
                      }}
                      aria-hidden="true"
                    >
                      <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-muted">
                        Threshold {thresholdPercent.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center justify-between text-xs text-muted">
                    <span>0%</span>
                    <span>Estimated probability</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-surface-muted/50 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-primary-dark">
                        {probabilityLabel}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        The probability is compared with the model's
                        {` ${thresholdPercent.toFixed(0)}% `}
                        decision threshold to determine the displayed
                        classification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision threshold card */}
              <div className="rounded-2xl border border-border bg-surface-muted/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Decision threshold
                </p>

                <p className="mt-2 text-3xl font-bold text-primary-dark">
                  {thresholdPercent.toFixed(0)}%
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Probability</span>
                    <span className="font-semibold text-primary-dark">
                      {probabilityPercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Classification</span>
                    <span
                      className={
                        isDefaultRisk
                          ? "font-semibold text-danger"
                          : "font-semibold text-success"
                      }
                    >
                      {isDefaultRisk ? "Above threshold" : "Below threshold"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model information */}
          <div className="border-t border-border px-5 py-6 sm:px-8">
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Model
                </p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  XGBoost Tuned
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Assessment type
                </p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  Binary classification
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Decision basis
                </p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  Probability threshold
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsible AI */}
        <section className="mt-6 rounded-2xl border border-border bg-surface px-5 py-6 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary-dark">
                Responsible AI notice
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted sm:text-sm">
                This result is a machine-learning estimate intended to support
                credit-risk analysis. It is not a guarantee of repayment or
                an automatic lending decision. Final lending decisions should
                consider appropriate human review, institutional policies,
                regulatory requirements, and additional relevant information.
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-surface-muted"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <button
            type="button"
            onClick={onNewAssessment}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <RotateCcw size={16} />
            Assess another applicant
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          CrediSense provides model-based decision support and does not
          replace professional credit assessment.
        </p>
      </div>
    </main>
  );
}