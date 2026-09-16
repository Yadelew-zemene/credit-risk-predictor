"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ProgressIndicator } from "./progress-indicator";

export interface AssessmentStep {
  id: number;
  title: string;
  description: string;
}

interface AssessmentShellProps {
  currentStep: number;
  steps: AssessmentStep[];
  children: React.ReactNode;
}

export function AssessmentShell({
  currentStep,
  steps,
  children,
}: AssessmentShellProps) {
  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-surface">
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
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Credit risk assessment
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Assess applicant risk
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Enter the applicant information below to generate an AI-powered
            credit risk assessment.
          </p>
        </div>

        <div className="mb-8">
          <ProgressIndicator currentStep={currentStep} steps={steps} />
        </div>

        {currentStepData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary-dark">
              {currentStepData.title}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {currentStepData.description}
            </p>
          </div>
        )}

        {children}
      </div>
    </main>
  );
}
