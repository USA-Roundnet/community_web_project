import EventCard from "./EventCard";

interface CardProps {
    date: string;
    city: string;
    eventName: string;
    description: string;
    teamsRegistered: number;
    teamLimit: number;
    registrationStatus: string;
}

interface GridProps {
    cards: CardProps[];
}

const Grid = ({ cards }: GridProps) => {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <EventCard
                        date={card.date}
                        city={card.city}
                        eventName={card.eventName}
                        description={card.description}
                        teamsRegistered={card.teamsRegistered}
                        teamLimit={card.teamLimit}
                        registrationStatus={card.registrationStatus}
                        key={index}
                    />
                ))}
            </div>
        </section>
    );
};

export default Grid;
