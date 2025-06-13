import logo from "../assets/rallypoint-logo.png"; // Adjust the path as necessary

const AboutPage = () => {
    const team = [
        {
            name: "Alice Johnson",
            role: "Founder & Organizer",
            profilePicture: "/team/alice.jpg",
            email: "alice.johnson@example.com",
        },
        {
            name: "Bob Smith",
            role: "Community Manager",
            profilePicture: "/team/bob.jpg",
            email: "bob.smith@example.com",
        },
        {
            name: "Charlie Lee",
            role: "Lead Developer",
            profilePicture: "/team/charlie.jpg",
            email: "charlie.lee@example.com",
        },
    ];

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-10">
            <div className="w-7/8 flex flex-col gap-8">
                {/* General About Section */}
                <div className="flex flex-row items-center justify-between w-full text-black">
                    <div className="w-full flex flex-row p-4 gap-6 items-start justify-center">
                        <p className="text-lg font-medium">
                            Rally Point is a community-driven platform dedicated
                            to connecting roundnet players, teams, and
                            tournament organizers across the country. We make it
                            easy to discover, join, and organize roundnet
                            events, while building a vibrant and inclusive
                            community for all skill levels.
                        </p>
                    </div>
                    <div className="flex flex-col items-end w-1/4 gap-4 p-8">
                        <img
                            src={logo}
                            alt="Rally Point Logo"
                            className="max-h-40 w-40 object-contain"
                        />
                    </div>
                </div>
                {/* Mission Section */}
                <div className="flex flex-row text-black w-full h-[25vh] items-end justify-between">
                    <div className="flex flex-col items-start h-full w-2/3 justify-between">
                        <div className="h-[30%] p-4 flex items-start justify-start">
                            <h2 className="text-4xl font-semibold text-blue-900">
                                Our Mission
                            </h2>
                        </div>
                        <div className="flex flex-col p-4 gap-2 text-lg font-medium">
                            <span>
                                Our mission is to foster growth and connection
                                in the roundnet community by providing a
                                platform for players and organizers to come
                                together, share resources, and celebrate the
                                sport. We believe in the power of sport to bring
                                people together and create lasting friendships.
                            </span>
                        </div>
                    </div>
                </div>
                {/* The Team Section */}
                <div className="flex flex-col w-full items-start">
                    <div className="h-[25%] p-4 flex items-center justify-center">
                        <h2 className="text-4xl font-semibold text-blue-900">
                            The Team
                        </h2>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
                        {/* Example team members, replace with real info as needed */}
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="flex-1 border border-blue-200 rounded-xl p-4 bg-blue-50 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
                            >
                                <img
                                    src={
                                        team.profilePicture
                                            ? team.profilePicture
                                            : `https://ui-avatars.com/api/?background=225975&color=fff&name=${encodeURIComponent(
                                                  team.name
                                              )}`
                                    }
                                    alt={team.name}
                                    className="w-12 h-12 rounded-full border-2 border-blue-200 shadow"
                                />
                                <div className="font-bold text-blue-900 text-lg">
                                    {member.name}
                                </div>
                                <div className="text-blue-800">
                                    {member.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Contact Section */}
                <div className="flex flex-row text-black w-full items-end justify-between">
                    <div className="flex flex-col items-start h-full w-2/3 justify-between">
                        <div className="h-[30%] p-4 flex items-start justify-start">
                            <h2 className="text-4xl font-semibold text-blue-900">
                                Questions?
                            </h2>
                        </div>
                        <div className="flex flex-row p-4 gap-1 text-lg font-medium">
                            <span>Contact us at</span>
                            <a href="mailto:info@rallypoint.com">
                                info (at) rallypoint (dot) com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
