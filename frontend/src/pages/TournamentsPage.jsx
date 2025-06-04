import { useEffect, useMemo, useState } from "react";
import TabButton from "../components/TabButton";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";

const TournamentsPage = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    let tournaments = useMemo(
        () => [
            {
                id: "nyc-2025",
                eventName: "NYC Roundnet Tournament",
                description:
                    "Join us for a thrilling day of roundnet competition in the heart of NYC!",
                teamsRegistered: 12,
                teamLimit: 16,
                registrationStatus: "Open",
                date: "2025-11-15",
                time: "10:00",
                address1: "Central Park",
                address2: "East Meadow",
                city: "New York",
                state: "NY",
                zipCode: "10022",
                country: "USA",
                format: "traditional",
                bracketStyle: "single",
                rules: "Standard roundnet rules apply.",
                registration: {
                    deadline: "1week",
                    availability: "public",
                    divisionsType: "custom",
                    numDivisons: 2,
                    divisions: [
                        {
                            divisionName: "Open",
                            playersPerTeam: 2,
                            maxTeams: 16,
                        },
                        {
                            divisionName: "Intermediate",
                            playersPerTeam: 2,
                            maxTeams: 8,
                        },
                    ],
                },
            },
            {
                id: "la-2025",
                eventName: "LA Roundnet Meetup",
                description:
                    "Meet fellow roundnet enthusiasts and play some casual games in LA.",
                teamsRegistered: 8,
                teamLimit: 20,
                registrationStatus: "Open",
                date: "2025-12-01",
                time: "11:00",
                address1: "Venice Beach Courts",
                address2: "",
                city: "Los Angeles",
                state: "CA",
                zipCode: "90291",
                country: "USA",
                format: "traditional",
                bracketStyle: "double",
                rules: "House rules, double elimination.",
                registration: {
                    deadline: "2week",
                    availability: "public",
                    divisionsType: "custom",
                    numDivisons: 1,
                    divisions: [
                        {
                            divisionName: "Open",
                            playersPerTeam: 2,
                            maxTeams: 24,
                        },
                    ],
                },
            },
            {
                id: "chicago-2025",
                eventName: "Chicago Roundnet Championship",
                description:
                    "Compete for the title of Chicago Roundnet Champion in this exciting tournament!",
                teamsRegistered: 20,
                teamLimit: 24,
                registrationStatus: "Closed",
                date: "2025-12-10",
                time: "09:00",
                address1: "Grant Park",
                address2: "",
                city: "Chicago",
                state: "IL",
                zipCode: "60601",
                country: "USA",
                format: "traditional",
                bracketStyle: "single",
                rules: "Standard rules, single elimination.",
                registration: {
                    deadline: "1week",
                    availability: "public",
                    divisionsType: "custom",
                    numDivisons: 2,
                    divisions: [
                        {
                            divisionName: "Advanced",
                            playersPerTeam: 2,
                            maxTeams: 12,
                        },
                        {
                            divisionName: "Beginner",
                            playersPerTeam: 2,
                            maxTeams: 12,
                        },
                    ],
                },
            },
            {
                id: "miami-2027",
                eventName: "Miami Beach Roundnet Festival",
                description:
                    "Enjoy a weekend of sun, sand, and roundnet at Miami Beach!",
                teamsRegistered: 15,
                teamLimit: 30,
                registrationStatus: "Open",
                date: "2027-01-05",
                time: "13:00",
                address1: "Miami Beach Park",
                address2: "",
                city: "Miami",
                state: "FL",
                zipCode: "33139",
                country: "USA",
                format: "traditional",
                bracketStyle: "single",
                rules: "Festival format, pool play then bracket.",
                registration: {
                    deadline: "2week",
                    availability: "public",
                    divisionsType: "custom",
                    numDivisons: 3,
                    divisions: [
                        {
                            divisionName: "Open",
                            playersPerTeam: 2,
                            maxTeams: 20,
                        },
                        {
                            divisionName: "Recreational",
                            playersPerTeam: 2,
                            maxTeams: 16,
                        },
                        {
                            divisionName: "Youth",
                            playersPerTeam: 2,
                            maxTeams: 8,
                        },
                    ],
                },
            },
            {
                id: "austin-2025",
                eventName: "Austin Roundnet Jam",
                description:
                    "A casual roundnet jam session in Austin, perfect for players of all levels.",
                teamsRegistered: 10,
                teamLimit: 18,
                registrationStatus: "Open",
                date: "2025-02-10",
                time: "15:00",
                address1: "Zilker Park",
                address2: "",
                city: "Austin",
                state: "TX",
                zipCode: "78704",
                country: "USA",
                format: "traditional",
                bracketStyle: "single",
                rules: "Jam session, round robin.",
                registration: {
                    deadline: "1week",
                    availability: "public",
                    divisionsType: "custom",
                    numDivisons: 1,
                    divisions: [
                        {
                            divisionName: "All Levels",
                            playersPerTeam: 2,
                            maxTeams: 16,
                        },
                    ],
                },
            },
        ],
        []
    );

    // You can use this array in your TournamentsPage, for example:
    const [events, setEvents] = useState(tournaments);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate("/events/create/", { replace: true });
        } catch (err) {
            console.error("Error creating tournament:", err);
            setError("Cannot Create Tournament. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = events;

        if (searchQuery) {
            filtered = filtered.filter(
                (event) =>
                    event.eventName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    event.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        let today = new Date();
        if (activeTab === "upcoming") {
            filtered = filtered.filter((event) => new Date(event.date) > today);
        } else if (activeTab === "past") {
            filtered = filtered.filter(
                (event) => new Date(event.date) <= today
            );
        }

        setFilteredEvents(filtered);
    }, [searchQuery, activeTab, events]);

    return (
        <div className="w-full bg-[#f8f8f8] text-black flex items-center justify-center">
            <div className="min-h-screen w-7/8">
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-2xl font-bold mb-6">
                            Discover Events
                        </h1>
                        <button
                            onClick={handleCreate}
                            className="px-3 py-2 text-blue-900 bg-[#f8f8f8] hover:bg-blue-900 hover:text-[#f8f8f8] hover:cursor-pointer border-blue-900 rounded-md transition-colors duration-300"
                        >
                            Create a Tournament
                        </button>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <TabButton
                                active={activeTab === "upcoming"}
                                onClick={() => setActiveTab("upcoming")}
                            >
                                Upcoming
                            </TabButton>
                            <TabButton
                                active={activeTab === "past"}
                                onClick={() => setActiveTab("past")}
                            >
                                Past
                            </TabButton>
                            <TabButton
                                active={activeTab === "all"}
                                onClick={() => setActiveTab("all")}
                            >
                                All
                            </TabButton>
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="px-4 py-2 border rounded-lg w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentsPage;
