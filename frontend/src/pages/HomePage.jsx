import Hero from "../components/Hero";
import Grid from "../components/Grid";
import what from "/roundnet.png";
import { Link } from "react-router-dom";
import usar from "/usar-logo.png";
import spikeball from "/spikeball-logo.webp";
import { useEffect, useState } from "react";

const HomePage = () => {
    const API_BASE_URL = "http://localhost:5000";
    //dummy data for events - pull from backend in future
    let placeholderEvents = [
        {
            date: "2023-11-15",
            city: "New York",
            eventName: "NYC Roundnet Tournament",
            description:
                "Join us for a thrilling day of roundnet competition in the heart of NYC!",
            teamsRegistered: 12,
            teamLimit: 16,
            registrationStatus: "Open",
        },
        {
            date: "2023-12-01",
            city: "Los Angeles",
            eventName: "LA Roundnet Meetup",
            description:
                "Meet fellow roundnet enthusiasts and play some casual games in LA.",
            teamsRegistered: 8,
            teamLimit: 20,
            registrationStatus: "Open",
        },
        {
            date: "2023-12-10",
            city: "Chicago",
            eventName: "Chicago Roundnet Championship",
            description:
                "Compete for the title of Chicago Roundnet Champion in this exciting tournament!",
            teamsRegistered: 20,
            teamLimit: 24,
            registrationStatus: "Closed",
        },
        {
            date: "2024-01-05",
            city: "Miami",
            eventName: "Miami Beach Roundnet Festival",
            description:
                "Enjoy a weekend of sun, sand, and roundnet at Miami Beach!",
            teamsRegistered: 15,
            teamLimit: 30,
            registrationStatus: "Open",
        },
        {
            date: "2024-01-20",
            city: "Seattle",
            eventName: "Seattle Roundnet Open",
            description:
                "Join us for the Seattle Roundnet Open, where teams from all over the region compete!",
            teamsRegistered: 10,
            teamLimit: 18,
            registrationStatus: "Open",
        },
        {
            date: "2024-02-10",
            city: "Austin",
            eventName: "Austin Roundnet Jam",
            description:
                "A casual roundnet jam session in Austin, perfect for players of all levels.",
            teamsRegistered: 5,
            teamLimit: 12,
            registrationStatus: "Closing Soon",
        },
        {
            date: "2024-02-25",
            city: "Boston",
            eventName: "Boston Roundnet Challenge",
            description:
                "Test your skills in the Boston Roundnet Challenge, open to all teams!",
            teamsRegistered: 18,
            teamLimit: 20,
            registrationStatus: "Open",
        },
        {
            date: "2024-03-10",
            city: "San Francisco",
            eventName: "SF Roundnet Festival",
            description:
                "Celebrate roundnet with us at the SF Roundnet Festival, featuring games, food, and fun!",
            teamsRegistered: 22,
            teamLimit: 30,
            registrationStatus: "Open",
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
            registrationStatus: "Open",
        },
    ];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fallback data for when the API is unavailable
        const fallbackEvents = [
            {
                date: "2023-11-15",
                city: "New York",
                eventName: "NYC Roundnet Tournament",
                description:
                    "Join us for a thrilling day of roundnet competition!",
                teamsRegistered: 12,
                teamLimit: 16,
                registrationStatus: "Open",
            },
            {
                date: "2023-12-01",
                city: "Los Angeles",
                eventName: "LA Roundnet Meetup",
                description:
                    "Meet fellow roundnet enthusiasts and play some casual games.",
                teamsRegistered: 8,
                teamLimit: 20,
                registrationStatus: "Open",
            },
            {
                date: "2023-12-10",
                city: "Chicago",
                eventName: "Chicago Roundnet Championship",
                description:
                    "Compete for the title of Chicago Roundnet Champion!",
                teamsRegistered: 20,
                teamLimit: 24,
                registrationStatus: "Closed",
            },
            {
                date: "2024-01-05",
                city: "Miami",
                eventName: "Miami Beach Roundnet Festival",
                description: "Enjoy a weekend of sun, sand, and roundnet!",
                teamsRegistered: 15,
                teamLimit: 30,
                registrationStatus: "Open",
            },
            {
                date: "2024-01-20",
                city: "Seattle",
                eventName: "Seattle Roundnet Open",
                description: "Join us for the Seattle Roundnet Open!",
                teamsRegistered: 10,
                teamLimit: 18,
                registrationStatus: "Open",
            },
            {
                date: "2024-02-10",
                city: "Austin",
                eventName: "Austin Roundnet Jam",
                description: "A casual roundnet jam session in Austin.",
                teamsRegistered: 5,
                teamLimit: 12,
                registrationStatus: "Closing Soon",
            },
        ];

        const fetchEvents = async () => {
            try {
                console.log(
                    "Fetching events from:",
                    `${API_BASE_URL}/api/tournaments`
                );
                const response = await fetch(
                    `${API_BASE_URL}/api/tournaments`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        // Adding a timeout to prevent long waits
                        signal: AbortSignal.timeout(5000), // 5 second timeout
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(
                        "API response not OK:",
                        response.status,
                        errorText
                    );
                    throw new Error(
                        `Failed to fetch events: ${response.status} ${errorText}`
                    );
                }

                const data = await response.json();
                console.log("API returned data:", data);

                // Check if the API returned an empty array or error message
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn(
                        "API returned empty or invalid data, using fallback"
                    );
                    setEvents(fallbackEvents);
                    return;
                }

                // Transform data format if needed
                const formattedEvents = data.map((tournament) => ({
                    date: tournament.start_date || "TBD",
                    city: tournament.city || "TBD",
                    eventName: tournament.name || "Tournament Event",
                    description:
                        tournament.description ||
                        "Join us for this exciting tournament!",
                    teamsRegistered: tournament.teams_registered || 0,
                    teamLimit: tournament.team_limit || 20,
                    registrationStatus: tournament.status || "Open",
                    id: tournament.id,
                }));

                setEvents(formattedEvents);
            } catch (err) {
                console.error("Error fetching tournaments:", err);
                setError("Using demo data - backend connection failed");
                // Use dummy data as fallback
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-evenly text-black">
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center">
                <div className="h-[25vh] w-[80%] relative z-10 flex flex-col text-center items-center justify-evenly">
                    <h2 className="text-5xl font-bold mb-2">
                        Welcome to Rally Point!
                    </h2>
                    <p className="text-lg mb-4">
                        Connecting the roundnet community — discover events,
                        resources, and more.
                    </p>
                    <div className="w-1/3 flex flex-row items-center justify-between">
                        <Link
                            to="/about"
                            className="px-6 py-3 text-[#f8f8f8] bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-300"
                        >
                            Explore Roundnet
                        </Link>
                        <Link
                            to="/events"
                            className="px-6 py-3 text-blue-900 bg-[#f8f8f8] hover:bg-blue-900 hover:text-[#f8f8f8] border border-blue-900 rounded-md transition-colors duration-300"
                        >
                            Explore Events
                        </Link>
                    </div>
                </div>
            </section>

            <Hero />

            <section className="w-7/8 h-[70vh] mt-10 mb-10 flex flex-row items-center justify-center">
                <div className="w-full h-[55vh] flex flex-col items-start justify-between">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
                        What is Roundnet?
                    </h1>
                    <div className="flex flex-row items-center justify-between">
                        <img
                            className="w-1/2 rounded-md"
                            src={what}
                            alt="who we are"
                        />
                        <div className="w-7/16 h-[80%] flex flex-col items-start justify-between">
                            <p className="text-xl text-gray-700">
                                This sport is a thrilling combination of skill,
                                strategy, and teamwork. It offers participants a
                                chance to engage in friendly competition while
                                fostering a sense of community.
                            </p>
                            <p className="text-xl text-gray-700">
                                We are a community dedicated to promoting and
                                celebrating the sport. Our mission is to provide
                                a platform for enthusiasts to connect, learn,
                                and grow together.
                            </p>
                            <Link
                                to="/about"
                                className="hover:cursor-pointer px-6 py-3 text-[#f8f8f8] bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-300"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full flex justify-center items-center bg-white">
                <div className="w-7/8 flex flex-col items-start h-full mb-15">
                    <h1 className="text-4xl w-full mt-10 text-left font-extrabold text-blue-900 tracking-tight">
                        Upcoming Events
                    </h1>
                    <p className="text-lg w-full mb-10 text-left text-gray-700 mt-2">
                        Join us for exciting roundnet events near you!
                    </p>
                    <Grid cards={events.slice(0, 6)} />
                    <Link
                        to="/events"
                        className="mt-6 px-6 py-3 text-[#f8f8f8] bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-300"
                    >
                        View All Events
                    </Link>
                </div>
            </section>
            <section className="w-full h-[40vh] flex justify-center items-center">
                <div className="w-7/8 flex items-center h-full">
                    <h1 className="w-1/3 text-4xl font-extrabold tracking-tight">
                        Our Partners
                    </h1>
                    <div className="flex flex-row items-center justify-evenly mt-6 w-2/3">
                        <img src={usar} alt="usar logo" className="h-[10vh]" />
                        <img
                            src={spikeball}
                            alt="spikeball logo"
                            className="h-[10vh]"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
