import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import TournamentWizardLayout from "../features/tournament-ui/components/TournamentWizardLayout";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import useLocalStorageState from "../features/tournament-ui/hooks/useLocalStorageState";

type FormatForm = {
  format: string;
  bracketStyle: string;
  rules: string;
};

const defaultFormat: FormatForm = {
  format: "",
  bracketStyle: "",
  rules: "",
};

const CreateTournamentFormat = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useLocalStorageState(
    "tournamentFormat",
    defaultFormat
  ) as [FormatForm, Dispatch<SetStateAction<FormatForm>>, () => void];
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: "/events/create/format" },
      });
      return;
    }

    const basicInfo = localStorage.getItem("tournamentBasicInfo");
    if (!basicInfo) {
      navigate("/events/create", { replace: true });
    }
  }, [navigate]);

  const completion = useMemo(() => {
    const fields: Array<keyof FormatForm> = ["format", "bracketStyle"];
    const complete = fields.filter((field) => `${formData[field]}`.trim().length > 0)
      .length;
    return {
      complete,
      total: fields.length,
    };
  }, [formData]);

  const setField = (name: keyof FormatForm, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.format || !formData.bracketStyle) {
      setError("Format and bracket style are required.");
      return;
    }

    navigate("/events/create/registration", { replace: true });
  };

  const summary = (
    <div className="space-y-3 text-sm text-[var(--op-text-muted)]">
      <p>
        Step completion: <span className="font-semibold text-[var(--op-text)]">{completion.complete}/{completion.total}</span>
      </p>
      <p>Draft status: <span className="font-semibold text-[var(--op-accent)]">Saved automatically</span></p>
      <ul className="list-disc list-inside space-y-1">
        <li>Select sanctioned format profile.</li>
        <li>Define elimination bracket model.</li>
        <li>Add optional rules context for directors.</li>
      </ul>
    </div>
  );

  return (
    <TournamentWizardLayout
      step={2}
      title="Tournament Format"
      subtitle="Set the competition model so scheduling and score validation stay aligned with expectations."
      summary={summary}
      banner={
        error ? (
          <InlineBanner tone="error" title="Validation issue" message={error} />
        ) : (
          <InlineBanner
            tone="info"
            title="Operator tip"
            message="Rules entered here are displayed to staff and can be expanded later in tournament management."
          />
        )
      }
    >
      <TournamentPanel title="Format Configuration" subtitle="Choose the format profile and bracket strategy used across this event.">
        <form onSubmit={handleNext} className="space-y-4 op-ui">
          <div>
            <label htmlFor="format" className="block text-sm font-semibold mb-1">Format</label>
            <select
              id="format"
              value={formData.format}
              onChange={(event) => setField("format", event.target.value)}
              className="op-select w-full p-3"
              required
            >
              <option value="">Select format</option>
              <option value="classic">Classic</option>
              <option value="college">College</option>
              <option value="asl">ASL</option>
            </select>
          </div>

          <div>
            <label htmlFor="bracketStyle" className="block text-sm font-semibold mb-1">Bracket Style</label>
            <select
              id="bracketStyle"
              value={formData.bracketStyle}
              onChange={(event) => setField("bracketStyle", event.target.value)}
              className="op-select w-full p-3"
              required
            >
              <option value="">Select bracket style</option>
              <option value="single">Single Elimination</option>
              <option value="double">Double Elimination</option>
            </select>
          </div>

          <div>
            <label htmlFor="rules" className="block text-sm font-semibold mb-1">Rules / Notes</label>
            <textarea
              id="rules"
              value={formData.rules}
              onChange={(event) => setField("rules", event.target.value)}
              className="op-textarea w-full p-3 min-h-[110px]"
              placeholder="Optional tournament-specific notes..."
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/events/create", { replace: true })}
              className="op-btn px-5 py-2.5 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
            >
              Back to Basics
            </button>
            <button
              type="submit"
              className="op-btn px-5 py-2.5 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
            >
              Continue to Registration Setup
            </button>
          </div>
        </form>
      </TournamentPanel>
    </TournamentWizardLayout>
  );
};

export default CreateTournamentFormat;
