const Teammates = ({ teammates }) => {

    return (
        <div className="p-8 mx-auto space-y-4">
            <h2 className="text-xl font-bold text-blue-900">Teammates</h2>
            {teammates.length === 0 ? (
                <p className="text-gray-500 text-center">No teammates found.</p>
            ) : (
                <ul className="space-y-4">
                    {teammates.map((teammate, idx) => (
                        <li
                            key={idx}
                            className="bg-blue-50 rounded-lg px-4 py-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        teammate.profilePicture
                                            ? teammate.profilePicture
                                            : `https://ui-avatars.com/api/?background=225975&color=fff&name=${encodeURIComponent(
                                                  teammate.name
                                              )}`
                                    }
                                    alt={teammate.name}
                                    className="w-12 h-12 rounded-full border-2 border-blue-200 shadow"
                                />
                                <div>
                                    <span className="font-semibold text-blue-900">
                                        {teammate.name}
                                    </span>
                                    <span className="block text-gray-600 text-sm">
                                        {teammate.email}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 md:mt-0 w-2/5">
                                <span className="text-gray-700 text-sm">
                                    Events:
                                </span>
                                <ul className="list-disc list-inside ml-2">
                                    {teammate.events.map((event, i) => (
                                        <li key={i} className="text-blue-700">
                                            {event}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Teammates;
