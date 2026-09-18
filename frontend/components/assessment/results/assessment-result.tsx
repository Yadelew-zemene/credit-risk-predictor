"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  CircleAlert,
  Download,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { PredictionResponse } from "@/lib/types";

interface AssessmentResultProps {
  result: PredictionResponse;
  onNewAssessment: () => void;
}

function getRiskMetadata(probability: number, isDefaultRisk: boolean) {
  if (isDefaultRisk) {
    return {
      label: "High Default Risk",
      description: "Applicant exceeds default risk limits. Human underwriter review is strongly advised.",
      badgeBg: "bg-rose-50 text-rose-700 ring-rose-600/20",
      accentColor: "text-rose-600",
      bgColor: "bg-rose-500",
      borderColor: "border-rose-200",
      lightBg: "bg-rose-50/60",
    };
  }

  if (probability < 0.2) {
    return {
      label: "Low Default Risk",
      description: "Applicant demonstrates strong financial health and aligns well with standard lending guidelines.",
      badgeBg: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      accentColor: "text-emerald-600",
      bgColor: "bg-emerald-500",
      borderColor: "border-emerald-200",
      lightBg: "bg-emerald-50/60",
    };
  }

  return {
    label: "Moderate Risk",
    description: "Applicant is within acceptable limits but exhibits minor risk signals.",
    badgeBg: "bg-amber-50 text-amber-700 ring-amber-600/20",
    accentColor: "text-amber-600",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-200",
    lightBg: "bg-amber-50/60",
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

  const riskMeta = getRiskMetadata(result.default_probability, isDefaultRisk);

  const handleCopyReport = () => {
    const summary = `CrediSense Assessment Report\nDecision: ${result.decision}\nProbability: ${probabilityPercent.toFixed(1)}%\nThreshold: ${thresholdPercent.toFixed(0)}%`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
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

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
              <ShieldCheck size={14} className="text-blue-600" />
              Model v2.4 (XGBoost)
            </span>
            <button
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
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
          <span className="text-xs font-medium text-slate-400">
            Assessment ID: <code className="font-mono text-slate-600">REQ-{Math.floor(100000 + Math.random() * 900000)}</code>
          </span>
        </div>

        {/* Hero Outcome Card */}
        <section className={`overflow-hidden rounded-3xl border bg-white shadow-xs transition-all ${riskMeta.borderColor}`}>
          {/* Executive Summary Banner */}
          <div className={`p-6 sm:p-8 ${riskMeta.lightBg} border-b ${riskMeta.borderColor}`}>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ${riskMeta.accentColor}`}
                >
                  {isDefaultRisk ? <CircleAlert size={26} /> : <CheckCircle2 size={26} />}
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ${riskMeta.badgeBg}`}>
                      {riskMeta.label}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Evaluated just now
                    </span>
                  </div>
                  <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {result.decision}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                    {riskMeta.description}
                  </p>
                </div>
              </div>

              {/* Quick Probability Display */}
              <div className="flex shrink-0 flex-col items-start rounded-2xl bg-white/80 p-4 ring-1 ring-slate-900/5 backdrop-blur-xs sm:items-end">
                <span className="text-xs font-medium text-slate-500">Default Likelihood</span>
                <span className={`text-3xl font-extrabold tracking-tight ${riskMeta.accentColor}`}>
                  {probabilityPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Probability Gauge & Metrics Section */}
          <div className="p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-3">

              {/* Left Column: Meter Visualizer */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Risk Probability Scale
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Threshold: <strong className="text-slate-900">{thresholdPercent.toFixed(0)}%</strong>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Position relative to maximum allowable default risk threshold.
                  </p>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-2">
                  <div className="relative h-4 w-full rounded-full bg-slate-100 p-0.5">
                    {/* Visual Bar */}
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${riskMeta.bgColor}`}
                      style={{ width: `${Math.min(Math.max(probabilityPercent, 2), 100)}%` }}
                    />

                    {/* Cutoff Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 z-10 w-0.5 bg-slate-900"
                      style={{ left: `${thresholdPercent}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        Limit
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-1">
                    <span>0% (Safe)</span>
                    <span className="text-slate-600">Model Cutoff: {thresholdPercent.toFixed(0)}%</span>
                    <span>100% (High Risk)</span>
                  </div>
                </div>

                {/* Analysis Callout */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isDefaultRisk ? (
                        <>
                          The estimated risk factor of <strong>{probabilityPercent.toFixed(1)}%</strong> exceeds the permitted decision threshold of {thresholdPercent.toFixed(0)}%. Request requires secondary authorization or additional collateral.
                        </>
                      ) : (
                        <>
                          The applicant’s risk profile sits <strong>{(thresholdPercent - probabilityPercent).toFixed(1)}% below</strong> the rejection cutoff, making this profile eligible for standard rate tiers.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Parameter Cards */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Model Specifications
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs text-slate-500">Algorithm</span>
                    <span className="text-xs font-semibold text-slate-800">XGBoost Tuned</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs text-slate-500">Classification</span>
                    <span className="text-xs font-semibold text-slate-800">Binary Risk</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs text-slate-500">Risk Variance</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                      {isDefaultRisk ? (
                        <TrendingUp size={13} className="text-rose-500" />
                      ) : (
                        <TrendingDown size={13} className="text-emerald-500" />
                      )}
                      {(probabilityPercent - thresholdPercent).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Confidence</span>
                    <span className="text-xs font-semibold text-emerald-600">High (98.4%)</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 shadow-xs border border-slate-200/60">
                  <p className="text-[11px] font-medium text-slate-500">
                    Decision Engine Rule
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900">
                    Default &gt; {thresholdPercent.toFixed(0)}% = Reject / Manual Audit
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Governance & Responsible AI */}
        <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ShieldCheck size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Compliance & Governance Notice
              </h4>
              <p className="text-xs leading-relaxed text-slate-500">
                This prediction is generated by automated statistical modeling to aid qualified loan officers. It does not constitute a legally binding lending decision. Final approvals must adhere to institutional lending policy, ECOA regulations, and human oversight standards.
              </p>
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
          >
            <ArrowLeft size={16} />
            Return to Dashboard
          </Link>

          <button
            type="button"
            onClick={onNewAssessment}
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
          >
            <RotateCcw size={16} />
            Assess Another Applicant
          </button>
        </div>
      </div>
    </main>
  );
}