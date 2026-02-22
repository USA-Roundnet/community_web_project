import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const toDateInputValue = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    if (typeof dateValue === "string") {
        const matchedDate = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
        if (matchedDate?.[1]) {
            return matchedDate[1];
        }
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const localDate = new Date(
        parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 10);
};

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
        const loadTournament = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`);
                if (!response.ok) {
                    throw new Error("Unable to load tournament details.");
                }

                const tournament = await response.json();
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

        loadTournament();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
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
            setError("Please log in to edit this tournament.");
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
            const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    max_teams: maxTeamsValue,
                }),
            });

            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                throw new Error(
                    errorPayload?.message ||
                        "Unable to update tournament details. Please try again."
                );
            }

            const updatedTournament = await response.json();
            navigate(`/events/${id}/manage`, {
                replace: true,
                state: {
                    message: `Tournament "${updatedTournament.name}" updated successfully.`,
                },
            });
        } catch (submitError) {
            setError(
                submitError?.message ||
                    "Unable to update tournament details. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black px-4">
            <div className="w-full max-w-3xl bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
                    Edit Tournament
                </h1>

                {loading ? <p>Loading tournament details...</p> : null}
                {error ? <p className="text-red-600 mb-4">{error}</p> : null}

                {!loading ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="font-semibold block mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className="font-semibold block mb-1">
                                    City
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="state_province" className="font-semibold block mb-1">
                                    State/Province
                                </label>
                                <input
                                    id="state_province"
                                    name="state_province"
                                    value={formData.state_province}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="zip_code" className="font-semibold block mb-1">
                                    Zip Code
                                </label>
                                <input
                                    id="zip_code"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="font-semibold block mb-1">
                                    Country
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="format" className="font-semibold block mb-1">
                                Format
                            </label>
                            <select
                                id="format"
                                name="format"
                                value={formData.format}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select format</option>
                                <option value="classic">Classic</option>
                                <option value="college">College</option>
                                <option value="asl">ASL</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="start_date" className="font-semibold block mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="font-semibold block mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="max_teams" className="font-semibold block mb-1">
                                    Max Teams
                                </label>
                                <input
                                    type="number"
                                    id="max_teams"
                                    name="max_teams"
                                    value={formData.max_teams}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    min={1}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:bg-gray-400"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/events/${id}/manage`)}
                                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    );
};

export default EditTournamentPage;
