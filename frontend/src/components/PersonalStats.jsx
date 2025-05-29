const PersonalStats = ({ stats }) => {
    return (
        <div className="personal-stats">
            <h2>Personal Statistics</h2>
            <ul className="stats-list">
                <li className="stat-item">
                    <span className="stat-label">Events Attended: </span>
                    <span className="stat-value">{stats.eventsAttended}</span>
                </li>
                <li className="stat-item">
                    <span className="stat-label">Total Points: </span>
                    <span className="stat-value">{stats.totalPoints}</span>
                </li>
                <li className="stat-item">
                    <span className="stat-label">Serves Attempted: </span>
                    <span className="stat-value">{stats.servesAttempted}</span>
                </li>
                <li className="stat-item">
                    <span className="stat-label">Serves Successful: </span>
                    <span className="stat-value">{stats.servesSuccessful}</span>
                </li>
                <li className="stat-item">
                    <span className="stat-label">Defensive Touches: </span>
                    <span className="stat-value">{stats.defensiveTouches}</span>
                </li>
                <li className="stat-item">
                    <span className="stat-label">Put Aways: </span>
                    <span className="stat-value">{stats.putAways}</span>
                </li>
                <li className="stat-item">
                    <span className="stat-label">Hitting Errors: </span>
                    <span className="stat-value">{stats.hittingErrors}</span>
                </li>
            </ul>
        </div>
    );
};

export default PersonalStats;