export interface Event {
    date: string;
    city: string;
    eventName: string;
    description: string;
    teamsRegistered: number;
    teamLimit: number;
    registrationStatus: string;
    id?: number;
}

export const placeholderEvents: Event[] = [
    {
        date: "2023-11-15",
        city: "New York",
        eventName: "NYC Roundnet Tournament",
        description: "Join us for a thrilling day of roundnet competition!",
        teamsRegistered: 12,
        teamLimit: 16,
        registrationStatus: "Open",
    },
    {
        date: "2023-12-01",
        city: "Los Angeles",
        eventName: "LA Roundnet Meetup",
        description: "Meet fellow roundnet enthusiasts and play some casual games.",
        teamsRegistered: 8,
        teamLimit: 20,
        registrationStatus: "Open",
    },
    {
        date: "2023-12-10",
        city: "Chicago",
        eventName: "Chicago Roundnet Championship",
        description: "Compete for the title of Chicago Roundnet Champion!",
        teamsRegistered: 20,
        teamLimit: 24,
        registrationStatus: "Closed",
    },
    {
        date: "2024-01-05",
        city: "Miami",
        eventName: "Miami Beach Roundnet Festival",
        description: "Enjoy a weekend of sun, sand, and roundnet!",
        teamsRegistered: 15,
        teamLimit: 30,
        registrationStatus: "Open",
    },
    {
        date: "2024-01-20",
        city: "Seattle",
        eventName: "Seattle Roundnet Open",
        description: "Join us for the Seattle Roundnet Open!",
        teamsRegistered: 10,
        teamLimit: 18,
        registrationStatus: "Open",
    },
    {
        date: "2024-02-10",
        city: "Austin",
        eventName: "Austin Roundnet Jam",
        description: "A casual roundnet jam session in Austin.",
        teamsRegistered: 5,
        teamLimit: 12,
        registrationStatus: "Closing Soon",
    },
];
