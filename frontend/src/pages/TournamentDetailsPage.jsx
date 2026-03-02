import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TournamentPageShell from "../features/tournament-ui/components/TournamentPageShell";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import StatusPill from "../features/tournament-ui/components/StatusPill";
import { getTournamentDetails } from "../features/tournament-ui/api/tournamentApi";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString();
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

const TournamentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = useMemo(() => localStorage.getItem("authToken"), []);

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: `/events/${id}/details` },
      });
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await getTournamentDetails(token, id);
        setDetails(payload);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load tournament details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token, navigate]);

  const tournament = details?.tournament;
  const divisions = details?.divisions || [];
  const registrations = details?.registrations || [];
  const schedule = details?.schedule || [];

  return (
    <TournamentPageShell
      kicker="Director Console"
      title="Tournament Details"
      subtitle="Single-source operational view for tournament configuration, participants, and current schedule."
      actions={
        <>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}/manage`)}
            className="op-btn px-4 py-2 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
          >
            Back to Management
          </button>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}/schedule`)}
            className="op-btn px-4 py-2 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
          >
            Open Scheduling
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {loading ? <InlineBanner tone="info" title="Loading" message="Fetching tournament details..." /> : null}
        {error ? <InlineBanner tone="error" title="Error" message={error} /> : null}

        {!loading && !error ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <TournamentPanel title="Core Details" className="xl:col-span-4">
              <div className="space-y-2 op-ui text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--op-text-muted)]">Status</span>
                  <StatusPill
                    label={(tournament?.status || "unknown").replace("_", " ")}
                    tone={statusToTone(tournament?.status)}
                  />
                </div>
                <p><span className="text-[var(--op-text-muted)]">Name:</span> <span className="font-semibold">{tournament?.name || "-"}</span></p>
                <p><span className="text-[var(--op-text-muted)]">Format:</span> <span className="font-semibold">{tournament?.format || "-"}</span></p>
                <p><span className="text-[var(--op-text-muted)]">Max Teams:</span> <span className="font-semibold">{tournament?.max_teams || "-"}</span></p>
                <p><span className="text-[var(--op-text-muted)]">Location:</span> <span className="font-semibold">{[tournament?.city, tournament?.state_province, tournament?.country].filter(Boolean).join(", ") || "-"}</span></p>
                <p><span className="text-[var(--op-text-muted)]">Start:</span> <span className="font-semibold">{formatDate(tournament?.start_date)}</span></p>
                <p><span className="text-[var(--op-text-muted)]">End:</span> <span className="font-semibold">{formatDate(tournament?.end_date)}</span></p>
              </div>
            </TournamentPanel>

            <TournamentPanel title="Divisions" subtitle="Capacity and registration totals by division." className="xl:col-span-8">
              <div className="overflow-x-auto border border-[var(--op-border)] rounded-xl">
                <table className="w-full text-sm op-ui">
                  <thead className="bg-[var(--op-surface-muted)] text-[var(--op-secondary)]">
                    <tr>
                      <th className="text-left p-2">Division</th>
                      <th className="text-left p-2">Max Teams</th>
                      <th className="text-left p-2">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisions.length === 0 ? (
                      <tr>
                        <td className="p-3 text-[var(--op-text-muted)]" colSpan={3}>No divisions configured.</td>
                      </tr>
                    ) : (
                      divisions.map((division) => (
                        <tr key={division.id} className="border-t border-[var(--op-border)]">
                          <td className="p-2">{division.division_name}</td>
                          <td className="p-2">{division.max_teams ?? "N/A"}</td>
                          <td className="p-2">{division.registered_teams ?? 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TournamentPanel>

            <TournamentPanel
              title="Registered Teams"
              subtitle="Current roster and payment/registration state."
              className="xl:col-span-6"
            >
              <div className="overflow-x-auto border border-[var(--op-border)] rounded-xl">
                <table className="w-full text-sm op-ui">
                  <thead className="bg-[var(--op-surface-muted)] text-[var(--op-secondary)]">
                    <tr>
                      <th className="text-left p-2">Team</th>
                      <th className="text-left p-2">Division</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td className="p-3 text-[var(--op-text-muted)]" colSpan={4}>No teams registered yet.</td>
                      </tr>
                    ) : (
                      registrations.map((registration) => (
                        <tr key={registration.id} className="border-t border-[var(--op-border)]">
                          <td className="p-2">{registration.team_name}</td>
                          <td className="p-2">{registration.division_name}</td>
                          <td className="p-2 capitalize">{registration.status}</td>
                          <td className="p-2 capitalize">{registration.payment_status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TournamentPanel>

            <TournamentPanel
              title="Published Schedule"
              subtitle="Current matches and timing from the existing schedule endpoint."
              className="xl:col-span-6"
            >
              <div className="overflow-x-auto border border-[var(--op-border)] rounded-xl">
                <table className="w-full text-sm op-ui">
                  <thead className="bg-[var(--op-surface-muted)] text-[var(--op-secondary)]">
                    <tr>
                      <th className="text-left p-2">Match</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Wins</th>
                      <th className="text-left p-2">Scheduled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.length === 0 ? (
                      <tr>
                        <td className="p-3 text-[var(--op-text-muted)]" colSpan={4}>No schedule available yet.</td>
                      </tr>
                    ) : (
                      schedule.map((series) => (
                        <tr key={series.id} className="border-t border-[var(--op-border)]">
                          <td className="p-2">{series.registration1_team_name || "TBD"} vs {series.registration2_team_name || "TBD"}</td>
                          <td className="p-2">{series.location || "TBD"}</td>
                          <td className="p-2">{series.wins_needed}</td>
                          <td className="p-2">{formatDate(series.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TournamentPanel>
          </div>
        ) : null}
      </div>
    </TournamentPageShell>
  );
};

export default TournamentDetailsPage;
