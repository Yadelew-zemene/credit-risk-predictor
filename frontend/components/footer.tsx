import Link from "next/link";
import { ArrowUpRight, BrainCircuit } from "lucide-react";

const productLinks = [
  { label: "Assessment", href: "/assessment" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Model", href: "#model" },
  { label: "Responsible AI", href: "#responsible-ai" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="CrediSense home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                C
              </span>

              <span className="text-lg font-bold tracking-tight text-primary-dark">
                CrediSense
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-muted">
              AI-powered credit risk assessment designed to turn applicant
              information into a clear, data-driven risk signal.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Product
            </p>

            <nav
              className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-1"
              aria-label="Footer navigation"
            >
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-primary-dark"
                >
                  {link.label}

                  {link.href === "/assessment" && (
                    <ArrowUpRight size={14} />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} CrediSense. Built as an AI credit-risk
            assessment project.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-muted">
            <BrainCircuit size={14} />
            <span>Machine-learning powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}