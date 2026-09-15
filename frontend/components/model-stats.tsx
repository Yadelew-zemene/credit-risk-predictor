import {
  BarChart3,
  Database,
  Gauge,
  Layers3,
  Target,
} from "lucide-react";

const stats = [
  {
    value: "307,511",
    label: "Applications",
    description: "Training dataset records",
    icon: Database,
  },
  {
    value: "121",
    label: "Raw features",
    description: "Original applicant variables",
    icon: Layers3,
  },
  {
    value: "252",
    label: "Model features",
    description: "After preprocessing",
    icon: BarChart3,
  },
  {
    value: "0.7700",
    label: "ROC-AUC",
    description: "Untouched test set",
    icon: Gauge,
  },
  {
    value: "0.2564",
    label: "PR-AUC",
    description: "Untouched test set",
    icon: Target,
  },
];

export function ModelStats() {
  return (
    <section
      id="model"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Model foundation
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Built on real data and measurable performance.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted">
            CrediSense uses a tuned XGBoost model trained on the Home Credit
            Default Risk dataset, with evaluation kept separate from the
            final test set.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border bg-background p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <Icon size={19} />
                </div>

                <p className="mt-5 text-2xl font-bold tracking-tight text-primary-dark">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  {stat.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical summary */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold text-primary-dark">
              Production model
            </p>

            <p className="mt-1 text-sm text-muted">
              Tuned XGBoost classifier with engineered applicant features and
              a calibrated decision threshold.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-primary-dark">
            <span className="h-2 w-2 rounded-full bg-success" />
            XGBoost · threshold 0.65
          </div>
        </div>
      </div>
    </section>
  );
}