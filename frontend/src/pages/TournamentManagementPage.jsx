import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TournamentPageShell from "../features/tournament-ui/components/TournamentPageShell";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import StatusPill from "../features/tournament-ui/components/StatusPill";
import { deleteTournament, getTournament } from "../features/tournament-ui/api/tournamentApi";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "TBD";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "TBD";
  }

  return parsedDate.toLocaleDateString();
};

const statusToTone = (status) => {
  switch ((status || "").toLowerCase()) {
    case "upcoming":
      return "upcoming";
    case "in_progress":
      return "in_progress";
    case "completed":
      return "completed";
    default:
      return "neutral";
  }
};

const TournamentManagementPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTournament = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTournament(id);
        setTournament(data);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load tournament details.");
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [id]);

  const runDelete = async () => {
    const shouldDelete = window.confirm(
      "Delete this tournament? This action cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: `/events/${id}/manage` },
      });
      return;
    }

    try {
      setDeleting(true);
      await deleteTournament(token, id);
      navigate("/events", {
        replace: true,
        state: {
          message: `Tournament "${tournament?.name || id}" deleted successfully.`,
        },
      });
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete this tournament.");
    } finally {
      setDeleting(false);
    }
  };

  const nextActions = useMemo(
    () => [
      {
        label: "Review details",
        description: "Inspect divisions, registration roster, and published schedule.",
        action: () => navigate(`/events/${id}/details`),
      },
      {
        label: "Edit tournament",
        description: "Update logistics, dates, format, and capacity.",
        action: () => navigate(`/events/${id}/edit`),
      },
      {
        label: "Manage scheduling",
        description: "Seed pools, schedule matches, and record outcomes.",
        action: () => navigate(`/events/${id}/schedule`),
      },
      {
        label: "Open participant view",
        description: "Check what players and teams currently see.",
        action: () => navigate(`/events/${id}`),
      },
    ],
    [id, navigate]
  );

  return (
    <TournamentPageShell
      kicker="Director Console"
      title="Tournament Management"
      subtitle="Use this command page to navigate core tournament operations quickly and safely."
      actions={
        <>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="op-btn px-4 py-2 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
          >
            Back to Events
          </button>
          <button
            type="button"
            onClick={runDelete}
            disabled={deleting}
            className="op-btn px-4 py-2 bg-[var(--op-danger)] text-white hover:brightness-95"
          >
            {deleting ? "Deleting..." : "Delete Tournament"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {location.state?.message ? (
          <InlineBanner tone="success" title="Update" message={location.state.message} />
        ) : null}
        {error ? <InlineBanner tone="error" title="Error" message={error} /> : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <TournamentPanel title="Tournament Snapshot" className="lg:col-span-7">
            {loading ? (
              <p className="op-ui text-sm text-[var(--op-text-muted)]">Loading tournament...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 op-ui text-sm">
                <div className="op-card-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Name</p>
                  <p className="font-semibold">{tournament?.name || "-"}</p>
                </div>
                <div className="op-card-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Status</p>
                  <div className="mt-1">
                    <StatusPill
                      label={(tournament?.status || "unknown").replace("_", " ")}
                      tone={statusToTone(tournament?.status)}
                    />
                  </div>
                </div>
                <div className="op-card-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Location</p>
                  <p className="font-semibold">
                    {[tournament?.city, tournament?.state_province, tournament?.country]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                </div>
                <div className="op-card-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Format</p>
                  <p className="font-semibold">{tournament?.format || "-"}</p>
                </div>
                <div className="op-card-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Date Range</p>
                  <p className="font-semibold">
                    {formatDate(tournament?.start_date)} - {formatDate(tournament?.end_date)}
                  </p>
                </div>
                <div className="op-card-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Max Teams</p>
                  <p className="font-semibold">{tournament?.max_teams ?? "-"}</p>
                </div>
              </div>
            )}
          </TournamentPanel>

          <TournamentPanel
            title="Next Actions"
            subtitle="Keep tournament operations moving with minimal context switching."
            className="lg:col-span-5"
          >
            <div className="space-y-2">
              {nextActions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="w-full text-left op-card-muted p-3 hover:border-[var(--op-primary)] hover:bg-white transition"
                >
                  <p className="op-display font-semibold text-[var(--op-primary-strong)] text-sm">
                    {item.label}
                  </p>
                  <p className="op-ui text-xs text-[var(--op-text-muted)] mt-1">{item.description}</p>
                </button>
              ))}
            </div>
          </TournamentPanel>
        </div>
      </div>
    </TournamentPageShell>
  );
};

export default TournamentManagementPage;
