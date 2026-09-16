import {
  AlertTriangle,
  Eye,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Transparent signals",
    description:
      "The assessment exposes a probability and decision threshold rather than presenting an unexplained yes-or-no outcome.",
  },
  {
    icon: Scale,
    title: "Decision support",
    description:
      "CrediSense is designed to support credit assessment workflows, not replace responsible human judgment.",
  },
  {
    icon: LockKeyhole,
    title: "Data minimization",
    description:
      "The interface collects only the applicant information needed for this assessment workflow instead of exposing the underlying model schema.",
  },
];

export function ResponsibleAI() {
  return (
    <section
      id="responsible-ai"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* Introduction */}
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <ShieldCheck size={21} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Responsible AI
            </p>

            <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
              Risk assessment should inform decisions, not make them blindly.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              Credit risk is a consequential domain. CrediSense presents
              machine-learning predictions as decision-support signals, with
              the model's probability and configured threshold visible to the
              user.
            </p>
          </div>

          {/* Principles */}
          <div className="grid gap-4">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.title}
                  className="group rounded-2xl border border-border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-primary-dark">
                        {principle.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Important limitation */}
        <div className="mt-10 rounded-2xl border border-warning/20 bg-warning/5 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary-dark">
                Important assessment limitation
              </h3>

              <p className="mt-1.5 max-w-4xl text-sm leading-6 text-muted">
                A model prediction is not a guarantee of future repayment
                behavior. Real lending decisions should consider additional
                context, applicable policies, fairness requirements, and
                appropriate human review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}