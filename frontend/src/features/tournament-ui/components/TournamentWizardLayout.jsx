import TournamentPageShell from "./TournamentPageShell";
import TournamentPanel from "./TournamentPanel";
import TournamentStepper from "./TournamentStepper";

const steps = [
  { number: 1, label: "Basics", path: "/events/create" },
  { number: 2, label: "Format", path: "/events/create/format" },
  { number: 3, label: "Registration", path: "/events/create/registration" },
];

const TournamentWizardLayout = ({
  step,
  title,
  subtitle,
  summary,
  children,
  banner,
}) => {
  return (
    <TournamentPageShell
      kicker="Tournament Setup"
      title={title}
      subtitle={subtitle}
      maxWidth="1100px"
    >
      <div className="space-y-4">
        <TournamentPanel title="Progress" subtitle="Draft saves automatically on each change.">
          <TournamentStepper steps={steps} currentStep={step} />
        </TournamentPanel>

        {banner ? banner : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">{children}</div>
          <aside className="lg:col-span-4">
            <TournamentPanel title="Setup Summary">{summary}</TournamentPanel>
          </aside>
        </div>
      </div>
    </TournamentPageShell>
  );
};

export default TournamentWizardLayout;
