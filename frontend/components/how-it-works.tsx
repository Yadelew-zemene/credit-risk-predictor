import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileInput,
  SlidersHorizontal,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileInput,
    title: "Enter applicant information",
    description:
      "Provide the key financial, demographic, employment, and loan details needed for the assessment.",
    detail: "26 user-facing fields",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Prepare the data",
    description:
      "CrediSense maps the submitted information to the model's expected inputs, engineers relevant features, and handles missing values.",
    detail: "Feature engineering + preprocessing",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Analyze with XGBoost",
    description:
      "The trained model evaluates the processed applicant profile and estimates the probability of loan default.",
    detail: "252 model-ready features",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Receive a risk assessment",
    description:
      "The predicted probability is compared with the configured decision threshold to produce a clear risk signal.",
    detail: "Decision threshold: 0.65",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-background"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              How it works
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
              From applicant data to a clear risk signal.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-7 text-muted lg:ml-auto">
            CrediSense keeps the user experience simple while a structured
            machine-learning pipeline handles the transformation from
            applicant information to a default-risk prediction.
          </p>
        </div>

        {/* Pipeline */}
        <div className="mt-14">
          <div className="grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-[calc(100%+4px)] top-14 z-10 hidden w-4 lg:block"
                    >
                      <ArrowRight
                        size={16}
                        className="text-border"
                      />
                    </div>
                  )}

                  <article className="group h-full rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-900/5">
                    {/* Number + icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.14em] text-primary/50">
                        {step.number}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="mt-7 text-lg font-semibold text-primary-dark">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted">
                      {step.description}
                    </p>

                    <div className="mt-6 border-t border-border pt-4">
                      <p className="text-xs font-semibold text-primary-dark">
                        {step.detail}
                      </p>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical pipeline */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-primary-dark text-white shadow-xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Database size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Behind the assessment
                  </p>

                  <p className="text-xs text-white/60">
                    Production inference pipeline
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                <PipelineItem label="Applicant data" />
                <PipelineArrow />
                <PipelineItem label="Feature engineering" />
                <PipelineArrow />
                <PipelineItem label="Preprocessing" />
                <PipelineArrow />
                <PipelineItem label="XGBoost" />
                <PipelineArrow />
                <PipelineItem label="Risk signal" />
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                Decision logic
              </p>

              <p className="mt-2 text-2xl font-bold">
                Probability ≥ 0.65
              </p>

              <p className="mt-2 max-w-xs text-sm leading-6 text-white/60">
                The configured threshold converts the model probability into
                the application's risk decision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineItem({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/85">
      {label}
    </span>
  );
}

function PipelineArrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      size={14}
      className="hidden text-white/30 sm:block"
    />
  );
}