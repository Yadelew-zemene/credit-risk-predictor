export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            AI-powered credit risk assessment
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-primary-dark sm:text-6xl lg:text-7xl">
            Make better lending decisions with AI.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            CrediSense analyzes applicant information to estimate default risk
            and provide a clear, data-driven assessment.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-primary px-6 py-3.5 font-medium text-white shadow-sm transition hover:bg-primary-dark">
              Assess an applicant
            </button>

            <button className="rounded-xl border border-border bg-surface px-6 py-3.5 font-medium text-primary-dark transition hover:bg-surface-muted">
              How it works
            </button>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Model</p>
              <p className="mt-2 font-semibold text-primary-dark">
                XGBoost
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">ROC-AUC</p>
              <p className="mt-2 font-semibold text-primary-dark">0.7700</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Input features</p>
              <p className="mt-2 font-semibold text-primary-dark">121</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}