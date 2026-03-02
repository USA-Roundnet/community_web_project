import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TournamentPageShell from "../features/tournament-ui/components/TournamentPageShell";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import { toDateInputValue } from "../utils/dateTime";
import { getTournament, updateTournament } from "../features/tournament-ui/api/tournamentApi";

const EditTournamentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state_province: "",
    zip_code: "",
    country: "",
    format: "",
    start_date: "",
    end_date: "",
    max_teams: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const tournament = await getTournament(id);
        setFormData({
          name: tournament.name || "",
          city: tournament.city || "",
          state_province: tournament.state_province || "",
          zip_code: tournament.zip_code || "",
          country: tournament.country || "",
          format: tournament.format || "",
          start_date: toDateInputValue(tournament.start_date),
          end_date: toDateInputValue(tournament.end_date),
          max_teams: tournament.max_teams ? String(tournament.max_teams) : "",
        });
      } catch (loadError) {
        setError(loadError?.message || "Unable to load tournament details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const updateField = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: `/events/${id}/edit` },
      });
      return;
    }

    if (formData.end_date < formData.start_date) {
      setError("End date must be on or after start date.");
      return;
    }

    const maxTeamsValue = Number(formData.max_teams);
    if (!Number.isInteger(maxTeamsValue) || maxTeamsValue <= 0) {
      setError("Max teams must be a positive integer.");
      return;
    }

    try {
      setSaving(true);
      const updatedTournament = await updateTournament(token, id, {
        ...formData,
        max_teams: maxTeamsValue,
      });
      navigate(`/events/${id}/manage`, {
        replace: true,
        state: {
          message: `Tournament "${updatedTournament.name}" updated successfully.`,
        },
      });
    } catch (submitError) {
      setError(
        submitError?.message || "Unable to update tournament details. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <TournamentPageShell
      kicker="Director Console"
      title="Edit Tournament"
      subtitle="Update core logistics while keeping existing tournament identity and routes intact."
      actions={
        <button
          type="button"
          onClick={() => navigate(`/events/${id}/manage`)}
          className="op-btn px-4 py-2 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
        >
          Cancel
        </button>
      }
    >
      <div className="space-y-4">
        {loading ? <InlineBanner tone="info" title="Loading" message="Fetching tournament..." /> : null}
        {error ? <InlineBanner tone="error" title="Save blocked" message={error} /> : null}

        {!loading ? (
          <TournamentPanel title="Editable Fields" subtitle="All updates use the existing PUT /api/tournaments/:id contract.">
            <form onSubmit={handleSubmit} className="op-ui space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-1">Tournament Name</label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="op-input w-full p-3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold mb-1">City</label>
                  <input
                    id="city"
                    value={formData.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state_province" className="block text-sm font-semibold mb-1">State / Province</label>
                  <input
                    id="state_province"
                    value={formData.state_province}
                    onChange={(event) => updateField("state_province", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="zip_code" className="block text-sm font-semibold mb-1">Zip / Postal Code</label>
                  <input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(event) => updateField("zip_code", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold mb-1">Country</label>
                  <input
                    id="country"
                    value={formData.country}
                    onChange={(event) => updateField("country", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-semibold mb-1">Format</label>
                <select
                  id="format"
                  value={formData.format}
                  onChange={(event) => updateField("format", event.target.value)}
                  className="op-select w-full p-3"
                  required
                >
                  <option value="">Select format</option>
                  <option value="classic">Classic</option>
                  <option value="college">College</option>
                  <option value="asl">ASL</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-semibold mb-1">Start Date</label>
                  <input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(event) => updateField("start_date", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-semibold mb-1">End Date</label>
                  <input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(event) => updateField("end_date", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="max_teams" className="block text-sm font-semibold mb-1">Max Teams</label>
                  <input
                    id="max_teams"
                    type="number"
                    min={1}
                    value={formData.max_teams}
                    onChange={(event) => updateField("max_teams", event.target.value)}
                    className="op-input w-full p-3"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="op-btn px-5 py-2.5 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </TournamentPanel>
        ) : null}
      </div>
    </TournamentPageShell>
  );
};

export default EditTournamentPage;
