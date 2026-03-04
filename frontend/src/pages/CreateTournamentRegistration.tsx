import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import TournamentWizardLayout from "../features/tournament-ui/components/TournamentWizardLayout";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import useLocalStorageState from "../features/tournament-ui/hooks/useLocalStorageState";
import { formatSqlDateTime } from "../utils/dateTime";
import {
  createTournament,
  createTournamentDivision,
} from "../features/tournament-ui/api/tournamentApi";
import {
  clearCreateDrafts,
  CREATE_DRAFT_KEYS,
  getAuthToken,
  hasDraft,
  readDraftObject,
  requireAuthForCreateStep,
} from "../features/tournament-ui/utils/createFlowStorage";

type DivisionDraft = {
  divisionName: string;
  playersPerTeam: number;
  maxTeams: string;
};

type RegistrationForm = {
  availability: string;
  divisionsType: string;
  numDivisons: number;
  divisions: DivisionDraft[];
};

type PublishDivisionResult = {
  localId: number;
  divisionName: string;
  maxTeams: number;
  playersPerTeam: number;
  status: "pending" | "success" | "error";
  apiDivisionId?: number;
  error?: string;
};

type BasicInfoDraft = {
  tournamentName: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  startDate: string;
  endDate: string;
  time: string;
  maxTeams: string;
};

type FormatDraft = {
  format: string;
};

const defaultRegistration: RegistrationForm = {
  availability: "",
  divisionsType: "",
  numDivisons: 1,
  divisions: [
    {
      divisionName: "",
      playersPerTeam: 1,
      maxTeams: "",
    },
  ],
};

const CreateTournamentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useLocalStorageState(
    CREATE_DRAFT_KEYS.registration,
    defaultRegistration
  ) as [RegistrationForm, Dispatch<SetStateAction<RegistrationForm>>, () => void];
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [createdTournamentId, setCreatedTournamentId] = useState<number | null>(null);
  const [createdTournamentName, setCreatedTournamentName] = useState<string>("");
  const [divisionResults, setDivisionResults] = useState<PublishDivisionResult[]>([]);

  useEffect(() => {
    const token = requireAuthForCreateStep(navigate, "/events/create/registration");
    if (!token) {
      return;
    }

    if (!hasDraft(CREATE_DRAFT_KEYS.basicInfo)) {
      navigate("/events/create", { replace: true });
      return;
    }
    if (!hasDraft(CREATE_DRAFT_KEYS.format)) {
      navigate("/events/create/format", { replace: true });
    }
  }, [navigate]);

  const completedDivisionCount = useMemo(
    () =>
      formData.divisions.filter(
        (division) =>
          `${division.divisionName || ""}`.trim().length > 0 &&
          Number(division.maxTeams) > 0
      ).length,
    [formData.divisions]
  );

  const summary = useMemo(() => {
    const successCount = divisionResults.filter((result) => result.status === "success").length;
    const failedCount = divisionResults.filter((result) => result.status === "error").length;

    return (
      <div className="space-y-3 text-sm text-[var(--op-text-muted)]">
        <p>
          Division drafts ready: <span className="font-semibold text-[var(--op-text)]">{completedDivisionCount}/{formData.divisions.length}</span>
        </p>
        <p>
          Draft status: <span className="font-semibold text-[var(--op-accent)]">Saved automatically</span>
        </p>
        {createdTournamentId ? (
          <p>
            Tournament created: <span className="font-semibold text-[var(--op-text)]">#{createdTournamentId}</span>
          </p>
        ) : null}
        {divisionResults.length > 0 ? (
          <div className="op-card-muted p-2">
            <p className="font-semibold text-[var(--op-text)]">Division publish status</p>
            <p>Success: {successCount}</p>
            <p>Failed: {failedCount}</p>
          </div>
        ) : null}
      </div>
    );
  }, [completedDivisionCount, formData.divisions.length, divisionResults, createdTournamentId]);

  const updateField = (key: keyof RegistrationForm, value: string | number) => {
    setFormData((previous) => {
      const next = {
        ...previous,
        [key]: value,
      };

      if (key === "numDivisons") {
        const count = Number(value) || 1;
        next.numDivisons = Math.max(1, count);
        next.divisions = Array.from({ length: next.numDivisons }, (_, index) => {
          return (
            previous.divisions[index] || {
              divisionName: "",
              playersPerTeam: 1,
              maxTeams: "",
            }
          );
        });
      }

      return next;
    });
  };

  const updateDivisionField = (
    index: number,
    field: keyof DivisionDraft,
    value: string
  ) => {
    setFormData((previous) => {
      const divisions = [...previous.divisions];
      const existing = divisions[index] || {
        divisionName: "",
        playersPerTeam: 1,
        maxTeams: "",
      };

      divisions[index] = {
        ...existing,
        [field]: field === "playersPerTeam" ? Number(value || 1) : value,
      };

      return {
        ...previous,
        divisions,
      };
    });
  };

  const buildDivisionPayloads = (): PublishDivisionResult[] => {
    const count = Math.max(1, Number(formData.numDivisons) || 1);
    const scopedDivisions = formData.divisions.slice(0, count);

    return scopedDivisions.map((division, index) => {
      const maxTeams = Number(division.maxTeams);
      const playersPerTeam = Number(division.playersPerTeam) || 1;

      if (!`${division.divisionName || ""}`.trim()) {
        throw new Error(`Division #${index + 1}: Division name is required.`);
      }

      if (!Number.isInteger(maxTeams) || maxTeams <= 0) {
        throw new Error(`Division #${index + 1}: Max Teams must be a positive integer.`);
      }

      if (!Number.isInteger(playersPerTeam) || playersPerTeam <= 0) {
        throw new Error(`Division #${index + 1}: Players per team must be a positive integer.`);
      }

      return {
        localId: index,
        divisionName: `${division.divisionName}`.trim(),
        maxTeams,
        playersPerTeam,
        status: "pending",
      };
    });
  };

  const createTournamentPayload = () => {
    const basicInfo = readDraftObject<BasicInfoDraft>(CREATE_DRAFT_KEYS.basicInfo, {
      tournamentName: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      startDate: "",
      endDate: "",
      time: "",
      maxTeams: "",
    });
    const formatInfo = readDraftObject<FormatDraft>(CREATE_DRAFT_KEYS.format, {
      format: "",
    });

    const tournamentStartDate = new Date(basicInfo.startDate);
    const tournamentEndDate = new Date(basicInfo.endDate);
    const registrationDeadline = new Date(tournamentStartDate);
    registrationDeadline.setDate(tournamentStartDate.getDate() - 2);

    if (
      Number.isNaN(tournamentStartDate.getTime()) ||
      Number.isNaN(tournamentEndDate.getTime())
    ) {
      throw new Error("Please provide valid start and end dates in Step 1.");
    }

    if (tournamentEndDate < tournamentStartDate) {
      throw new Error("End date must be on or after start date.");
    }

    const maxTeams = Number(basicInfo.maxTeams);
    if (!Number.isInteger(maxTeams) || maxTeams <= 0) {
      throw new Error("Please provide a valid positive max teams value in Step 1.");
    }

    let startDateTime: string;
    let endDateTime: string;

    if (basicInfo.time) {
      const start = new Date(`${basicInfo.startDate}T${basicInfo.time}:00`);
      const end = new Date(`${basicInfo.endDate}T${basicInfo.time}:00`);
      startDateTime = formatSqlDateTime(start);
      endDateTime = formatSqlDateTime(end);
    } else {
      startDateTime = formatSqlDateTime(new Date(`${basicInfo.startDate}T09:00:00`));
      endDateTime = formatSqlDateTime(new Date(`${basicInfo.endDate}T18:00:00`));
    }

    return {
      name: basicInfo.tournamentName,
      city: basicInfo.city,
      state_province: basicInfo.state,
      zip_code: basicInfo.zipCode,
      country: basicInfo.country,
      timezone: "UTC",
      status: "upcoming",
      format: formatInfo.format || "classic",
      start_date: startDateTime,
      end_date: endDateTime,
      max_teams: maxTeams,
      registration_deadline: formatSqlDateTime(registrationDeadline),
    };
  };

  const runDivisionPublish = async (
    token: string,
    tournamentId: number,
    allDivisionPayloads: PublishDivisionResult[],
    retryFailedOnly: boolean
  ) => {
    const resultByLocalId = new Map(
      allDivisionPayloads.map((payload) => [payload.localId, payload])
    );

    const previousResultsById = new Map(
      divisionResults.map((result) => [result.localId, result])
    );

    for (const payload of allDivisionPayloads) {
      const previous = previousResultsById.get(payload.localId);
      const alreadySucceeded = previous?.status === "success";
      const shouldSkip = retryFailedOnly ? previous?.status !== "error" : alreadySucceeded;

      if (shouldSkip && previous) {
        resultByLocalId.set(payload.localId, previous);
        continue;
      }

      try {
        const createdDivision = await createTournamentDivision(token, tournamentId, {
          name: payload.divisionName,
          max_teams: payload.maxTeams,
        });

        resultByLocalId.set(payload.localId, {
          ...payload,
          status: "success",
          apiDivisionId: Number(createdDivision?.id),
          error: undefined,
        });
      } catch (divisionError: any) {
        resultByLocalId.set(payload.localId, {
          ...payload,
          status: "error",
          error: divisionError?.message || "Failed to create division.",
        });
      }
    }

    const nextResults = [...resultByLocalId.values()].sort(
      (left, right) => left.localId - right.localId
    );

    setDivisionResults(nextResults);
    return nextResults;
  };

  const finalizeSuccessAndNavigate = (tournamentId: number, tournamentName: string, divisionCount: number) => {
    clearCreateDrafts();

    navigate(`/events/${tournamentId}/manage`, {
      replace: true,
      state: {
        message: `Tournament "${tournamentName}" created with ${divisionCount} divisions.`,
      },
    });
  };

  const publish = async (retryFailedOnly = false) => {
    setError(null);
    setIsPublishing(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("You must be logged in to publish a tournament.");
      }

      if (!formData.availability || !formData.divisionsType) {
        throw new Error("Availability and division type are required.");
      }

      const divisionPayloads = buildDivisionPayloads();
      const tournamentPayload = createTournamentPayload();

      let tournamentId = createdTournamentId;
      let tournamentName = createdTournamentName || tournamentPayload.name;

      if (!tournamentId) {
        const createdTournament = await createTournament(token, tournamentPayload);
        tournamentId = Number(createdTournament?.id);
        tournamentName = createdTournament?.name || tournamentPayload.name;

        if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
          throw new Error("Tournament was created but no valid id was returned.");
        }

        setCreatedTournamentId(tournamentId);
        setCreatedTournamentName(tournamentName);
      }

      const publishResults = await runDivisionPublish(
        token,
        tournamentId,
        divisionPayloads,
        retryFailedOnly
      );

      const failed = publishResults.filter((result) => result.status === "error");
      if (failed.length === 0) {
        finalizeSuccessAndNavigate(tournamentId, tournamentName, publishResults.length);
      }
    } catch (publishError: any) {
      setError(publishError?.message || "Tournament publishing failed.");
    } finally {
      setIsPublishing(false);
    }
  };

  const failedDivisionCount = divisionResults.filter((result) => result.status === "error").length;
  const hasPartialFailure = createdTournamentId && failedDivisionCount > 0;

  return (
    <TournamentWizardLayout
      step={3}
      title="Registration & Division Setup"
      subtitle="Finalize visibility and seed your divisions. Publish creates the tournament and then creates each division using existing APIs."
      summary={summary}
      banner={
        error ? (
          <InlineBanner tone="error" title="Publishing issue" message={error} />
        ) : hasPartialFailure ? (
          <InlineBanner
            tone="warning"
            title="Partial completion"
            message={`Tournament #${createdTournamentId} was created, but ${failedDivisionCount} division(s) failed. Retry failed divisions or continue to management.`}
          />
        ) : (
          <InlineBanner
            tone="info"
            title="Deterministic publish"
            message="Publish runs once for tournament creation and then persists each division with status tracking."
          />
        )
      }
    >
      <div className="space-y-4">
        <TournamentPanel title="Registration Controls" subtitle="These values are retained for director context and future policy wiring.">
          <div className="op-ui grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="availability" className="block text-sm font-semibold mb-1">Tournament Availability</label>
              <select
                id="availability"
                value={formData.availability}
                onChange={(event) => updateField("availability", event.target.value)}
                className="op-select w-full p-3"
                required
              >
                <option value="">Select availability</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label htmlFor="divisionsType" className="block text-sm font-semibold mb-1">Division Catalog</label>
              <select
                id="divisionsType"
                value={formData.divisionsType}
                onChange={(event) => updateField("divisionsType", event.target.value)}
                className="op-select w-full p-3"
                required
              >
                <option value="">Select type</option>
                <option value="custom">Custom Divisions</option>
                <option value="usar">USAR Divisions</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="numDivisons" className="block text-sm font-semibold mb-1">Number of Divisions</label>
              <input
                id="numDivisons"
                type="number"
                min={1}
                value={formData.numDivisons}
                onChange={(event) => updateField("numDivisons", Number(event.target.value || 1))}
                className="op-input w-full p-3"
              />
            </div>
          </div>
        </TournamentPanel>

        <TournamentPanel title="Division Definitions" subtitle="These are persisted via POST /api/tournaments/:id/divisions during publish.">
          <div className="space-y-3">
            {formData.divisions.slice(0, formData.numDivisons).map((division, index) => (
              <div key={index} className="op-card-muted p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="op-display text-base font-semibold text-[var(--op-primary-strong)]">Division {index + 1}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 op-ui">
                  <div className="sm:col-span-2">
                    <label htmlFor={`division-name-${index}`} className="block text-xs font-semibold mb-1">Division Name</label>
                    <input
                      id={`division-name-${index}`}
                      value={division.divisionName}
                      onChange={(event) =>
                        updateDivisionField(index, "divisionName", event.target.value)
                      }
                      className="op-input w-full p-2.5"
                      placeholder="Men's Premier"
                    />
                  </div>
                  <div>
                    <label htmlFor={`division-max-${index}`} className="block text-xs font-semibold mb-1">Max Teams</label>
                    <input
                      id={`division-max-${index}`}
                      type="number"
                      min={1}
                      value={division.maxTeams}
                      onChange={(event) => updateDivisionField(index, "maxTeams", event.target.value)}
                      className="op-input w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label htmlFor={`division-players-${index}`} className="block text-xs font-semibold mb-1">Players / Team</label>
                    <input
                      id={`division-players-${index}`}
                      type="number"
                      min={1}
                      value={division.playersPerTeam}
                      onChange={(event) =>
                        updateDivisionField(index, "playersPerTeam", event.target.value)
                      }
                      className="op-input w-full p-2.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TournamentPanel>

        {divisionResults.length > 0 ? (
          <TournamentPanel title="Publish Results" subtitle="Division persistence status from the latest publish attempt.">
            <div className="overflow-x-auto border border-[var(--op-border)] rounded-xl">
              <table className="w-full text-sm op-ui">
                <thead className="bg-[var(--op-surface-muted)] text-[var(--op-secondary)]">
                  <tr>
                    <th className="text-left p-2">Division</th>
                    <th className="text-left p-2">Max Teams</th>
                    <th className="text-left p-2">Players/Team</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {divisionResults.map((result) => (
                    <tr key={result.localId} className="border-t border-[var(--op-border)]">
                      <td className="p-2">{result.divisionName}</td>
                      <td className="p-2">{result.maxTeams}</td>
                      <td className="p-2">{result.playersPerTeam}</td>
                      <td className="p-2 capitalize">{result.status}</td>
                      <td className="p-2">{result.error || "Created"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TournamentPanel>
        ) : null}

        <div className="op-card p-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/events/create/format", { replace: true })}
            className="op-btn px-5 py-2.5 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
          >
            Back to Format
          </button>

          <button
            type="button"
            onClick={() => publish(false)}
            disabled={isPublishing}
            className="op-btn px-5 py-2.5 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
          >
            {isPublishing ? "Publishing..." : "Publish Tournament"}
          </button>

          {hasPartialFailure ? (
            <>
              <button
                type="button"
                onClick={() => publish(true)}
                disabled={isPublishing}
                className="op-btn px-5 py-2.5 bg-[var(--op-warning)] text-white hover:brightness-95"
              >
                Retry Failed Divisions
              </button>
              <button
                type="button"
                onClick={() => navigate(`/events/${createdTournamentId}/manage`)}
                className="op-btn px-5 py-2.5 bg-[var(--op-secondary)] text-white hover:brightness-95"
              >
                Open Tournament Management
              </button>
            </>
          ) : null}
        </div>
      </div>
    </TournamentWizardLayout>
  );
};

export default CreateTournamentRegistration;
