"use client";

import { useState } from "react";

import {
  AssessmentShell,
  type AssessmentStep,
} from "@/components/assessment/assessment-shell";

import { ApplicantForm } from "@/components/assessment/applicant-form";

import { AssessmentResult } from "@/components/assessment/results/assessment-result";

import type {
  ApplicantRequest,
  PredictionResponse,
} from "@/lib/types";

import { predictApplicant } from "@/lib/api";

const assessmentSteps: AssessmentStep[] = [
  {
    id: 1,
    title: "Applicant information",
    description: "Basic demographic and household information",
  },
  {
    id: 2,
    title: "Financial information",
    description: "Income, credit, and loan details",
  },
  {
    id: 3,
    title: "Employment & history",
    description: "Employment and applicant history",
  },
  {
    id: 4,
    title: "Additional signals",
    description: "Regional and external model inputs",
  },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  async function handleSubmit(values: ApplicantRequest) {
    setIsSubmitting(true);
    setError(null);

    try {
      const prediction = await predictApplicant(values);

      setResult(prediction);
    } catch (error) {
      console.error("Prediction failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete the assessment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewAssessment() {
    setResult(null);
    setError(null);
    setCurrentStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (result) {
    return (
      <AssessmentResult
        result={result}
        onNewAssessment={handleNewAssessment}
      />
    );
  }

  return (
    <AssessmentShell
      currentStep={currentStep}
      steps={assessmentSteps}
    >
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <p className="font-semibold">Assessment could not be completed.</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      <ApplicantForm
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onNext={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {isSubmitting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/20 px-5 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Analyzing applicant risk"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface px-6 py-6 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            </div>

            <p className="mt-4 text-sm font-semibold text-primary-dark">
              Analyzing applicant risk...
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Running the trained credit-risk model. This should only take a
              moment.
            </p>
          </div>
        </div>
      )}
    </AssessmentShell>
  );
}