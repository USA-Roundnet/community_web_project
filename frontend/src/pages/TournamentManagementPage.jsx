import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const TournamentManagementPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [tournament, setTournament] = useState(null);
    const [error, setError] = useState("");

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
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentManagementPage;
