import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-[-180px] h-95 w-95 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />

        <div className="absolute right-[-180px] top-40 h-90 w-90 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* Main content */}
          <div>
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary">
              <Sparkles size={15} />
              AI-powered credit risk assessment
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] text-primary-dark sm:text-5xl lg:text-6xl xl:text-7xl">
              Make better lending decisions with{" "}
              <span className="text-primary">AI.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              CrediSense analyzes applicant information to estimate default
              risk and turn complex credit data into a clear, data-driven
              assessment.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/assessment"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
              >
                Assess an applicant
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-primary-dark transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-muted hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              >
                See how it works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                Data-driven assessment
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                Transparent risk signal
              </div>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-10 h-64 rounded-full bg-primary/10 blur-3xl"
            />

            {/* Main card */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-slate-900/8">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BrainCircuit size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-primary-dark">
                      Risk assessment
                    </p>
                    <p className="text-xs text-muted">
                      AI-powered analysis
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                  Complete
                </span>
              </div>

              {/* Card body */}
              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted">Default probability</p>
                      <p className="mt-1 text-4xl font-bold tracking-tight text-primary-dark">
                        18.4%
                      </p>
                    </div>

                    <span className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                      Lower risk
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div className="h-full w-[18.4%] rounded-full bg-success" />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>0%</span>
                    <span>Assessment threshold: 65%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Signal cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-surface-muted/60 p-4">
                    <p className="text-xs text-muted">Model</p>
                    <p className="mt-1 text-sm font-semibold text-primary-dark">
                      XGBoost
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface-muted/60 p-4">
                    <p className="text-xs text-muted">ROC-AUC</p>
                    <p className="mt-1 text-sm font-semibold text-primary-dark">
                      0.7700
                    </p>
                  </div>
                </div>

                {/* Assessment result */}
                <div className="rounded-2xl border border-success/15 bg-success/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-primary-dark">
                        No default risk detected
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        The predicted probability is below the configured
                        decision threshold.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating feature card */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-surface p-4 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <BrainCircuit size={18} />
                </div>

                <div>
                  <p className="text-xs text-muted">Model inputs</p>
                  <p className="text-sm font-bold text-primary-dark">
                    121 features
                  </p>
                </div>
              </div>
            </div>

            {/* Floating model card */}
            <div className="absolute -right-3 -top-5 hidden rounded-2xl border border-border bg-surface p-4 shadow-xl sm:block lg:-right-6">
              <div>
                <p className="text-xs text-muted">Development dataset</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-primary-dark">
                  307,511
                </p>
                <p className="text-xs text-muted">applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}