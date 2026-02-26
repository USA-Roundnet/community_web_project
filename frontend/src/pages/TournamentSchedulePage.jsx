import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { formatSqlDateTime } from "../utils/dateTime";
import { parseJsonSafely } from "../utils/http";

const formatDateTime = (dateValue) => {
    if (!dateValue) {
        return "TBD";
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return "TBD";
    }

    return parsedDate.toLocaleString();
};

const TournamentSchedulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        registration1_id: "",
        registration2_id: "",
        scheduled_date: "",
        scheduled_time: "",
        location: "",
    });

    const getTokenOrRedirect = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please log in to manage match schedules.");
            navigate("/login", {
                replace: true,
                state: { from: `/events/${id}/schedule` },
            });
            return null;
        }
        return token;
    };

    const loadPageData = async () => {
        const token = getTokenOrRedirect();
        if (!token) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            const [candidatesResponse, matchesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/api/tournaments/${id}/matches/candidates`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`${API_BASE_URL}/api/tournaments/${id}/matches`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            if (!candidatesResponse.ok) {
                const payload = await parseJsonSafely(candidatesResponse);
                throw new Error(
                    payload?.message || "Unable to load eligible teams for scheduling."
                );
            }

            if (!matchesResponse.ok) {
                const payload = await parseJsonSafely(matchesResponse);
                throw new Error(
                    payload?.message || "Unable to load current match schedule."
                );
            }

            const candidatesData = (await parseJsonSafely(candidatesResponse)) || [];
            const matchesData = (await parseJsonSafely(matchesResponse)) || [];
            setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
            setMatches(Array.isArray(matchesData) ? matchesData : []);
        } catch (loadError) {
            setError(loadError?.message || "Unable to load match scheduling data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPageData();
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
        setMessage("");

        const token = getTokenOrRedirect();
        if (!token) {
            return;
        }

        if (
            !formData.registration1_id ||
            !formData.registration2_id ||
            !formData.scheduled_date ||
            !formData.scheduled_time ||
            !formData.location
        ) {
            setError("Please complete all schedule fields before submitting.");
            return;
        }

        if (formData.registration1_id === formData.registration2_id) {
            setError("Team 1 and Team 2 must be different teams.");
            return;
        }

        const scheduledDateTime = new Date(
            `${formData.scheduled_date}T${formData.scheduled_time}:00`
        );
        if (Number.isNaN(scheduledDateTime.getTime())) {
            setError("Please provide a valid scheduled date and time.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}/matches`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    registration1_id: Number(formData.registration1_id),
                    registration2_id: Number(formData.registration2_id),
                    scheduled_date: formData.scheduled_date,
                    scheduled_time: formData.scheduled_time,
                    location: formData.location.trim(),
                    scheduled_at: formatSqlDateTime(scheduledDateTime),
                }),
            });

            if (!response.ok) {
                const payload = await parseJsonSafely(response);
                throw new Error(
                    payload?.message || "Unable to schedule the match. Please try again."
                );
            }

            const createdMatch = await parseJsonSafely(response);
            const deliveredCount = createdMatch?.notifications?.delivered || 0;
            setMessage(
                `Match scheduled successfully.${deliveredCount > 0 ? ` Notifications sent: ${deliveredCount}.` : ""}`
            );
            setFormData((previous) => ({
                ...previous,
                registration1_id: "",
                registration2_id: "",
                scheduled_date: "",
                scheduled_time: "",
                location: "",
            }));
            await loadPageData();
        } catch (submitError) {
            setError(submitError?.message || "Unable to schedule the match.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black px-4">
            <div className="w-full max-w-4xl bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
                    Schedule Matches
                </h1>

                {loading ? <p>Loading schedule data...</p> : null}
                {error ? <p className="text-red-600 mb-4">{error}</p> : null}
                {message ? <p className="text-green-700 mb-4 font-semibold">{message}</p> : null}

                {!loading ? (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="registration1_id" className="font-semibold block mb-1">
                                        Team 1
                                    </label>
                                    <select
                                        id="registration1_id"
                                        name="registration1_id"
                                        value={formData.registration1_id}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        required
                                    >
                                        <option value="">Select first team</option>
                                        {candidates.map((candidate) => (
                                            <option
                                                key={`team1-${candidate.registration_id}`}
                                                value={candidate.registration_id}
                                            >
                                                {candidate.team_name} (Registration #{candidate.registration_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="registration2_id" className="font-semibold block mb-1">
                                        Team 2
                                    </label>
                                    <select
                                        id="registration2_id"
                                        name="registration2_id"
                                        value={formData.registration2_id}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        required
                                    >
                                        <option value="">Select second team</option>
                                        {candidates.map((candidate) => (
                                            <option
                                                key={`team2-${candidate.registration_id}`}
                                                value={candidate.registration_id}
                                            >
                                                {candidate.team_name} (Registration #{candidate.registration_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="scheduled_date" className="font-semibold block mb-1">
                                        Match Date
                                    </label>
                                    <input
                                        type="date"
                                        id="scheduled_date"
                                        name="scheduled_date"
                                        value={formData.scheduled_date}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="scheduled_time" className="font-semibold block mb-1">
                                        Match Time
                                    </label>
                                    <input
                                        type="time"
                                        id="scheduled_time"
                                        name="scheduled_time"
                                        value={formData.scheduled_time}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="font-semibold block mb-1">
                                        Match Location
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Court / Field / Venue"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:bg-gray-400"
                                >
                                    {submitting ? "Scheduling..." : "Schedule Match"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/events/${id}/manage`)}
                                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors"
                                >
                                    Back to Management
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-blue-900 mb-3">
                                Current Match Schedule
                            </h2>
                            {matches.length === 0 ? (
                                <p className="text-gray-700">No matches have been scheduled yet.</p>
                            ) : (
                                <div className="overflow-x-auto border border-gray-200 rounded-md">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-3 font-semibold">Teams</th>
                                                <th className="text-left p-3 font-semibold">Date & Time</th>
                                                <th className="text-left p-3 font-semibold">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matches.map((match) => (
                                                <tr key={match.id} className="border-t border-gray-200">
                                                    <td className="p-3">
                                                        {match.team1_name} vs {match.team2_name}
                                                    </td>
                                                    <td className="p-3">{formatDateTime(match.scheduled_at)}</td>
                                                    <td className="p-3">{match.location || "TBD"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default TournamentSchedulePage;
