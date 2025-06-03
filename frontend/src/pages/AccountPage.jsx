import UpcomingEvents from "../components/UpcomingEvents";
import PersonalInfo from "../components/PersonalInfo";
import PersonalStats from "../components/PersonalStats";
import { useState } from "react";

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

    return (
        <div className="h-[85vh] w-full flex flex-row items-center justify-center p-8 bg-[#f8f8f8] text-black">
            <div className="h-full w-7/8 full flex flex-row">
                <div className="flex flex-col h-1/4 justify-evenly items-center w-1/4 items-start">
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors  ${
                            activeTab === "account"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => setActiveTab("account")}
                    >
                        Account
                    </button>
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors ${
                            activeTab === "memberships"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => setActiveTab("memberships")}
                    >
                        Memberships
                    </button>
                    <button
                        className={`px-4 py-2 text-xl rounded transition-colors ${
                            activeTab === "stats"
                                ? "text-blue-900 font-bold"
                                : "hover:text-blue-900"
                        }`}
                        onClick={() => setActiveTab("stats")}
                    >
                        Player Stats
                    </button>
                </div>

                <div className="w-3/4 p-8">
                    <UpcomingEvents />

                    {activeTab === "account" && (
                        <PersonalInfo user={userData} />
                    )}
                    {activeTab === "memberships" && <Memberships />}
                    {activeTab === "stats" && (
                        <PersonalStats stats={userStats} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
