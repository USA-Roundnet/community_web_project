import Hero from "../components/Hero";
import Grid from "../components/Grid";

const HomePage = () => {
    return (
        <div className="w-screen min-h-screen bg-gray-50">
            <Hero />
            <section className="max-w-7xl mx-auto px-4 py-8">
                <Grid />
            </section>
        </div>
    );
};

export default HomePage;
