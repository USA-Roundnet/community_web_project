import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Grid from '../components/Grid';

const HomePage = () => {
  return (
      <div className="w-screen min-h-screen bg-gray-50">
        <Navbar />
        <Hero />

        <section className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">You are new and want to:</h2>
            <Grid />
        </section>
      </div>
  );
};

export default HomePage;