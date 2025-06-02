import EventCard from "./EventCard";

const Grid = ({ cards }) => {
    return (
        <section className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
