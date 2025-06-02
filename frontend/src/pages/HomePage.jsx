import Hero from "../components/Hero";
import Grid from "../components/Grid";
import who from "/who.webp";
import what from "/roundnet.png";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-evenly text-black">
            <Hero />
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center">
                <div className="h-[25vh] relative z-10 flex flex-col items-center justify-evenly">
                    <h2 className="text-5xl font-bold mb-2">
                        Welcome to Rally Point!
                    </h2>
                    <p className="text-lg">
                        Connecting the roundnet community — discover events,
                        resources, and more.
                    </p>
                </div>
            </section>
            <section className="w-7/8 mt-10 mb-10 flex flex-row items-center justify-center">
                <div className="w-full h-[55vh] flex flex-col items-start justify-between">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        What is Roundnet{" "}
                    </h1>
                    <div className="flex flex-row items-center justify-between">
                        <img
                            className="w-1/2 rounded-md"
                            src={what}
                            alt="who we are"
                        />
                        <div className="w-11/24 h-full flex flex-col items-center justify-evenly">
                            <p className=" text-lg text-center mt-4 text-gray-700">
                                This sport is a thrilling combination of skill,
                                strategy, and teamwork. It offers participants a
                                chance to engage in friendly competition while
                                fostering a sense of community.
                            </p>
                            <Link to='/about' className="hover:cursor-pointer px-6 py-3 text-[#f8f8f8] bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-300">
                                Learn more
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="h-[70vh] w-7/8 mt-10 mb-10 flex flex-row items-center justify-between ">
                <div className="w-full flex flex-col items-start justify-center">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Our Mission
                    </h1>
                    <div className="flex flex-row items-center justify-center">
                        <img
                            className="w-1/2 rounded-md"
                            src={who}
                            alt="who we are"
                        />

                        <p className="w-1/2 text-lg text-center mt-4 text-gray-700">
                            We are a community dedicated to promoting and
                            celebrating the sport. Our mission is to provide a
                            platform for enthusiasts to connect, learn, and grow
                            together.
                        </p>
                    </div>
                </div>
            </section>

            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center ">
                <h1 className="">Upcoming Events</h1>
                <div className="mt-6 w-full">
                    <Grid />
                </div>
            </section>
            <section className="w-7/8  flex flex-col items-center ">
                <h1 className=" tracking-tight">Our Partners</h1>
                <p className="text-lg text-center mt-4 text-gray-800">
                    We are proudly backed by{" "}
                    <span className="font-semibold text-blue-700 hover:underline cursor-pointer transition">
                        USA Roundnet
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-yellow-700 hover:underline cursor-pointer transition">
                        Spikeball
                    </span>
                    .
                </p>
            </section>
        </div>
    );
};

export default HomePage;
