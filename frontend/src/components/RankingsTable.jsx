import { useState } from "react";

function RankingsTable({ title, players }) {
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const totalPages = Math.ceil(players.length / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, players.length);
    const currentPlayers = players.slice(startIdx, endIdx);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    return (
        <div className="flex-1 min-w-[340px] max-w-4/9 p-6 flex flex-col gap-4 mx-2 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
                {title}
            </h2>
            <div className="overflow-x-auto w-full">
                <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow">
                    <thead>
                        <tr className="bg-blue-100 text-blue-900 text-lg border-b">
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Player</th>
                            <th className="py-3 px-4 text-left">Change</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">ELO</th>
                            <th className="py-3 px-4 text-left">Wins</th>
                            <th className="py-3 px-4 text-left">Losses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPlayers.map((player) => (
                            <tr
                                key={player.rank}
                                className="border-b hover:bg-blue-50 transition-colors"
                            >
                                <td className="py-2 px-4 font-bold text-blue-800">{player.rank}</td>
                                <td className="py-2 px-4">{player.name}</td>
                                <td className="py-2 px-4">{player.change > 0 ? `+${player.change}` : player.change}</td>
                                <td className="py-2 px-4">
                                    <span className={
                                        player.status === 'Bronze' ? 'text-[brown] font-semibold' :
                                        player.status === 'Silver' ? 'text-gray-500 font-semibold' :
                                        player.status === 'Gold' ? 'text-yellow-500 font-semibold' :
                                        player.status === 'Pro' ? 'text-green-500 font-semibold' :
                                        'text-yellow-600 font-semibold'
                                    }>
                                        {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-2 px-4 font-semibold text-blue-900">{player.elo}</td>
                                <td className="py-2 px-4">{player.wins}</td>
                                <td className="py-2 px-4">{player.losses}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-col-reverse mt-4 gap-4 w-full">
                    <div className="text-gray-700 text-sm">
                        Showing {startIdx + 1} to {endIdx} of {players.length} entries
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <button
                            className="hover:cursor-pointer px-3 py-1 rounded bg-blue-100 text-blue-900 hover:bg-blue-200 disabled:opacity-50"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) =>
                            (num === 1 || num === totalPages || Math.abs(num - page) <= 1) ? (
                                <button
                                    key={num}
                                    className={`hover:cursor-pointer px-3 py-1 rounded ${num === page ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900 hover:bg-blue-200'}`}
                                    onClick={() => handlePageChange(num)}
                                >
                                    {num}
                                </button>
                            ) : (
                                (num === page - 2 || num === page + 2) && <span key={num} className="px-2">...</span>
                            )
                        )}
                        <button
                            className="hover:cursor-pointer px-3 py-1 rounded bg-blue-100 text-blue-900 hover:bg-blue-200 disabled:opacity-50"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RankingsTable;
