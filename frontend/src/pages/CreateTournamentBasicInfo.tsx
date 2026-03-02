import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { GEOAPIFY_API_KEY } from "../config";
import TournamentWizardLayout from "../features/tournament-ui/components/TournamentWizardLayout";
import TournamentPanel from "../features/tournament-ui/components/TournamentPanel";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import useLocalStorageState from "../features/tournament-ui/hooks/useLocalStorageState";

type AddressSuggestion = {
  label: string;
  address1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type BasicInfoForm = {
  tournamentName: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  maxTeams: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

const defaultBasicInfo: BasicInfoForm = {
  tournamentName: "",
  description: "",
  startDate: "",
  endDate: "",
  time: "",
  maxTeams: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

const AUTOCOMPLETE_LIMIT = 5;
const AUTOCOMPLETE_DEBOUNCE_MS = 350;

const toGeoapifySuggestions = (features: any[] = []): AddressSuggestion[] =>
  features
    .map((feature) => {
      const props = feature?.properties || {};
      const address1 =
        [props.housenumber, props.street].filter(Boolean).join(" ").trim() ||
        props.address_line1 ||
        "";
      const city = props.city || props.town || props.village || props.hamlet || "";
      const state = props.state || props.state_code || "";
      const zipCode = props.postcode || "";
      const country = props.country || "";

      return {
        label:
          props.formatted || [address1, city, state, country].filter(Boolean).join(", "),
        address1,
        city,
        state,
        zipCode,
        country,
      };
    })
    .filter((entry) => entry.label.length > 0);

const getCompletion = (value: BasicInfoForm) => {
  const requiredKeys: (keyof BasicInfoForm)[] = [
    "tournamentName",
    "startDate",
    "endDate",
    "maxTeams",
    "address1",
    "city",
    "state",
    "zipCode",
    "country",
  ];

  const complete = requiredKeys.filter((key) => `${value[key] || ""}`.trim().length > 0)
    .length;

  return {
    complete,
    total: requiredKeys.length,
  };
};

const CreateTournamentBasicInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useLocalStorageState(
    "tournamentBasicInfo",
    defaultBasicInfo
  ) as [
    BasicInfoForm,
    Dispatch<SetStateAction<BasicInfoForm>>,
    () => void
  ];
  const [error, setError] = useState<string | null>(null);
  const [addressQuery, setAddressQuery] = useState(formData.address1 || "");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const completion = useMemo(() => getCompletion(formData), [formData]);
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isAddressAutocompleteEnabled = Boolean(GEOAPIFY_API_KEY);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: "/events/create" },
      });
    }
  }, [navigate]);

  useEffect(() => {
    const query = addressQuery.trim();
    if (query.length < 3 || !isAddressAutocompleteEnabled) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      return;
    }

    let isActive = true;
    const abortController = new AbortController();
    const timeoutId = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const geoapifyUrl = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
        geoapifyUrl.searchParams.set("text", query);
        geoapifyUrl.searchParams.set("limit", String(AUTOCOMPLETE_LIMIT));
        geoapifyUrl.searchParams.set("apiKey", GEOAPIFY_API_KEY);

        const response = await fetch(geoapifyUrl.toString(), {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error("Address lookup failed");
        }

        const data = await response.json();
        if (isActive) {
          setAddressSuggestions(toGeoapifySuggestions(data?.features));
        }
      } catch (fetchError: any) {
        if (isActive && fetchError?.name !== "AbortError") {
          setAddressSuggestions([]);
        }
      } finally {
        if (isActive) {
          setAddressLoading(false);
        }
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [addressQuery, isAddressAutocompleteEnabled]);

  const setField = (name: keyof BasicInfoForm, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "address1") {
      setAddressQuery(value);
    }
  };

  const handleAddressSuggestionSelect = (suggestion: AddressSuggestion) => {
    setFormData((previous) => ({
      ...previous,
      address1: suggestion.address1 || previous.address1,
      city: suggestion.city || previous.city,
      state: suggestion.state || previous.state,
      zipCode: suggestion.zipCode || previous.zipCode,
      country: suggestion.country || previous.country,
    }));
    setAddressQuery(suggestion.address1 || formData.address1);
    setAddressSuggestions([]);
  };

  const validate = () => {
    const requiredFields: Array<{ key: keyof BasicInfoForm; label: string }> = [
      { key: "tournamentName", label: "Tournament Name" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      { key: "maxTeams", label: "Max Teams" },
      { key: "address1", label: "Address" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "zipCode", label: "Zip Code" },
      { key: "country", label: "Country" },
    ];

    const missing = requiredFields
      .filter((field) => `${formData[field.key] || ""}`.trim().length === 0)
      .map((field) => field.label);

    if (missing.length > 0) {
      throw new Error(`Complete required fields: ${missing.join(", ")}`);
    }

    if (formData.startDate < todayIso) {
      throw new Error("Start Date cannot be before today.");
    }

    if (formData.endDate < formData.startDate) {
      throw new Error("End Date must be on or after Start Date.");
    }

    const parsedMaxTeams = Number(formData.maxTeams);
    if (!Number.isInteger(parsedMaxTeams) || parsedMaxTeams <= 0) {
      throw new Error("Max Teams must be a positive integer.");
    }
  };

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      validate();
      navigate("/events/create/format", { replace: true });
    } catch (validationError: any) {
      setError(validationError?.message || "Please review your entries.");
    }
  };

  const summary = (
    <div className="space-y-3 text-sm text-[var(--op-text-muted)]">
      <p>
        Step completion: <span className="font-semibold text-[var(--op-text)]">{completion.complete}/{completion.total}</span>
      </p>
      <p>Draft status: <span className="font-semibold text-[var(--op-accent)]">Saved automatically</span></p>
      <ul className="list-disc list-inside space-y-1">
        <li>Set valid dates (start cannot be in the past).</li>
        <li>Define max team capacity.</li>
        <li>Confirm tournament location details.</li>
      </ul>
    </div>
  );

  return (
    <TournamentWizardLayout
      step={1}
      title="Create Tournament"
      subtitle="Capture core logistics first. This draft auto-saves and powers all downstream setup."
      summary={summary}
      banner={
        error ? (
          <InlineBanner tone="error" title="Validation issue" message={error} />
        ) : (
          <InlineBanner
            tone="info"
            title="Operator tip"
            message="Use a full street address so scheduling and participant communications stay accurate."
          />
        )
      }
    >
      <TournamentPanel title="Basic Information" subtitle="Fields marked as required are needed before moving to format setup.">
        <form onSubmit={handleNext} className="space-y-4 op-ui">
          <div>
            <label htmlFor="tournamentName" className="block text-sm font-semibold mb-1">Tournament Name</label>
            <input
              id="tournamentName"
              value={formData.tournamentName}
              onChange={(event) => setField("tournamentName", event.target.value)}
              className="op-input w-full p-3"
              placeholder="USAR Regional Qualifier"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(event) => setField("description", event.target.value)}
              className="op-textarea w-full p-3 min-h-[96px]"
              placeholder="Add context for directors, teams, and spectators."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold mb-1">Start Date</label>
              <input
                id="startDate"
                type="date"
                min={todayIso}
                value={formData.startDate}
                onChange={(event) => setField("startDate", event.target.value)}
                className="op-input w-full p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold mb-1">End Date</label>
              <input
                id="endDate"
                type="date"
                min={formData.startDate || todayIso}
                value={formData.endDate}
                onChange={(event) => setField("endDate", event.target.value)}
                className="op-input w-full p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-semibold mb-1">Start Time (optional)</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(event) => setField("time", event.target.value)}
                className="op-input w-full p-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="maxTeams" className="block text-sm font-semibold mb-1">Max Teams</label>
            <input
              id="maxTeams"
              type="number"
              min={1}
              value={formData.maxTeams}
              onChange={(event) => setField("maxTeams", event.target.value)}
              className="op-input w-full p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="address1" className="block text-sm font-semibold mb-1">Address Line 1</label>
            <input
              id="address1"
              value={formData.address1}
              onChange={(event) => setField("address1", event.target.value)}
              className="op-input w-full p-3"
              placeholder="123 Example Avenue"
              required
            />
            {isAddressAutocompleteEnabled ? (
              <p className="mt-1 text-xs text-[var(--op-text-muted)]">
                Address suggestions appear after 3 characters.
              </p>
            ) : (
              <p className="mt-1 text-xs text-[var(--op-warning)]">
                Address autocomplete disabled (missing `VITE_GEOAPIFY_API_KEY`).
              </p>
            )}
            {addressLoading ? <p className="mt-1 text-xs text-[var(--op-text-muted)]">Loading suggestions...</p> : null}
            {addressSuggestions.length > 0 ? (
              <div className="mt-2 border border-[var(--op-border)] rounded-xl overflow-hidden">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.label}-${index}`}
                    type="button"
                    onClick={() => handleAddressSuggestionSelect(suggestion)}
                    className="w-full text-left p-2 text-sm hover:bg-[var(--op-surface-muted)] border-b border-[var(--op-border)] last:border-0"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="address2" className="block text-sm font-semibold mb-1">Address Line 2</label>
            <input
              id="address2"
              value={formData.address2}
              onChange={(event) => setField("address2", event.target.value)}
              className="op-input w-full p-3"
              placeholder="Suite, building, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold mb-1">City</label>
              <input
                id="city"
                value={formData.city}
                onChange={(event) => setField("city", event.target.value)}
                className="op-input w-full p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-semibold mb-1">State / Province</label>
              <input
                id="state"
                value={formData.state}
                onChange={(event) => setField("state", event.target.value)}
                className="op-input w-full p-3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-semibold mb-1">Zip / Postal Code</label>
              <input
                id="zipCode"
                value={formData.zipCode}
                onChange={(event) => setField("zipCode", event.target.value)}
                className="op-input w-full p-3"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-semibold mb-1">Country</label>
              <input
                id="country"
                value={formData.country}
                onChange={(event) => setField("country", event.target.value)}
                className="op-input w-full p-3"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              className="op-btn px-5 py-2.5 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
            >
              Continue to Format
            </button>
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="op-btn px-5 py-2.5 bg-white border border-[var(--op-border)] text-[var(--op-secondary)] hover:bg-[var(--op-surface-muted)]"
            >
              Cancel Setup
            </button>
          </div>
        </form>
      </TournamentPanel>
    </TournamentWizardLayout>
  );
};

export default CreateTournamentBasicInfo;
