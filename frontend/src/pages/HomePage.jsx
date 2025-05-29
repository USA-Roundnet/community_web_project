import Hero from "../components/Hero";
import Grid from "../components/Grid";
import who from "/who.webp";

const HomePage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-evenly bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
            <Hero />
            <section className="w-7/8 mt-10 mb-10 flex flex-row items-center justify-between ">
                <img className="w-1/2 rounded-md" src={who} alt="who we are" />
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Who We Are
                    </h1>
                    <p className="text-lg text-center mt-4 text-gray-700">
                        We are a community dedicated to promoting and
                        celebrating the sport. Our mission is to provide a
                        platform for enthusiasts to connect, learn, and grow
                        together.
                    </p>
                </div>
            </section>
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black bg-white/80 rounded-xl shadow-lg p-8 transition hover:scale-105 hover:shadow-2xl">
                <h1 className="text-3xl mt-2 font-extrabold text-yellow-700 tracking-tight">
                    What is Roundnet
                </h1>
                <p className="text-lg text-center mt-4 text-gray-700">
                    This sport is a thrilling combination of skill, strategy,
                    and teamwork. It offers participants a chance to engage in
                    friendly competition while fostering a sense of community.
                </p>
            </section>
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black bg-gradient-to-r from-yellow-100 to-blue-100 rounded-xl shadow-lg p-8">
                <h1 className="text-3xl mt-2 font-extrabold text-blue-800 tracking-tight">
                    Upcoming Events
                </h1>
                <div className="mt-6 w-full">
                    <Grid />
                </div>
            </section>
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black bg-yellow-200 rounded-xl shadow-lg p-8 border-2 border-yellow-400">
                <h1 className="text-3xl mt-2 font-extrabold text-yellow-800 tracking-tight">
                    Our Partners
                </h1>
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
