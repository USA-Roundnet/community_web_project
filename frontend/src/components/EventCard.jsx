import { useNavigate } from "react-router-dom";

const EventCard = (event) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/events/${event.id}`, {
            state: { event },
        });
    };

    const getRegistrationText = () => {
        switch (event.registrationStatus?.toLowerCase()) {
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
        switch (event.registrationStatus?.toLowerCase()) {
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
        <div
            className="flex items-stretch w-full h-[20vh] bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer"
            onClick={handleClick}
        >
            <div className="relative h-full w-20 bg-gray-100 rounded-l-lg overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={event.image || "/default-event-image.jpg"}
                        alt={event.eventName}
                        className="h-full w-auto transform -rotate-90"
                        style={{ maxWidth: 'none' }}
                    />
                </div>
            </div>


            <div className="flex-1 min-w-0 px-6 flex flex-col justify-center">
                <div className="text-gray-500 text-sm">{event.date}</div>
                <h3 className="text-xl font-semibold mt-1 ">{event.eventName}</h3>
                <div className="text-gray-600 text-sm mt-1">{event.city}</div>
                {/*<p className="text-gray-600">{event.description}</p>*/}
                <div className="text-left flex-shrink-0 ">
                    <div className="text-sm text-gray-500">
                        Teams: {event.teamsRegistered}/{event.teamLimit}
                    </div>
                    <div
                        className={`${getRegistrationColor()} text-sm font-medium`}
                    >
                        {getRegistrationText()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
