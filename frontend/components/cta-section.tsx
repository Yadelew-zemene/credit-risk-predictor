import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldCheck } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-primary-dark">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <BrainCircuit size={23} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to assess an applicant?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Enter an applicant profile and see how the CrediSense model
            translates the available information into a default-risk
            assessment.
          </p>

          <div className="mt-8">
            <Link
              href="/assessment"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary-dark shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-primary-dark"
            >
              Start an assessment
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-white/55">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={14} />
              Decision-support tool
            </span>

            <span className="hidden h-3 w-px bg-white/15 sm:block" />

            <span>Powered by tuned XGBoost</span>

            <span className="hidden h-3 w-px bg-white/15 sm:block" />

            <span>Threshold: 0.65</span>
          </div>
        </div>
      </div>
    </section>
  );
}