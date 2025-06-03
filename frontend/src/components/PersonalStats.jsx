const PersonalStats = ({ stats }) => {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold">Personal Statistics</h2>
            <ul className="flex flex-col space-y-4 mt-4">
                <li>
                    <span className="font-bold">Events Attended: </span>
                    <span className="text-blue-900">{stats.eventsAttended}</span>
                </li>
                <li>
                    <span className="font-semibold">Total Points: </span>
                    <span className="text-blue-900">{stats.totalPoints}</span>
                </li>
                <li>
                    <span className="font-semibold">Serving Percentage: </span>
                    <span className="text-blue-900">{stats.servesSuccessful} / {stats.servesAttempted} ({stats.servesSuccessful / stats.servesAttempted * 100}%)</span>
                </li>
                <li>
                    <span className="font-semibold">Aces : Aced </span>
                    <span className="text-blue-900">{stats.aces} : {stats.aced}</span>
                </li>
                <li>
                    <span className="font-semibold">Breaks : Broken </span>
                    <span className="text-blue-900">{stats.breaks} : {stats.broken}</span>
                </li>
                <li>
                    <span className="font-semibold">Errors: </span>
                    <span className="text-blue-900">{stats.errors}</span>
                </li>
            </ul>
        </div>
    );
};

export default PersonalStats;