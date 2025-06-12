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
                ownerId: "12345",
                id: "nyc-2025",
                image: "https://thvnext.bing.com/th/id/OIP._6cjKRohOQvb9D9VAcVw4AHaFj?cb=thvnext&rs=1&pid=ImgDetMain",
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
                    deadline: "1 week",
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
                        { teamName: "NY Smashers", players: ["Alice Smith", "Bob Johnson"] },
                        { teamName: "Spike Kings", players: ["Charlie Lee", "David Kim"] },
                        { teamName: "Roundnet Rebels", players: ["Eve Chen", "Frank Miller"] },
                        { teamName: "Empire Spikers", players: ["Grace Park", "Heidi Patel"] },
                        { teamName: "Central Park Pros", players: ["Ivan Brown", "Judy Wilson"] },
                        { teamName: "Bronze Ballers", players: ["Kyle Davis", "Liam Martinez"] },
                    ],
                    "4.5 Women's": [
                        { teamName: "NY Queens", players: ["Mia Clark", "Nina Lopez"] },
                        { teamName: "Lady Smash", players: ["Olivia Moore", "Paula Nguyen"] },
                        { teamName: "Spike Sisters", players: ["Quinn Adams", "Rita Evans"] },
                        { teamName: "Empire Women", players: ["Sophie Wright", "Tina Scott"] },
                        { teamName: "Central Park Chicks", players: ["Uma Rivera", "Vera Murphy"] },
                        { teamName: "Bronze Babes", players: ["Wendy Hall", "Xena Young"] },
                    ],
                    "4.0 Open": [
                        { teamName: "Open Smashers", players: ["Yara King", "Zane Perez"] },
                        { teamName: "Open Kings", players: ["Amy Stewart", "Ben Turner"] },
                        { teamName: "Open Rebels", players: ["Carl Morgan", "Dana Reed"] },
                        { teamName: "Open Pros", players: ["Eli Bailey", "Fay Cooper"] },
                        { teamName: "Open Ballers", players: ["Gus Bell", "Holly Foster"] },
                        { teamName: "Open Legends", players: ["Ivy Brooks", "Jack Sanders"] },
                    ],
                    "2.0-3.0 Intermediate": [
                        { teamName: "Inter Smashers", players: ["Kara Price", "Leo Simmons"] },
                        { teamName: "Inter Kings", players: ["Mona Ross", "Ned Butler"] },
                        { teamName: "Inter Rebels", players: ["Omar Ward", "Pam Bryant"] },
                        { teamName: "Inter Pros", players: ["Quincy Barnes", "Rae Powell"] },
                        { teamName: "Inter Ballers", players: ["Sam Hayes", "Tara Jenkins"] },
                        { teamName: "Inter Legends", players: ["Uma Perry", "Vic Russell"] },
                    ],
                },
            },
            {
                ownerId: "12345",
                id: "la-2025",
                image: "https://thvnext.bing.com/th/id/OIP._6cjKRohOQvb9D9VAcVw4AHaFj?cb=thvnext&rs=1&pid=ImgDetMain",
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
                        { teamName: "LA Smashers", players: ["Aaron Green", "Bella White"] },
                        { teamName: "Venice Vipers", players: ["Cody Black", "Dina Blue"] },
                        { teamName: "Beach Ballers", players: ["Eli Gold", "Faye Silver"] },
                        { teamName: "Sunset Spikers", players: ["Gina Brown", "Hank Wilson"] },
                        { teamName: "West Coast Warriors", players: ["Iris Young", "Jake King"] },
                        { teamName: "Bronze Surfers", players: ["Kurt Lee", "Lila Kim"] },
                    ],
                    "4.5 Women's": [
                        { teamName: "LA Queens", players: ["Mona Green", "Nina White"] },
                        { teamName: "Lady Spikers", players: ["Olga Black", "Pia Blue"] },
                        { teamName: "Venice Waves", players: ["Quinn Adams", "Rae Evans"] },
                        { teamName: "Beach Babes", players: ["Sara Wright", "Tina Scott"] },
                        { teamName: "Sunset Sisters", players: ["Uma Rivera", "Vera Murphy"] },
                        { teamName: "Bronze Beauties", players: ["Willa Hall", "Xena Young"] },
                    ],
                    "4.0 Open": [
                        { teamName: "Open Surfers", players: ["Yuri King", "Zane Perez"] },
                        { teamName: "Open Kings", players: ["Ava Stewart", "Ben Turner"] },
                        { teamName: "Open Rebels", players: ["Cara Morgan", "Duke Reed"] },
                        { teamName: "Open Pros", players: ["Evan Bailey", "Fay Cooper"] },
                        { teamName: "Open Ballers", players: ["Gus Bell", "Holly Foster"] },
                        { teamName: "Open Legends", players: ["Ivy Brooks", "Jack Sanders"] },
                    ],
                    "2.0-3.0 Intermediate": [
                        { teamName: "Inter Surfers", players: ["Kara Price", "Leo Simmons"] },
                        { teamName: "Inter Kings", players: ["Mona Ross", "Ned Butler"] },
                        { teamName: "Inter Rebels", players: ["Omar Ward", "Pam Bryant"] },
                        { teamName: "Inter Pros", players: ["Quincy Barnes", "Rae Powell"] },
                        { teamName: "Inter Ballers", players: ["Sam Hayes", "Tara Jenkins"] },
                        { teamName: "Inter Legends", players: ["Uma Perry", "Vic Russell"] },
                    ],
                },
            },
            {
                ownerId: "12345",
                id: "chicago-2025",
                image: "https://thvnext.bing.com/th/id/OIP._6cjKRohOQvb9D9VAcVw4AHaFj?cb=thvnext&rs=1&pid=ImgDetMain",
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
                        { teamName: "Chicago Smashers", players: ["Adam Scott", "Beth Lee"] },
                        { teamName: "Windy City Warriors", players: ["Carl Kim", "Dora Park"] },
                        { teamName: "Lakefront Legends", players: ["Eli Brown", "Fay Wilson"] },
                        { teamName: "Grant Park Pros", players: ["Gina White", "Hank Green"] },
                        { teamName: "Bronze Ballers", players: ["Ivy Young", "Jack King"] },
                        { teamName: "Chi-Town Champs", players: ["Kurt Lee", "Lila Kim"] },
                    ],
                    "4.5 Women's": [
                        { teamName: "Chicago Queens", players: ["Mona Scott", "Nina Lee"] },
                        { teamName: "Lady Smashers", players: ["Olga Kim", "Pia Park"] },
                        { teamName: "Windy Women", players: ["Quinn Brown", "Rae Wilson"] },
                        { teamName: "Lakefront Ladies", players: ["Sara White", "Tina Green"] },
                        { teamName: "Bronze Beauties", players: ["Uma Young", "Vera King"] },
                        { teamName: "Chi-Town Chicks", players: ["Willa Lee", "Xena Kim"] },
                    ],
                    "4.0 Open": [
                        { teamName: "Open Smashers", players: ["Yuri King", "Zane Perez"] },
                        { teamName: "Open Kings", players: ["Amy Stewart", "Ben Turner"] },
                        { teamName: "Open Rebels", players: ["Cara Morgan", "Duke Reed"] },
                        { teamName: "Open Pros", players: ["Evan Bailey", "Fay Cooper"] },
                        { teamName: "Open Ballers", players: ["Gus Bell", "Holly Foster"] },
                        { teamName: "Open Legends", players: ["Ivy Brooks", "Jack Sanders"] },
                    ],
                    "2.0-3.0 Intermediate": [
                        { teamName: "Inter Smashers", players: ["Kara Price", "Leo Simmons"] },
                        { teamName: "Inter Kings", players: ["Mona Ross", "Ned Butler"] },
                        { teamName: "Inter Rebels", players: ["Omar Ward", "Pam Bryant"] },
                        { teamName: "Inter Pros", players: ["Quincy Barnes", "Rae Powell"] },
                        { teamName: "Inter Ballers", players: ["Sam Hayes", "Tara Jenkins"] },
                        { teamName: "Inter Legends", players: ["Uma Perry", "Vic Russell"] },
                    ],
                },
            },
            {
                ownerId: "12345",
                id: "miami-2027",
                image: "https://thvnext.bing.com/th/id/OIP._6cjKRohOQvb9D9VAcVw4AHaFj?cb=thvnext&rs=1&pid=ImgDetMain",
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
                        { teamName: "Miami Smashers", players: ["Aaron Green", "Bella White"] },
                        { teamName: "Spike Beach", players: ["Cathy Black", "Daniel Blue"] },
                        { teamName: "Roundnet Dolphins", players: ["Eva Gold", "Frank Silver"] },
                        { teamName: "Miami Spikers", players: ["Gina Brown", "Henry Wilson"] },
                        { teamName: "Beach Pros", players: ["Ivy Young", "Jake King"] },
                        { teamName: "Bronze Sharks", players: ["Kyle Lee", "Laura Kim"] },
                    ],
                    "4.5 Women's": [
                        { teamName: "Miami Queens", players: ["Mia Green", "Nina White"] },
                        { teamName: "Lady Waves", players: ["Olivia Black", "Paula Blue"] },
                        { teamName: "Spike Mermaids", players: ["Quinn Adams", "Rita Evans"] },
                        { teamName: "Miami Women", players: ["Sophie Wright", "Tina Scott"] },
                        { teamName: "Beach Chicks", players: ["Uma Rivera", "Vera Murphy"] },
                        { teamName: "Bronze Sirens", players: ["Wendy Hall", "Xena Young"] },
                    ],
                    "4.0 Open": [
                        { teamName: "Open Smashers", players: ["Yara King", "Zane Perez"] },
                        { teamName: "Open Kings", players: ["Amy Stewart", "Ben Turner"] },
                        { teamName: "Open Rebels", players: ["Carl Morgan", "Dana Reed"] },
                        { teamName: "Open Pros", players: ["Eli Bailey", "Fay Cooper"] },
                        { teamName: "Open Ballers", players: ["Gus Bell", "Holly Foster"] },
                        { teamName: "Open Legends", players: ["Ivy Brooks", "Jack Sanders"] },
                    ],
                    "2.0-3.0 Intermediate": [
                        { teamName: "Inter Smashers", players: ["Kara Price", "Leo Simmons"] },
                        { teamName: "Inter Kings", players: ["Mona Ross", "Ned Butler"] },
                        { teamName: "Inter Rebels", players: ["Omar Ward", "Pam Bryant"] },
                        { teamName: "Inter Pros", players: ["Quincy Barnes", "Rae Powell"] },
                        { teamName: "Inter Ballers", players: ["Sam Hayes", "Tara Jenkins"] },
                        { teamName: "Inter Legends", players: ["Uma Perry", "Vic Russell"] },
                    ],
                },
            },
            {
                ownerId: "12345",
                id: "austin-2025",
                image: "https://thvnext.bing.com/th/id/OIP._6cjKRohOQvb9D9VAcVw4AHaFj?cb=thvnext&rs=1&pid=ImgDetMain",
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
                        { teamName: "Austin Smashers", players: ["Aaron Green", "Bella White"] },
                        { teamName: "Spike Horns", players: ["Cathy Black", "Daniel Blue"] },
                        { teamName: "Roundnet Rangers", players: ["Eva Gold", "Frank Silver"] },
                        { teamName: "Lone Star Spikers", players: ["Gina Brown", "Henry Wilson"] },
                        { teamName: "Zilker Pros", players: ["Ivy Young", "Jake King"] },
                        { teamName: "Bronze Stallions", players: ["Kyle Lee", "Laura Kim"] },
                    ],
                    "4.5 Women's": [
                        { teamName: "Austin Queens", players: ["Mia Green", "Nina White"] },
                        { teamName: "Lady Longhorns", players: ["Olivia Black", "Paula Blue"] },
                        { teamName: "Spike Dames", players: ["Quinn Adams", "Rita Evans"] },
                        { teamName: "Lone Star Women", players: ["Sophie Wright", "Tina Scott"] },
                        { teamName: "Zilker Chicks", players: ["Uma Rivera", "Vera Murphy"] },
                        { teamName: "Bronze Angels", players: ["Wendy Hall", "Xena Young"] },
                    ],
                    "4.0 Open": [
                        { teamName: "Open Smashers", players: ["Yara King", "Zane Perez"] },
                        { teamName: "Open Kings", players: ["Amy Stewart", "Ben Turner"] },
                        { teamName: "Open Rebels", players: ["Carl Morgan", "Dana Reed"] },
                        { teamName: "Open Pros", players: ["Eli Bailey", "Fay Cooper"] },
                        { teamName: "Open Ballers", players: ["Gus Bell", "Holly Foster"] },
                        { teamName: "Open Legends", players: ["Ivy Brooks", "Jack Sanders"] },
                    ],
                    "2.0-3.0 Intermediate": [
                        { teamName: "Inter Smashers", players: ["Kara Price", "Leo Simmons"] },
                        { teamName: "Inter Kings", players: ["Mona Ross", "Ned Butler"] },
                        { teamName: "Inter Rebels", players: ["Omar Ward", "Pam Bryant"] },
                        { teamName: "Inter Pros", players: ["Quincy Barnes", "Rae Powell"] },
                        { teamName: "Inter Ballers", players: ["Sam Hayes", "Tara Jenkins"] },
                        { teamName: "Inter Legends", players: ["Uma Perry", "Vic Russell"] },
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
                <div className="mx-auto px-6 py-8">
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
