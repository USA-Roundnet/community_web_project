import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchTournament = async (id) => {
    // fetch(`/api/tournaments/${id}`).then(res => res.json());
    return {
        ownerId: "12345",
        id,
        image: "https://thvnext.bing.com/th/id/OIP._6cjKRohOQvb9D9VAcVw4AHaFj?cb=thvnext&rs=1&pid=ImgDetMain",
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
            numDivisons: 4,
            divisions: [
                {
                    divisionName: "5.0 Open Bronze+",
                    playersPerTeam: 2,
                    maxTeams: 16,
                    fees: 20,
                },
                {
                    divisionName: "4.5 Women's",
                    playersPerTeam: 2,
                    maxTeams: 16,
                    fees: 20,
                },
                {
                    divisionName: "4.0 Open",
                    playersPerTeam: 2,
                    maxTeams: 16,
                    fees: 20,
                },
                {
                    divisionName: "2.0-3.0 Intermediate",
                    playersPerTeam: 2,
                    maxTeams: 8,
                    fees: 20,
                },
            ],
        },
        registeredTeams: {
            "5.0 Open Bronze+": [
                { teamName: "NY Smashers", players: ["Alice", "Bob"] },
                { teamName: "Spike Kings", players: ["Charlie", "David"] },
                { teamName: "Roundnet Rebels", players: ["Eve", "Frank"] },
                { teamName: "Empire Spikers", players: ["Grace", "Heidi"] },
                { teamName: "Central Park Pros", players: ["Ivan", "Judy"] },
                { teamName: "Bronze Ballers", players: ["Kyle", "Liam"] },
            ],
            "4.5 Women's": [
                { teamName: "NY Queens", players: ["Mia", "Nina"] },
                { teamName: "Lady Smash", players: ["Olivia", "Paula"] },
                { teamName: "Spike Sisters", players: ["Quinn", "Rita"] },
                { teamName: "Empire Women", players: ["Sophie", "Tina"] },
                { teamName: "Central Park Chicks", players: ["Uma", "Vera"] },
                { teamName: "Bronze Babes", players: ["Wendy", "Xena"] },
            ],
            "4.0 Open": [
                { teamName: "Open Smashers", players: ["Yara", "Zane"] },
                { teamName: "Open Kings", players: ["Amy", "Ben"] },
                { teamName: "Open Rebels", players: ["Carl", "Dana"] },
                { teamName: "Open Pros", players: ["Eli", "Fay"] },
                { teamName: "Open Ballers", players: ["Gus", "Holly"] },
                { teamName: "Open Legends", players: ["Ivy", "Jack"] },
            ],
            "2.0-3.0 Intermediate": [
                { teamName: "Inter Smashers", players: ["Kara", "Leo"] },
                { teamName: "Inter Kings", players: ["Mona", "Ned"] },
                { teamName: "Inter Rebels", players: ["Omar", "Pam"] },
                { teamName: "Inter Pros", players: ["Quincy", "Rae"] },
                { teamName: "Inter Ballers", players: ["Sam", "Tara"] },
                { teamName: "Inter Legends", players: ["Uma", "Vic"] },
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
        <div className="w-full min-h-screen flex items-center justify-center py-10">
            <div className="w-7/8 flex flex-col gap-8 ">
                {/* Event Name, Image, Description */}
                <div className="flex flex-row items-center justify-between w-full text-black">
                    <div className="w-3/4 flex flex-row gap-10 items-center">
                        <img
                            src={tournament.image}
                            alt={tournament.eventName}
                            className="max-h-56 w-56 object-cover rounded-xl shadow-md border border-blue-200 bg-white"
                        />
                        <div className="flex-1 flex flex-col gap-2 items-start justify-center">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-1">
                                {tournament.eventName}
                            </h1>
                            <p className="text-lg font-medium">
                                {tournament.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end w-1/4 gap-4 p-8">
                        <button className="hover:cursor-pointer px-5 py-3 text-[#f8f8f8] bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-300">
                            Register
                        </button>
                        <p>
                            Registration closes in{" "}
                            {tournament.registration.deadline}
                        </p>
                    </div>
                </div>{" "}
                <hr className="text-black" />
                {/* Time and Location */}
                <div className="flex flex-row text-black w-full h-[40vh] items-end justify-between">
                    <div className="flex flex-col items-start h-full w-2/5 justify-between">
                        <div className="h-[30%] p-4 flex items-start justify-start">
                            <h2 className="text-4xl font-semibold text-blue-900">
                                Event Details
                            </h2>
                        </div>
                        <div className="flex flex-col p-4 gap-2 text-lg font-medium">
                            <span>Date: {tournament.date}</span>
                            <span>Time: {tournament.time}</span>
                            <span>
                                Location: {tournament.address1}
                                {tournament.address2 &&
                                    `, ${tournament.address2}`}
                                , <br /> {tournament.city}, {tournament.state}{" "}
                                {tournament.zipCode}, {tournament.country}
                            </span>
                        </div>
                        <div className="p-4 text-lg font-medium">
                            <span className="font-semibold text-yellow-900">
                                Availability:
                            </span>{" "}
                            {tournament.registration.availability}
                        </div>
                    </div>
                    <div className="w-1/2 h-full rounded overflow-hidden shadow">
                        <iframe
                            title="Google Maps"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                `${tournament.address1}${
                                    tournament.address2
                                        ? ", " + tournament.address2
                                        : ""
                                }, ${tournament.city}, ${tournament.state} ${
                                    tournament.zipCode
                                }, ${tournament.country}`
                            )}&output=embed`}
                        ></iframe>
                    </div>
                </div>
                <hr className="text-black" />
                {/* Rules, Format, Bracket Style */}
                <div className="flex flex-col h-[40vh] justify-between text-black w-full items-start">
                    <div className="h-[25%] p-4 flex items-center justify-center">
                        <h2 className="text-4xl font-semibold text-blue-900">
                            Format and Schedule
                        </h2>
                    </div>
                    <div className="flex flex-row w-full h-[60%] items-start justify-between">
                        <div className="flex flex-col gap-2 p-4 text-lg font-medium">
                            <span>Ruleset: {tournament.rules}</span>
                            <span>Format: {tournament.format}</span>
                            <span>
                                Bracket Style: {tournament.bracketStyle}
                            </span>
                        </div>
                        <div className="w-2/3 border h-full flex flex-col items-center justify-center bg-blue-50 rounded-lg p-4">
                            <span className="font-semibold text-blue-900 mb-2">
                                Tournament Schedule and Bracket:
                            </span>
                            <div className="text-gray-500 italic">
                                Coming soon...
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="text-black" />
                {/* Divisions, each division its own section */}
                <div className="flex flex-col w-full items-start ">
                    <div className="h-[25%] p-4 flex items-center justify-center">
                        <h2 className="text-4xl font-semibold text-blue-900">
                            Divisions
                        </h2>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
                        {tournament.registration.divisions.map((div, idx) => (
                            <div
                                key={idx}
                                className="flex-1 border border-blue-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="font-semibold text-blue-800 text-lg mb-1">
                                    {div.divisionName}
                                </div>
                                <div className="text-blue-900">
                                    {div.playersPerTeam} players/team
                                </div>
                                <div className="text-blue-900">
                                    Max {div.maxTeams} teams
                                </div>
                                <div className="text-blue-900">
                                    Fee: {div.fees}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <hr className="text-black" />
                {/* Registered Teams grouped by Division */}
                <div className="flex flex-col w-full items-start">
                    <div className="h-[25%] p-4 flex items-center justify-center">
                        <h2 className="text-4xl font-semibold text-blue-900">
                            Registered Teams
                        </h2>
                    </div>
                    <div className="w-full flex flex-col gap-6 p-4">
                        {tournament.registration.divisions.map((div, idx) => {
                            const teams =
                                tournament.registeredTeams?.[
                                    div.divisionName
                                ] || [];
                            return (
                                <div
                                    key={div.divisionName}
                                    className="w-full mb-6"
                                >
                                    <h3 className="text-blue-800 font-bold text-lg mb-2">
                                        {div.divisionName}
                                    </h3>
                                    {teams.length === 0 ? (
                                        <div className="text-gray-400 italic mb-4">
                                            No teams registered yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {teams.map((team, tIdx) => (
                                                <div
                                                    key={tIdx}
                                                    className="bg-white border border-blue-100 rounded-lg p-3 shadow-sm flex flex-col gap-1"
                                                >
                                                    <div className="font-semibold text-blue-900">
                                                        {team.teamName}
                                                    </div>
                                                    <div className="text-sm text-gray-700">
                                                        {team.players.join(
                                                            ", "
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentPage;
