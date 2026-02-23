import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const getStatusDisplay = (status) => {
    switch ((status || "").toLowerCase()) {
        case "upcoming":
            return { label: "Upcoming", colorClass: "text-blue-700 bg-blue-100" };
        case "in_progress":
            return { label: "In Progress", colorClass: "text-green-700 bg-green-100" };
        case "completed":
            return { label: "Completed", colorClass: "text-gray-700 bg-gray-200" };
        default:
            return { label: "Unknown", colorClass: "text-gray-700 bg-gray-100" };
    }
};

const TournamentEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isDirector = useMemo(() => {
        const localUserId = Number(localStorage.getItem("userId"));
        return Boolean(localUserId && localUserId === Number(tournament?.director_id));
    }, [tournament?.director_id]);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`);
                if (!response.ok) {
                    throw new Error("Unable to load tournament details.");
                }

                const tournamentData = await response.json();
                setTournament(tournamentData);
            } catch (fetchError) {
                setError(fetchError?.message || "Unable to load tournament details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTournament();
    }, [id]);

    const statusDisplay = getStatusDisplay(tournament?.status);

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black px-4">
            <div className="w-full max-w-3xl bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
                {loading ? <p>Loading tournament details...</p> : null}
                {error ? <p className="text-red-600">{error}</p> : null}

                {!loading && !error ? (
                    <>
                        <div className="flex items-center justify-between mb-4 gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                                {tournament?.name}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${statusDisplay.colorClass}`}
                            >
                                {statusDisplay.label}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold">Location:</span>{" "}
                                {[tournament?.city, tournament?.state_province, tournament?.country]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                            <p>
                                <span className="font-semibold">Format:</span>{" "}
                                {tournament?.format || "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Start Date:</span>{" "}
                                {formatDate(tournament?.start_date)}
                            </p>
                            <p>
                                <span className="font-semibold">End Date:</span>{" "}
                                {formatDate(tournament?.end_date)}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/events")}
                                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors"
                            >
                                Back to Events
                            </button>
                            {isDirector ? (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/events/${id}/manage`)}
                                    className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition-colors"
                                >
                                    Manage Tournament
                                </button>
                            ) : null}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default TournamentEventPage;
