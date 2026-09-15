import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ModelStats } from "@/components/model-stats";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      <ModelStats />

      {/* Remaining landing-page sections will be added next. */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-dashed border-border bg-surface-muted/50 p-10 text-center">
          <p className="text-sm font-medium text-muted">
            How it works section — next milestone
          </p>
        </div>
      </section>

      <section
        id="responsible-ai"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-dashed border-border bg-surface-muted/50 p-10 text-center">
          <p className="text-sm font-medium text-muted">
            Responsible AI section — next milestone
          </p>
        </div>
      </section>
    </main>
  );
}