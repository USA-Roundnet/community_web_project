import React from "react";

const EventCard = ({
    date,
    city,
    eventName,
    description,
    teamsRegistered,
    teamLimit,
    registrationStatus,
}) => {
    const getRegistrationText = () => {
        switch (registrationStatus) {
            case "open":
                return "Registration Open";
            case "closing":
                return "Registration Closes Soon";
            case "closed":
                return "Registration Closed";
            default:
                return "";
        }
    };

    const getRegistrationColor = () => {
        switch (registrationStatus) {
            case "open":
                return "text-green-500";
            case "closing":
                return "text-yellow-500";
            case "closed":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="flex items-center w-full h-[20vh] bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg" />
                </div>

                <div className="flex-1 min-w-0 px-6">
                    <div className="text-gray-500 text-sm">{date}</div>
                    <h3 className="text-xl font-semibold mt-1 ">{eventName}</h3>
                    <div className="text-gray-600 text-sm mt-1">{city}</div>
                    {/*<p className="text-gray-600">{description}</p>*/}
                    <div className="text-left flex-shrink-0 ">
                        <div className="text-sm text-gray-500">
                            Teams: {teamsRegistered}/{teamLimit}
                        </div>
                        <div
                            className={`${getRegistrationColor()} text-sm font-medium`}
                        >
                            {getRegistrationText()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
