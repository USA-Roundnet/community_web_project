import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { GEOAPIFY_API_KEY } from "../config";

type AddressSuggestion = {
    label: string;
    address1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

const AUTOCOMPLETE_LIMIT = 5;
const AUTOCOMPLETE_DEBOUNCE_MS = 350;

const toGeoapifySuggestions = (features: any[] = []): AddressSuggestion[] =>
    features.map((feature) => {
        const props = feature?.properties || {};
        const address1 =
            [props.housenumber, props.street].filter(Boolean).join(" ").trim() ||
            props.address_line1 ||
            "";
        const city =
            props.city || props.town || props.village || props.hamlet || "";
        const state = props.state || props.state_code || "";
        const zipCode = props.postcode || "";
        const country = props.country || "";

        return {
            label:
                props.formatted ||
                [address1, city, state, country].filter(Boolean).join(", "),
            address1,
            city,
            state,
            zipCode,
            country,
        };
    });

const CreateTournamentBasicInfo = () => {
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("tournamentBasicInfo");
        return saved
            ? JSON.parse(saved)
            : {
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
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addressQuery, setAddressQuery] = useState(formData.address1 || "");
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [addressLoading, setAddressLoading] = useState(false);
    const navigate = useNavigate();
    const todayIso = new Date().toISOString().slice(0, 10);
    const isAddressAutocompleteEnabled = Boolean(GEOAPIFY_API_KEY);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please log in to create a tournament.");
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
                const geoapifyUrl = new URL(
                    "https://api.geoapify.com/v1/geocode/autocomplete"
                );
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
                const suggestions = toGeoapifySuggestions(data?.features);

                setAddressSuggestions(
                    suggestions.filter((suggestion) => suggestion.label.length > 0)
                );
            } catch (fetchError: any) {
                if (!isActive) {
                    return;
                }
                if (fetchError?.name !== "AbortError") {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        if (name === "address1") {
            setAddressQuery(value);
        }
        localStorage.setItem(
            "tournamentBasicInfo",
            JSON.stringify(updatedData)
        );
    };

    const handleAddressSuggestionSelect = (suggestion: AddressSuggestion) => {
        const updatedData = {
            ...formData,
            address1: suggestion.address1 || formData.address1,
            city: suggestion.city || formData.city,
            state: suggestion.state || formData.state,
            zipCode: suggestion.zipCode || formData.zipCode,
            country: suggestion.country || formData.country,
        };

        setFormData(updatedData);
        setAddressQuery(updatedData.address1);
        setAddressSuggestions([]);
        localStorage.setItem("tournamentBasicInfo", JSON.stringify(updatedData));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const requiredFields = [
            { field: "tournamentName", label: "Tournament Name" },
            { field: "startDate", label: "Start Date" },
            { field: "endDate", label: "End Date" },
            { field: "maxTeams", label: "Max Teams" },
            { field: "address1", label: "Address" },
            { field: "city", label: "City" },
            { field: "state", label: "State" },
            { field: "zipCode", label: "Zip Code" },
            { field: "country", label: "Country" },
        ];

        const missingFields = requiredFields
            .filter(({ field }) => !formData[field])
            .map(({ label }) => label);

        if (missingFields.length > 0) {
            const fieldsList = missingFields.join(", ");
            setError(
                `Please fill in the following required fields: ${fieldsList}`
            );
            setIsLoading(false);
            return;
        }

        if (formData.startDate < todayIso) {
            setError("Start Date cannot be before today.");
            setIsLoading(false);
            return;
        }

        if (formData.endDate < formData.startDate) {
            setError("End Date must be on or after Start Date.");
            setIsLoading(false);
            return;
        }

        try {
            localStorage.setItem(
                "tournamentBasicInfo",
                JSON.stringify(formData)
            );
            navigate("/events/create/format", { replace: true });
        } catch {
            setError("Tournament creation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black">
            <div className="w-full max-w-4xl flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-10">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
                    Create Tournament
                </h1>
                <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 text-center">
                    Basic Info
                </h2>
                {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            className="w-full p-3 sm:p-4 rounded-md text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 font-semibold text-sm sm:text-base"
                            type="text"
                            id="tournamentName"
                            name="tournamentName"
                            value={formData.tournamentName}
                            onChange={handleChange}
                            placeholder="Tournament Name"
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full p-3 sm:p-4 rounded-md text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 min-h-[80px] font-medium text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="startDate"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                min={todayIso}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="endDate"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate || todayIso}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="time"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                Start Time (optional)
                            </label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="maxTeams"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                Max Teams
                            </label>
                            <input
                                type="number"
                                id="maxTeams"
                                name="maxTeams"
                                value={formData.maxTeams}
                                onChange={handleChange}
                                min={1}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="text-blue-900 font-semibold mb-2 block text-sm sm:text-base"
                        >
                            Location
                        </label>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                id="address1"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                placeholder="Address 1 (start typing for suggestions)"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            />
                            {addressLoading && (
                                <p className="text-sm text-blue-900">Looking up addresses...</p>
                            )}
                            {addressSuggestions.length > 0 && (
                                <div className="rounded-md border border-gray-300 bg-white shadow-sm max-h-56 overflow-y-auto">
                                    {addressSuggestions.map((suggestion, index) => (
                                        <button
                                            key={`${suggestion.label}-${index}`}
                                            type="button"
                                            className="hover:cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                            onClick={() =>
                                                handleAddressSuggestionSelect(suggestion)
                                            }
                                        >
                                            {suggestion.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {!isAddressAutocompleteEnabled && addressQuery.trim().length >= 3 && (
                                <p className="text-xs text-gray-600">
                                    Address suggestions are currently unavailable. You can keep entering your address manually.
                                </p>
                            )}
                            <input
                                type="text"
                                id="address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                placeholder="Address 2"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                            />
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="Zip"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="hover:cursor-pointer w-full py-3 mt-2 rounded-md bg-blue-900 text-white font-bold text-base sm:text-lg shadow hover:bg-blue-800 transition-colors duration-300"
                    >
                        {isLoading ? "Next..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentBasicInfo;
