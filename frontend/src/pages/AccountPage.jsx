import UpcomingEvents from "../components/UpcomingEvents";
import PersonalInfo from "../components/PersonalInfo";
import PersonalStats from "../components/PersonalStats";

const AccountPage = () => {
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
        defensiveTouches: 75,
        putAways: 30,
        hittingErrors: 10,
    };

    return (
        <div className="h-full flex flex-col items-center p-8 bg-[#f8f8f8] text-black">
            <h1 className="text-3xl font-bold mb-4">Account Overview</h1>
            <UpcomingEvents />
            <PersonalInfo user={userData} />
            <PersonalStats stats={userStats} />
            
        </div>
    );
};

export default AccountPage;