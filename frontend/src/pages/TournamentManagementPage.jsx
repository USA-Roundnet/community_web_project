import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

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

const formatStatus = (status) => {
    switch ((status || "").toLowerCase()) {
        case "upcoming":
            return "Upcoming";
        case "in_progress":
            return "In Progress";
        case "completed":
            return "Completed";
        default:
            return "Unknown";
    }
};

const TournamentManagementPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadTournament = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`);
                if (!response.ok) {
                    throw new Error("Unable to load tournament details.");
                }
                const data = await response.json();
                setTournament(data);
            } catch (err) {
                setError(err?.message || "Unable to load tournament details.");
            }
        };

        loadTournament();
    }, [id]);

    const handleDeleteTournament = async () => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this tournament? This action cannot be undone."
        );

        if (!shouldDelete) {
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please log in to delete this tournament.");
            navigate("/login", {
                replace: true,
                state: { from: `/events/${id}/manage` },
            });
            return;
        }

        try {
            setDeleting(true);
            setError("");
            const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                throw new Error(
                    errorPayload?.message ||
                        "Unable to delete the tournament. Please try again."
                );
            }

            navigate("/events", {
                replace: true,
                state: {
                    message: `Tournament "${tournament?.name || id}" deleted successfully.`,
                },
            });
        } catch (err) {
            setError(err?.message || "Unable to delete the tournament.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black px-4">
            <div className="w-full max-w-3xl bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                    Tournament Management
                </h1>
                {location.state?.message ? (
                    <p className="text-green-700 font-semibold mb-4">
                        {location.state.message}
                    </p>
                ) : null}
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="space-y-1">
                        <p><span className="font-semibold">Tournament ID:</span> {tournament?.id || id}</p>
                        <p><span className="font-semibold">Name:</span> {tournament?.name || "Loading..."}</p>
                        <p><span className="font-semibold">Location:</span> {[tournament?.city, tournament?.state_province, tournament?.country].filter(Boolean).join(", ") || "Loading..."}</p>
                        <p><span className="font-semibold">Format:</span> {tournament?.format || "Loading..."}</p>
                        <p><span className="font-semibold">Status:</span> {formatStatus(tournament?.status)}</p>
                        <p><span className="font-semibold">Dates:</span> {formatDate(tournament?.start_date)} - {formatDate(tournament?.end_date)}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(`/events/${id}`)}
                                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors"
                            >
                                View Event Page
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/events/${id}/edit`)}
                                className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition-colors"
                            >
                                Edit Tournament
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/events/${id}/schedule`)}
                                className="px-4 py-2 rounded-md bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
                            >
                                Schedule Matches
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteTournament}
                                disabled={deleting}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:bg-gray-400"
                            >
                                {deleting ? "Deleting..." : "Delete Tournament"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentManagementPage;
