import Hero from "../components/Hero";
import Grid from "../components/Grid";

const HomePage = () => {
    return (
        <div className="w-full flex flex-col items-center justify-evenly">
            <Hero />
            <section className="w-7/8 mt-10 mb-10 flex flex-col items-center text-black">
                <h1 className="text-4xl">Events</h1>
                <Grid />
            </section>
        </div>
    );
};

export default HomePage;
