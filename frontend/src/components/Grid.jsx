import EventCard from "./EventCard";
import PropTypes from 'prop-types';

const Grid = ({ cards }) => {
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

Grid.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        eventName: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        teamsRegistered: PropTypes.number.isRequired,
        teamLimit: PropTypes.number.isRequired,
        registrationStatus: PropTypes.string.isRequired,
    })).isRequired
};


export default Grid;
