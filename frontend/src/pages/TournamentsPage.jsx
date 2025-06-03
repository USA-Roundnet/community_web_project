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

    let events = useMemo(
        () => [
            {
                date: "2025-11-15",
                city: "New York",
                eventName: "NYC Roundnet Tournament",
                description:
                    "Join us for a thrilling day of roundnet competition in the heart of NYC!",
                teamsRegistered: 12,
                teamLimit: 16,
                registrationStatus: "Open",
            },
            {
                date: "2025-12-01",
                city: "Los Angeles",
                eventName: "LA Roundnet Meetup",
                description:
                    "Meet fellow roundnet enthusiasts and play some casual games in LA.",
                teamsRegistered: 8,
                teamLimit: 20,
                registrationStatus: "Open",
            },
            {
                date: "2025-12-10",
                city: "Chicago",
                eventName: "Chicago Roundnet Championship",
                description:
                    "Compete for the title of Chicago Roundnet Champion in this exciting tournament!",
                teamsRegistered: 20,
                teamLimit: 24,
                registrationStatus: "Closed",
            },
            {
                date: "2027-01-05",
                city: "Miami",
                eventName: "Miami Beach Roundnet Festival",
                description:
                    "Enjoy a weekend of sun, sand, and roundnet at Miami Beach!",
                teamsRegistered: 15,
                teamLimit: 30,
                registrationStatus: "Open",
            },
            {
                date: "2021-01-20",
                city: "Seattle",
                eventName: "Seattle Roundnet Open",
                description:
                    "Join us for the Seattle Roundnet Open, where teams from all over the region compete!",
                teamsRegistered: 10,
                teamLimit: 18,
                registrationStatus: "Open",
            },
            {
                date: "2025-02-10",
                city: "Austin",
                eventName: "Austin Roundnet Jam",
                description:
                    "A casual roundnet jam session in Austin, perfect for players of all levels.",
                teamsRegistered: 5,
                teamLimit: 12,
                registrationStatus: "Closing Soon",
            },
            {
                date: "2027-02-25",
                city: "Boston",
                eventName: "Boston Roundnet Challenge",
                description:
                    "Test your skills in the Boston Roundnet Challenge, open to all teams!",
                teamsRegistered: 18,
                teamLimit: 20,
                registrationStatus: "Open",
            },
            {
                date: "2029-03-10",
                city: "San Francisco",
                eventName: "SF Roundnet Festival",
                description:
                    "Celebrate roundnet with us at the SF Roundnet Festival, featuring games, food, and fun!",
                teamsRegistered: 22,
                teamLimit: 30,
                registrationStatus: "Closed",
            },
            {
                date: "2024-03-25",
                city: "Denver",
                eventName: "Denver Roundnet Showdown",
                description:
                    "Compete in the Denver Roundnet Showdown, where the best teams battle it out!",
                teamsRegistered: 14,
                teamLimit: 16,
                registrationStatus: "Open",
            },
            {
                date: "2024-04-05",
                city: "Phoenix",
                eventName: "Phoenix Roundnet Clash",
                description:
                    "Join us for the Phoenix Roundnet Clash, a day of intense competition and camaraderie.",
                teamsRegistered: 9,
                teamLimit: 15,
                registrationStatus: "Open",
            },
            {
                date: "2024-04-20",
                city: "Orlando",
                eventName: "Orlando Roundnet Extravaganza",
                description:
                    "Experience the Orlando Roundnet Extravaganza, featuring games, prizes, and more!",
                teamsRegistered: 11,
                teamLimit: 20,
                registrationStatus: "Open",
            },
            {
                date: "2024-05-01",
                city: "Philadelphia",
                eventName: "Philly Roundnet Fest",
                description:
                    "Join us for the Philly Roundnet Fest, a celebration of roundnet with games and community.",
                teamsRegistered: 16,
                teamLimit: 24,
                registrationStatus: "Closed",
            },
        ],
        []
    );

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
                        {filteredEvents.map((event, index) => (
                            <EventCard key={index} {...event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentsPage;
