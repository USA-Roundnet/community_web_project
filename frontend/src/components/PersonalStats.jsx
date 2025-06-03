import vite from "/vite.svg";

const PersonalStats = ({ stats }) => {
    const servingPercentage =
        stats.servesAttempted > 0
            ? ((stats.servesSuccessful / stats.servesAttempted) * 100).toFixed(
                  1
              )
            : "0";
    //insert data later
    let time = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return (
        <div className="p-8 mx-auto space-y-4">
            <h2 className="text-xl font-bold text-blue-900">Stats</h2>

            <ul className="grid grid-cols-2 gap-8">
                <li className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow transition-transform hover:scale-105">
                    <span className="font-semibold text-gray-600 mb-1">
                        Events Attended
                    </span>
                    <span className="text-blue-900 text-3xl font-bold">
                        {stats.eventsAttended}
                    </span>
                </li>
                <li className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow transition-transform hover:scale-105">
                    <span className="font-semibold text-gray-600 mb-1">
                        Total Points
                    </span>
                    <span className="text-blue-900 text-3xl font-bold">
                        {stats.totalPoints}
                    </span>
                </li>
                <li className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow transition-transform hover:scale-105">
                    <span className="font-semibold text-gray-600 mb-1">
                        Serving %
                    </span>
                    <span className="text-blue-900 text-3xl font-bold">
                        {stats.servesSuccessful} / {stats.servesAttempted}
                        <br />
                        <span className="text-base font-medium text-blue-700">
                            ({servingPercentage}%)
                        </span>
                    </span>
                </li>
                <li className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow transition-transform hover:scale-105">
                    <span className="font-semibold text-gray-600 mb-1">
                        Aces : Aced
                    </span>
                    <span className="text-blue-900 text-3xl font-bold">
                        {stats.aces} : {stats.aced}
                    </span>
                </li>
                <li className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow transition-transform hover:scale-105">
                    <span className="font-semibold text-gray-600 mb-1">
                        Breaks : Broken
                    </span>
                    <span className="text-blue-900 text-3xl font-bold">
                        {stats.breaks} : {stats.broken}
                    </span>
                </li>
                <li className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow transition-transform hover:scale-105">
                    <span className="font-semibold text-gray-600 mb-1">
                        Errors
                    </span>
                    <span className="text-blue-900 text-3xl font-bold">
                        {stats.errors}
                    </span>
                </li>
            </ul>
            <p className="mt-10">Last Updated: {time}</p>
        </div>
    );
};

export default PersonalStats;
