import { useEffect, useState } from "react";
import TabButton from "../components/TabButton";
import { useLocation, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { placeholderEvents } from "../utils/placeholderEvents";
import { API_BASE_URL } from "../config";

const toSafeDate = (dateValue: string | undefined) => {
    if (!dateValue) {
        return null;
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
};

const getEventPhase = (event: any) => {
    const normalizedStatus = (event.registrationStatus || "").toLowerCase();
    if (
        normalizedStatus === "upcoming" ||
        normalizedStatus === "open" ||
        normalizedStatus === "closing"
    ) {
        return "upcoming";
    }
    if (normalizedStatus === "in_progress") {
        return "in_progress";
    }
    if (normalizedStatus === "completed" || normalizedStatus === "closed") {
        return "completed";
    }

    const now = new Date();
    const startDate = toSafeDate(event.date);
    const endDate = toSafeDate(event.endDate || event.date);

    if (!startDate || !endDate) {
        return "upcoming";
    }

    if (now < startDate) {
        return "upcoming";
    }

    if (now > endDate) {
        return "completed";
    }

    return "in_progress";
};

const TournamentsPage = () => {

    const [activeTab, setActiveTab] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please log in to create a tournament.");
            navigate("/login", {
                replace: true,
                state: { from: "/events/create/" },
            });
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            navigate("/events/create/", { replace: true });
        } catch {
            setError("Cannot Create Tournament. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/tournaments`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                        `Failed to fetch events: ${response.status} ${errorText}`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data) || data.length === 0) {
                    console.warn(
                        "API returned empty or invalid data, using fallback"
                    );
                    setEvents(placeholderEvents);
                    return;
                }

                const formattedEvents = data.map((tournament) => ({
                    date: tournament.start_date || "TBD",
                    endDate: tournament.end_date || tournament.start_date || "TBD",
                    city: tournament.city || "TBD",
                    eventName: tournament.name || "Tournament Event",
                    description:
                        tournament.description ||
                        "Join us for this exciting tournament!",
                    teamsRegistered: tournament.teams_registered || 0,
                    teamLimit: tournament.max_teams || tournament.team_limit || 20,
                    registrationStatus: tournament.status || "upcoming",
                    id: tournament.id,
                }));

                setEvents(formattedEvents);
            } catch {
                setError("Using demo data - backend connection failed");
                setEvents(placeholderEvents);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
        if (activeTab === "upcoming") {
            filtered = filtered.filter((event) => {
                const phase = getEventPhase(event);
                return phase === "upcoming" || phase === "in_progress";
            });
        } else if (activeTab === "past") {
            filtered = filtered.filter((event) => getEventPhase(event) === "completed");
        }

        setFilteredEvents(filtered);
    }, [searchQuery, activeTab, events]);

    return (
        <div className="w-full bg-[#f8f8f8] text-black flex items-center justify-center">
            <div className="min-h-screen w-7/8">
                <div className="mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
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
                    {location.state?.message ? (
                        <div className="mb-4 rounded-md border border-green-300 bg-green-50 text-green-800 px-3 py-2 text-sm">
                            {location.state.message}
                        </div>
                    ) : null}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="flex space-x-4 mb-4 md:mb-0">
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
