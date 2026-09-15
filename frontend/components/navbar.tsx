"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Model", href: "#model" },
  { label: "Responsible AI", href: "#responsible-ai" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5"
          aria-label="CrediSense home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            C
          </span>

          <span className="text-lg font-bold tracking-tight text-primary-dark">
            CrediSense
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/assessment"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
          >
            Start assessment
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-primary-dark transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav
            className="mx-auto max-w-7xl px-5 py-5 sm:px-6"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-primary-dark"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/assessment"
                onClick={closeMobileMenu}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Start assessment
                <ArrowRight size={16} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}