"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Copy,
  Info,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import type { PredictionResponse } from "@/lib/types";

interface AssessmentResultProps {
  result: PredictionResponse;
  onNewAssessment: () => void;
}

function getResultMetadata(isDefaultRisk: boolean) {
  if (isDefaultRisk) {
    return {
      label: "Default Risk",
      description:
        "The model classified this applicant as having an estimated default probability at or above the production decision threshold.",
      accentColor: "text-rose-600",
      barColor: "bg-rose-500",
      borderColor: "border-rose-200",
      lightBackground: "bg-rose-50/60",
      icon: CircleAlert,
    };
  }

  return {
    label: "No Default Risk",
    description:
      "The model classified this applicant as having an estimated default probability below the production decision threshold.",
    accentColor: "text-emerald-600",
    barColor: "bg-emerald-500",
    borderColor: "border-emerald-200",
    lightBackground: "bg-emerald-50/60",
    icon: CheckCircle2,
  };
}

export function AssessmentResult({
  result,
  onNewAssessment,
}: AssessmentResultProps) {
  const [copied, setCopied] = useState(false);

  const probabilityPercent = result.default_probability * 100;
  const thresholdPercent = result.threshold * 100;
  const isDefaultRisk = result.prediction === 1;

  const resultMeta = getResultMetadata(isDefaultRisk);
  const ResultIcon = resultMeta.icon;

  const probabilityDistance = Math.abs(
    probabilityPercent - thresholdPercent,
  );

  const handleCopyReport = async () => {
    const summary = [
      "CrediSense Assessment Result",
      `Decision: ${result.decision}`,
      `Estimated default probability: ${probabilityPercent.toFixed(1)}%`,
      `Decision threshold: ${thresholdPercent.toFixed(0)}%`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-bold text-slate-900 transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
              C
            </span>
            <span>CrediSense</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>

        {/* Result Card */}
        <section
          className={`overflow-hidden rounded-3xl border bg-white shadow-xs ${resultMeta.borderColor}`}
        >
          {/* Result Header */}
          <div
            className={`border-b p-6 sm:p-8 ${resultMeta.lightBackground} ${resultMeta.borderColor}`}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ${resultMeta.accentColor}`}
                >
                  <ResultIcon size={26} />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Assessment complete
                  </span>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {result.decision}
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                    {resultMeta.description}
                  </p>
                </div>
              </div>

              {/* Probability */}
              <div className="shrink-0 rounded-2xl bg-white/90 px-5 py-4 text-left shadow-xs ring-1 ring-slate-900/5 sm:text-right">
                <p className="text-xs font-medium text-slate-500">
                  Estimated default probability
                </p>

                <p
                  className={`mt-1 text-3xl font-extrabold tracking-tight ${resultMeta.accentColor}`}
                >
                  {probabilityPercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Probability */}
          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Risk probability
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      The model&apos;s estimated probability of default compared
                      with the production decision threshold.
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-slate-700">
                    Threshold: {thresholdPercent.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Gauge */}
              <div className="space-y-3">
                <div className="relative h-4 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-4 rounded-full transition-all duration-700 ${resultMeta.barColor}`}
                    style={{
                      width: `${Math.min(
                        Math.max(probabilityPercent, 1),
                        100,
                      )}%`,
                    }}
                  />

                  {/* Threshold marker */}
                  <div
                    className="absolute bottom-[-6px] top-[-6px] w-0.5 bg-slate-900"
                    style={{
                      left: `${Math.min(Math.max(thresholdPercent, 0), 100)}%`,
                    }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Threshold
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span>0%</span>
                  <span className="text-slate-600">
                    {probabilityPercent.toFixed(1)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Interpretation */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-start gap-3">
                  <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      What this result means
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      The model estimated a{" "}
                      <strong className="text-slate-900">
                        {probabilityPercent.toFixed(1)}%
                      </strong>{" "}
                      probability of default. The production decision
                      threshold is{" "}
                      <strong className="text-slate-900">
                        {thresholdPercent.toFixed(0)}%
                      </strong>
                      . The model&apos;s estimate is{" "}
                      <strong className="text-slate-900">
                        {probabilityDistance.toFixed(1)} percentage points
                      </strong>{" "}
                      {isDefaultRisk ? "above" : "below"} that threshold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Details */}
          <div className="border-t border-slate-200/80 p-6 sm:p-8">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-slate-900">
                Prediction details
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Values returned directly by the production prediction API.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">
                  Estimated probability
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {probabilityPercent.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">
                  Decision threshold
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {thresholdPercent.toFixed(0)}%
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">
                  Model classification
                </p>

                <p
                  className={`mt-1 text-sm font-bold ${resultMeta.accentColor}`}
                >
                  {result.decision}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsible AI */}
        <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Responsible AI
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                This prediction is generated by a machine-learning model and
                is intended to support qualified lending professionals. It is
                not, by itself, a final lending decision. Appropriate human
                review and institutional lending policies should be applied
                before making a lending decision.
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
          >
            <ArrowLeft size={16} />
            Return to Dashboard
          </Link>

          <button
            type="button"
            onClick={onNewAssessment}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
          >
            <RotateCcw size={16} />
            Assess Another Applicant
          </button>
        </div>
      </div>
    </main>
  );
}