import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { parseJsonSafely } from "../utils/http";

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

        const loadDetails = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(
                    `${API_BASE_URL}/api/tournaments/${id}/details`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    const payload = await parseJsonSafely(response);
                    throw new Error(
                        payload?.message || "Unable to load tournament details."
                    );
                }

                const payload = await parseJsonSafely(response);
                setDetails(payload);
            } catch (loadError) {
                setError(loadError?.message || "Unable to load tournament details.");
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [id, token, navigate]);

    const tournament = details?.tournament;
    const divisions = details?.divisions || [];
    const registrations = details?.registrations || [];
    const schedule = details?.schedule || [];

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black px-4">
            <div className="w-full max-w-6xl bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
                    Tournament Details
                </h1>

                {loading ? <p>Loading tournament details...</p> : null}
                {error ? <p className="text-red-600 mb-3">{error}</p> : null}

                {!loading && !error ? (
                    <>
                        <section className="mb-6">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">
                                Core Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <p><span className="font-semibold">Name:</span> {tournament?.name}</p>
                                <p><span className="font-semibold">Format:</span> {tournament?.format}</p>
                                <p><span className="font-semibold">Status:</span> {tournament?.status}</p>
                                <p><span className="font-semibold">Max Teams:</span> {tournament?.max_teams}</p>
                                <p><span className="font-semibold">City:</span> {tournament?.city}</p>
                                <p><span className="font-semibold">State/Province:</span> {tournament?.state_province}</p>
                                <p><span className="font-semibold">Zip:</span> {tournament?.zip_code}</p>
                                <p><span className="font-semibold">Country:</span> {tournament?.country}</p>
                                <p><span className="font-semibold">Start:</span> {formatDate(tournament?.start_date)}</p>
                                <p><span className="font-semibold">End:</span> {formatDate(tournament?.end_date)}</p>
                            </div>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">
                                Divisions
                            </h2>
                            <div className="overflow-x-auto border border-gray-200 rounded-md">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left p-2">Division</th>
                                            <th className="text-left p-2">Max Teams</th>
                                            <th className="text-left p-2">Registered Teams</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {divisions.length === 0 ? (
                                            <tr>
                                                <td className="p-3 text-gray-600" colSpan={3}>
                                                    No divisions configured.
                                                </td>
                                            </tr>
                                        ) : (
                                            divisions.map((division) => (
                                                <tr key={division.id} className="border-t border-gray-200">
                                                    <td className="p-2">{division.division_name}</td>
                                                    <td className="p-2">{division.max_teams ?? "N/A"}</td>
                                                    <td className="p-2">{division.registered_teams ?? 0}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">
                                Registered Teams
                            </h2>
                            <div className="overflow-x-auto border border-gray-200 rounded-md">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
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
                                                <td className="p-3 text-gray-600" colSpan={4}>
                                                    No teams registered yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            registrations.map((registration) => (
                                                <tr key={registration.id} className="border-t border-gray-200">
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
                        </section>

                        <section className="mb-6">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">
                                Schedule
                            </h2>
                            {schedule.length === 0 ? (
                                <p className="text-sm text-gray-600">
                                    No schedule available yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto border border-gray-200 rounded-md">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="text-left p-2">Match</th>
                                                <th className="text-left p-2">Location</th>
                                                <th className="text-left p-2">Wins Needed</th>
                                                <th className="text-left p-2">Scheduled</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.map((series) => (
                                                <tr key={series.id} className="border-t border-gray-200">
                                                    <td className="p-2">
                                                        {series.registration1_team_name || "TBD"} vs {" "}
                                                        {series.registration2_team_name || "TBD"}
                                                    </td>
                                                    <td className="p-2">{series.location || "TBD"}</td>
                                                    <td className="p-2">{series.wins_needed}</td>
                                                    <td className="p-2">{formatDate(series.created_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(`/events/${id}/manage`)}
                                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                            >
                                Back to Management
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/events/${id}/schedule`)}
                                className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800"
                            >
                                Schedule Matches
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default TournamentDetailsPage;
