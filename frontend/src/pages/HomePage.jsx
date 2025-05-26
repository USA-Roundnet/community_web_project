import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Grid from '../components/Grid';
import Grid2 from '../components/Grid2';

const HomePage = () => {
  return (
      <div className="w-screen min-h-screen bg-gray-50">
        <Navbar />
        <Hero />

        <section className="max-w-7xl mx-auto px-4 py-8">
            <Grid />
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8">
            <Grid2 />
        </section>
      </div>
  );
};

export default HomePage;