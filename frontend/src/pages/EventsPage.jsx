import { useState } from "react";
import EventCard from "../components/EventCard";
import TabButton from "../components/TabButton";

const EventsPage = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");

    const mockEvents = [
        {
            date: "03/11/25",
            city: "Chicago",
            eventName: "Spring Tournament",
            description: "Tournament description",
            teamsRegistered: 10,
            teamLimit: 24,
            registrationStatus: "open",
        },
        {
            date: "03/06/25",
            city: "Houston",
            eventName: "Texas Championship",
            description: "Tournament description",
            teamsRegistered: 13,
            teamLimit: 24,
            registrationStatus: "open",
        },
    ];

    const filterEvents = () => {
        let filtered = mockEvents;

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
            filtered = filtered.filter(
                (event) => new Date(event.date) > new Date()
            );
        } else if (activeTab === "past") {
            filtered = filtered.filter(
                (event) => new Date(event.date) <= new Date()
            );
        }

        return filtered;
    };

    return (
        <div className="min-h-screen w-screen bg-gray-100">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold mb-6">Discover Events</h1>

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

                <div className="space-y-4">
                    {filterEvents().map((event, index) => (
                        <EventCard key={index} {...event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsPage;
