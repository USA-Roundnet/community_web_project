import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Grid from '../components/Grid';

const TournamentsPage = () => {

  const handleCreate = async (e) => {
    setIsLoading(true);
    setError(null);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/tournaments/create/', { replace: true });
    } catch (err) {
      setError('Cannot Create Tournament. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Grid />
      </section>
      

      <button onclick={handleCreate} id="createButton" 
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Create a Tournament</button>

    </div>
  );
};

export default TournamentsPage;