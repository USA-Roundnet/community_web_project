import { useState, useRef } from "react";
import PersonalInfo from "../components/PersonalInfo";
import PersonalStats from "../components/PersonalStats";
import Memberships from "../components/Memberships";
import Teammates from "../components/Teammates";

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("account");
    const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "123-456-7890",
        city: "NYC",
        state: "NY",
        country: "USA",
        gender: "Male",
        profilePicture: "",
    };

    const userStats = {
        eventsAttended: 5,
        totalPoints: 120,
        servesAttempted: 200,
        servesSuccessful: 150,
        aces: 75,
        aced: 20,
        breaks: 30,
        broken: 15,
        errors: 10,
    };

    const teammates = [
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        events: ["NYC Roundnet Tournament", "LA Roundnet Meetup"],
    },
    {
        name: "Bob Smith",
        email: "bob.smith@example.com",
        events: ["Chicago Roundnet Championship"],
    },
    {
        name: "Charlie Lee",
        email: "charlie.lee@example.com",
        events: ["Miami Beach Roundnet Festival", "Austin Roundnet Jam"],
    },
];

    // Refs for scrolling
    const accountRef = useRef(null);
    const membershipsRef = useRef(null);
    const statsRef = useRef(null);
    const teammatesRef = useRef(null);

    // Scroll to the selected section
    const handleScrollTo = (section) => {
        setActiveTab(section);
        let ref = null;
        if (section === "account") ref = accountRef;
        else if (section === "memberships") ref = membershipsRef;
        else if (section === "stats") ref = statsRef;
        else if (section === "teammates") ref = teammatesRef;
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="h-[85vh] w-full flex flex-row items-center justify-center p-8 bg-[#f8f8f8] text-black">
            <div className="h-full w-7/8 flex flex-row">
                <div className="flex flex-col h-1/4 justify-evenly items-center w-1/4 items-start sticky top-24">
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors hover:cursor-pointer ${
                            activeTab === "account"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => handleScrollTo("account")}
                    >
                        Account
                    </button>
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors hover:cursor-pointer ${
                            activeTab === "memberships"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => handleScrollTo("memberships")}
                    >
                        Memberships
                    </button>
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors hover:cursor-pointer ${
                            activeTab === "stats"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => handleScrollTo("stats")}
                    >
                        Player Stats
                    </button>
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors hover:cursor-pointer ${
                            activeTab === "teammates"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => handleScrollTo("teammates")}
                    >
                        Teammates
                    </button>
                </div>

                <div
                    className="w-3/4 p-8 overflow-y-auto max-h-[75vh] space-y-12 hide-scrollbar"
                    style={{
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE and Edge
                    }}
                >
                    <style>
                        {`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        `}
                    </style>
                    <div ref={accountRef}>
                        <PersonalInfo user={userData} />
                    </div>
                    <div ref={membershipsRef}>
                        <Memberships />
                    </div>
                    <div ref={statsRef}>
                        <PersonalStats stats={userStats} />
                    </div>
                    <div ref={teammatesRef}>
                        <Teammates teammates={teammates} /></div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
