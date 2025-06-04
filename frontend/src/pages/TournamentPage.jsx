import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchTournament = async (id) => {
    // fetch(`/api/tournaments/${id}`).then(res => res.json());
    return {
        id,
        eventName: "Sample Tournament",
        description: "A fun roundnet tournament.",
        date: "2025-07-01",
        time: "12:00",
        address1: "123 Main St",
        address2: "",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        format: "traditional",
        bracketStyle: "single",
        rules: "Standard rules apply.",
        registration: {
            deadline: "1week",
            availability: "public",
            divisionsType: "custom",
            numDivisons: 2,
            divisions: [
                { divisionName: "4.0 Open", playersPerTeam: 2, maxTeams: 16 },
                {
                    divisionName: "Intermediate",
                    playersPerTeam: 2,
                    maxTeams: 8,
                },
            ],
        },
    };
};

const TournamentPage = () => {
    const { tournamentid } = useParams();
    const location = useLocation();
    const [tournament, setTournament] = useState(location.state?.event || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tournament) {
            fetchTournament(tournamentid).then((data) => {
                setTournament(data);
            });
        }
        setLoading(false);
    }, [tournament, tournamentid]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!tournament)
        return <div className="text-center mt-10">Tournament not found.</div>;

    return (
        <div className="w-full flex items-center justify-center text-black">
            <div className="w-7/8 flex flex-col items-start justify-between ">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
                    {tournament.eventName}
                </h1>
                <p className="text-blue-800 text-center mb-4">
                    {tournament.description}
                </p>
                <div className="mb-4">
                    <span className="font-semibold text-blue-900">Date:</span>{" "}
                    {tournament.date} &nbsp;
                    <span className="font-semibold text-blue-900">
                        Time:
                    </span>{" "}
                    {tournament.time}
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-blue-900">
                        Location:
                    </span>
                    <br />
                    {tournament.address1}
                    <br />
                    {tournament.address2 && (
                        <>
                            {tournament.address2}
                            <br />
                        </>
                    )}
                    {tournament.city}, {tournament.state} {tournament.zipCode},{" "}
                    {tournament.country}
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-blue-900">Format:</span>{" "}
                    {tournament.format}
                    <br />
                    <span className="font-semibold text-blue-900">
                        Bracket Style:
                    </span>{" "}
                    {tournament.bracketStyle}
                    <br />
                    <span className="font-semibold text-blue-900">
                        Rules:
                    </span>{" "}
                    {tournament.rules}
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-blue-900">
                        Registration Deadline:
                    </span>{" "}
                    {tournament.registration.deadline}
                    <br />
                    <span className="font-semibold text-blue-900">
                        Availability:
                    </span>{" "}
                    {tournament.registration.availability}
                    <br />
                    <span className="font-semibold text-blue-900">
                        Divisions Type:
                    </span>{" "}
                    {tournament.registration.divisionsType}
                    <br />
                    <span className="font-semibold text-blue-900">
                        Divisions:
                    </span>
                    <ul className="list-disc ml-6">
                        {tournament.registration.divisions.map((div, idx) => (
                            <li key={idx}>
                                <span className="font-semibold">
                                    {div.divisionName}
                                </span>{" "}
                                -{div.playersPerTeam} players/team, max{" "}
                                {div.maxTeams} teams
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TournamentPage;
