import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TournamentPageShell from "../features/tournament-ui/components/TournamentPageShell";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import StatusPill from "../features/tournament-ui/components/StatusPill";
import {
  getMyMatchAlerts,
  getTournament,
} from "../features/tournament-ui/api/tournamentApi";

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

const TournamentEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchAlerts, setMatchAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState("");

  const isDirector = useMemo(() => {
    const localUserId = Number(localStorage.getItem("userId"));
    return Boolean(localUserId && localUserId === Number(tournament?.director_id));
  }, [tournament?.director_id]);

  useEffect(() => {
    const loadTournament = async () => {
      try {
        setLoading(true);
        setError("");
        const tournamentData = await getTournament(id);
        setTournament(tournamentData);
      } catch (fetchError) {
        setError(fetchError?.message || "Unable to load tournament details.");
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMatchAlerts([]);
      setAlertsError("");
      return;
    }

    const loadAlerts = async () => {
      try {
        setAlertsLoading(true);
        setAlertsError("");
        const payload = await getMyMatchAlerts(token, id);
        setMatchAlerts(Array.isArray(payload) ? payload : []);
      } catch (loadError) {
        setAlertsError(loadError?.message || "Unable to load match alerts.");
      } finally {
        setAlertsLoading(false);
      }
    };

    loadAlerts();
  }, [id]);

  return (
    <TournamentPageShell
      kicker="Participant View"
      title={tournament?.name || "Tournament Event"}
      subtitle="Key event status, format, and your match alerts in one place."
      actions={
        <>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="op-btn px-4 py-2 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
          >
            Back to Events
          </button>
          {isDirector ? (
            <button
              type="button"
              onClick={() => navigate(`/events/${id}/manage`)}
              className="op-btn px-4 py-2 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
            >
              Open Director Console
            </button>
          ) : null}
        </>
      }
    >
      <div className="space-y-4">
        {loading ? <InlineBanner tone="info" title="Loading" message="Fetching event details..." /> : null}
        {error ? <InlineBanner tone="error" title="Error" message={error} /> : null}

        {!loading && !error ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <TournamentPanel title="Event Snapshot" className="lg:col-span-5">
              <div className="space-y-2 text-sm op-ui">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--op-text-muted)]">Status</span>
                  <StatusPill
                    label={(tournament?.status || "unknown").replace("_", " ")}
                    tone={statusToTone(tournament?.status)}
                  />
                </div>
                <p><span className="text-[var(--op-text-muted)]">Location:</span> <span className="font-semibold">{[tournament?.city, tournament?.state_province, tournament?.country].filter(Boolean).join(", ") || "TBD"}</span></p>
                <p><span className="text-[var(--op-text-muted)]">Format:</span> <span className="font-semibold">{tournament?.format || "N/A"}</span></p>
                <p><span className="text-[var(--op-text-muted)]">Start:</span> <span className="font-semibold">{formatDate(tournament?.start_date)}</span></p>
                <p><span className="text-[var(--op-text-muted)]">End:</span> <span className="font-semibold">{formatDate(tournament?.end_date)}</span></p>
              </div>
            </TournamentPanel>

            <TournamentPanel
              title="Your Match Alerts"
              subtitle="In-app alert feed from GET /api/tournaments/:id/my-match-alerts"
              className="lg:col-span-7"
            >
              {alertsLoading ? (
                <p className="text-sm text-[var(--op-text-muted)]">Loading your alerts...</p>
              ) : alertsError ? (
                <InlineBanner tone="error" title="Alerts unavailable" message={alertsError} />
              ) : matchAlerts.length === 0 ? (
                <p className="text-sm text-[var(--op-text-muted)]">
                  No scheduled matches for your teams yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {matchAlerts.map((alert) => (
                    <article key={alert.id} className="op-card-muted p-3">
                      <p className="op-display text-base font-semibold text-[var(--op-primary-strong)]">
                        {alert.match_label}
                      </p>
                      <div className="op-ui text-sm text-[var(--op-text-muted)] mt-1 space-y-0.5">
                        <p><span className="font-semibold text-[var(--op-text)]">Your Team:</span> {alert.user_team_name}</p>
                        <p><span className="font-semibold text-[var(--op-text)]">Opponent:</span> {alert.opponent_team_name}</p>
                        <p><span className="font-semibold text-[var(--op-text)]">When:</span> {new Date(alert.scheduled_at).toLocaleString()}</p>
                        <p><span className="font-semibold text-[var(--op-text)]">Location:</span> {alert.location || "TBD"}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </TournamentPanel>
          </div>
        ) : null}
      </div>
    </TournamentPageShell>
  );
};

export default TournamentEventPage;
