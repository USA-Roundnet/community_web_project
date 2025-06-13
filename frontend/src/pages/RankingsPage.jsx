import RankingsTable from "../components/RankingsTable";

// Generate Open and Women's players with sample data
const teams = [
    "NY Smashers",
    "Spike Kings",
    "Roundnet Rebels",
    "Empire Spikers",
    "Central Park Pros",
    "NY Queens",
    "Open Kings",
    "Empire Women",
    "Open Legends",
    "Philly Flyers",
    "LA Smashers",
    "Chicago Champs",
    "Miami Waves",
    "Austin Aces",
    "Boston Blazers",
    "Seattle Storm",
    "Denver Diggers",
    "Orlando Owls",
    "Phoenix Fire",
    "San Fran Spikes",
];
const firstNames = [
    "Alex",
    "Jamie",
    "Morgan",
    "Sophie",
    "David",
    "Nina",
    "Ben",
    "Tina",
    "Jack",
    "Amy",
    "Chris",
    "Taylor",
    "Jordan",
    "Casey",
    "Riley",
    "Drew",
    "Sam",
    "Cameron",
    "Avery",
    "Skyler",
    "Logan",
    "Harper",
    "Peyton",
    "Quinn",
    "Reese",
    "Sawyer",
    "Rowan",
    "Finley",
    "Dakota",
    "Emerson",
];
const lastNames = [
    "Johnson",
    "Lee",
    "Smith",
    "Wright",
    "Kim",
    "Lopez",
    "Turner",
    "Scott",
    "Sanders",
    "Stewart",
    "Brown",
    "Martinez",
    "Clark",
    "Nguyen",
    "Evans",
    "Patel",
    "Wilson",
    "Davis",
    "Moore",
    "Murphy",
    "Bell",
    "Foster",
    "Brooks",
    "Reed",
    "Bailey",
    "Cooper",
    "Butler",
    "Russell",
    "Perry",
    "Powell",
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const statusOptions = ["Gold", "Silver", "Bronze", "Pro"];

const openPlayers = Array.from({ length: 1471 }, (_, i) => {
    const rank = i + 1;
    const name = `${firstNames[i % firstNames.length]} ${
        lastNames[i % lastNames.length]
    }`;
    const team = teams[i % teams.length];
    const elo = Math.max(1520 - rank * 4, 500);
    const change = getRandomInt(-10, 10);
    const status = statusOptions[getRandomInt(0, statusOptions.length - 1)];
    const wins = getRandomInt(10, 200);
    const losses = getRandomInt(5, 100);
    return { rank, name, team, change, status, elo, wins, losses };
});

const womensPlayers = Array.from({ length: 162 }, (_, i) => {
    const rank = i + 1;
    const name = `${firstNames[(i + 5) % firstNames.length]} ${
        lastNames[(i + 10) % lastNames.length]
    }`;
    const team = teams[(i + 5) % teams.length];
    const elo = Math.max(1400 - rank * 4, 400);
    const change = getRandomInt(-10, 10);
    const status = statusOptions[getRandomInt(0, statusOptions.length - 1)];
    const wins = getRandomInt(10, 200);
    const losses = getRandomInt(5, 100);
    return { rank, name, team, change, status, elo, wins, losses };
});

function RankingsPage() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-between py-10 text-black bg-gray-50">
            <div className="w-7/8 flex flex-col items-start justify-center">
                <h1 className="text-2xl font-bold mb-10">Player Rankings</h1>
            </div>

            <div className="w-full flex flex-col md:flex-row items-start justify-center gap-8">
                <RankingsTable title="Open Rankings" players={openPlayers} />
                <hr className="text-black h-full transform -rotate-90" />
                <RankingsTable
                    title="Women's Rankings"
                    players={womensPlayers}
                />
            </div>
        </div>
    );
}

export default RankingsPage;
