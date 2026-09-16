import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border bg-surface-muted/40 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <Icon size={19} />
            </div>
          )}

          <div>
            <h3 className="text-base font-semibold text-primary-dark sm:text-lg">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          {children}
        </div>
      </div>
    </section>
  );
}