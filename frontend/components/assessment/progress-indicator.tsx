import { Check } from "lucide-react";

export interface AssessmentStep {
  id: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: AssessmentStep[];
  currentStep: number;
}

export function ProgressIndicator({
  steps,
  currentStep,
}: ProgressIndicatorProps) {
  return (
    <nav
      aria-label="Assessment progress"
      className="w-full"
    >
      <ol className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <li
              key={step.id}
              className="relative flex flex-1 items-start last:flex-none"
            >
              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-8 right-0 top-4 hidden h-px bg-border sm:block"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? "w-full bg-primary" : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* Step */}
              <div className="relative z-10 flex flex-col items-center sm:items-start">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                    isCompleted
                      ? "border-primary bg-primary text-white"
                      : "",
                    isCurrent
                      ? "border-primary bg-surface text-primary shadow-sm shadow-primary/20"
                      : "",
                    isUpcoming
                      ? "border-border bg-surface text-muted"
                      : "",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <Check size={15} strokeWidth={2.5} /> : step.id}
                </div>

                <div className="mt-3 text-center sm:text-left">
                  <p
                    className={`text-xs font-semibold sm:text-sm ${
                      isCurrent || isCompleted
                        ? "text-primary-dark"
                        : "text-muted"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="mt-1 hidden max-w-32 text-xs leading-4 text-muted sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile progress summary */}
      <div className="mt-6 sm:hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-primary-dark">
            Step {currentStep} of {steps.length}
          </span>

          <span className="text-muted">
            {steps[currentStep - 1]?.title}
          </span>
        </div>

        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentStep}
          aria-label={`Assessment progress: step ${currentStep} of ${steps.length}`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}