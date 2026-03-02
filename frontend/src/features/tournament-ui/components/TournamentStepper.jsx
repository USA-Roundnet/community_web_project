import { useNavigate } from "react-router-dom";

const stepStateStyles = {
  complete: "bg-[var(--op-success)] text-white border-[var(--op-success)]",
  active: "bg-[var(--op-primary)] text-white border-[var(--op-primary)]",
  pending: "bg-white text-[var(--op-secondary)] border-[var(--op-border)]",
};

const TournamentStepper = ({ steps, currentStep }) => {
  const navigate = useNavigate();

  return (
    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {steps.map((step) => {
        const state =
          step.number < currentStep
            ? "complete"
            : step.number === currentStep
            ? "active"
            : "pending";

        const clickable = step.path;

        return (
          <li key={step.number}>
            <button
              type="button"
              onClick={() => clickable && navigate(step.path)}
              disabled={!clickable}
              className={`w-full text-left border rounded-xl p-3 transition ${stepStateStyles[state]}`}
            >
              <div className="op-ui text-xs uppercase tracking-wide font-semibold opacity-90">
                Step {step.number}
              </div>
              <div className="op-display text-sm sm:text-base font-semibold mt-1">
                {step.label}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default TournamentStepper;
