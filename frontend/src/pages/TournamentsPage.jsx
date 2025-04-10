import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Grid from '../components/Grid';

const TournamentsPage = () => {
  return (
      <div className="w-screen min-h-screen bg-gray-50">
        <Navbar />
        <Hero />

        <section className="max-w-7xl mx-auto px-4 py-8">
            <Grid />
        </section>

        <button className="bg-red-500 hover:bg-red-600 px-40 py-20 rounded">Create a Tournament</button>

      </div>
  );
};

export default TournamentsPage;