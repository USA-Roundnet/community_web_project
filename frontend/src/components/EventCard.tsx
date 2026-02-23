import { useNavigate } from "react-router-dom";

interface EventCardProps {
    date: string;
    city: string;
    eventName: string;
    description: string;
    teamsRegistered: number;
    teamLimit: number;
    registrationStatus: string;
    id?: number;
    image?: string;
}

const getRegistrationText = (registrationStatus: string) => {
    switch (registrationStatus?.toLowerCase()) {
        case "upcoming":
            return "Status: Upcoming";
        case "in_progress":
            return "Status: In Progress";
        case "completed":
            return "Status: Completed";
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

const getRegistrationColor = (registrationStatus: string) => {
    switch (registrationStatus?.toLowerCase()) {
        case "upcoming":
            return "text-blue-600";
        case "in_progress":
            return "text-green-600";
        case "completed":
            return "text-gray-600";
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

const EventCard = (event: EventCardProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/events/${event.id}`, {
            state: { event },
        });
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
                        className="h-full w-auto transform -rotate-90 max-w-none"
                    />
                </div>
            </div>
            <div className="flex-1 min-w-0 px-4 sm:px-6 flex flex-col justify-center">
                <div className="text-gray-500 text-sm">{event.date}</div>
                <h3 className="text-lg sm:text-xl font-semibold mt-1 truncate">{event.eventName}</h3>
                <div className="text-gray-600 text-sm mt-1 truncate">{event.city}</div>
                <div className="text-left flex-shrink-0">

                    <div className="text-sm text-gray-500">
                        {event.teamLimit ? `Teams: ${event.teamsRegistered}/${event.teamLimit}` : `Teams: ${event.teamsRegistered}`}
                    </div>
                    <div
                        className={`${getRegistrationColor(event.registrationStatus)} text-sm font-medium`}
                    >
                        {getRegistrationText(event.registrationStatus)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
