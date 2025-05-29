import Hero from "../components/Hero";
import Grid from "../components/Grid";

const HomePage = () => {
    return (
        <div className="w-full flex flex-col items-center justify-evenly">
            <Hero />
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black">
                <h1 className="text-2xl mt-2">Who We Are</h1>
                <p className="text-lg text-center">
                    We are a community dedicated to promoting and celebrating
                    the sport. Our mission is to provide a platform for
                    enthusiasts to connect, learn, and grow together.
                </p>
            </section>
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black">
                <h1 className="text-2xl mt-2">What the Sport Is</h1>
                <p className="text-lg text-center">
                    This sport is a thrilling combination of skill, strategy,
                    and teamwork. It offers participants a chance to engage in
                    friendly competition while fostering a sense of community.
                </p>
            </section>
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black">
                <h1 className="text-2xl mt-2">Upcoming Events</h1>
                <Grid />
            </section>
        </div>
    );
};

export default HomePage;
