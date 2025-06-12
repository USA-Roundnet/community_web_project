

const AboutPage = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center py-10 bg-white">
            <div className="w-7/8 flex flex-col gap-8">
                {/* General About Section */}
                <div className="flex flex-row items-center justify-between w-full text-black">
                    <div className="w-3/4 flex flex-col gap-6 items-start justify-center">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-1 text-blue-900">
                            About Rally Point
                        </h1>
                        <p className="text-lg font-medium text-blue-900">
                            Rally Point is a community-driven platform dedicated to connecting roundnet players, teams, and tournament organizers across the country. We make it easy to discover, join, and organize roundnet events, while building a vibrant and inclusive community for all skill levels.
                        </p>
                    </div>
                    <div className="flex flex-col items-end w-1/4 gap-4 p-8">
                        <img src="/spikeball-logo.webp" alt="Rally Point Logo" className="max-h-40 w-40 object-contain rounded-xl shadow border border-blue-200 bg-white" />
                    </div>
                </div>
                <hr className="text-black" />
                {/* Mission Section */}
                <div className="flex flex-row text-black w-full h-[30vh] items-end justify-between">
                    <div className="flex flex-col items-start h-full w-2/3 justify-between">
                        <div className="h-[30%] p-4 flex items-start justify-start">
                            <h2 className="text-4xl font-semibold text-blue-900">
                                Our Mission
                            </h2>
                        </div>
                        <div className="flex flex-col p-4 gap-2 text-lg font-medium">
                            <span>
                                Our mission is to foster growth and connection in the roundnet community by providing a platform for players and organizers to come together, share resources, and celebrate the sport. We believe in the power of sport to bring people together and create lasting friendships.
                            </span>
                        </div>
                    </div>
                </div>
                <hr className="text-black" />
                {/* The Team Section */}
                <div className="flex flex-col w-full items-start">
                    <div className="h-[25%] p-4 flex items-center justify-center">
                        <h2 className="text-4xl font-semibold text-blue-900">
                            The Team
                        </h2>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
                        {/* Example team members, replace with real info as needed */}
                        <div className="flex-1 border border-blue-200 rounded-xl p-4 bg-blue-50 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center">
                            <img src="/spikeball-logo.webp" alt="Team Member" className="w-20 h-20 object-contain rounded-full mb-2" />
                            <div className="font-bold text-blue-900 text-lg">Alex Johnson</div>
                            <div className="text-blue-800">Founder & Organizer</div>
                        </div>
                        <div className="flex-1 border border-blue-200 rounded-xl p-4 bg-blue-50 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center">
                            <img src="/usar-logo.png" alt="Team Member" className="w-20 h-20 object-contain rounded-full mb-2" />
                            <div className="font-bold text-blue-900 text-lg">Jamie Lee</div>
                            <div className="text-blue-800">Community Manager</div>
                        </div>
                        <div className="flex-1 border border-blue-200 rounded-xl p-4 bg-blue-50 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center">
                            <img src="/rallypoint-logo.png" alt="Team Member" className="w-20 h-20 object-contain rounded-full mb-2" />
                            <div className="font-bold text-blue-900 text-lg">Morgan Smith</div>
                            <div className="text-blue-800">Lead Developer</div>
                        </div>
                    </div>
                </div>
                <hr className="text-black" />
                {/* Contact Section */}
                <div className="flex flex-col w-full items-start bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <span className="text-blue-800 font-semibold">Contact us:</span> <a href="mailto:info@rallypoint.com" className="underline text-blue-600">info@rallypoint.com</a>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
