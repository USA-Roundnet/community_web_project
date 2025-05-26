import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const TournamentsPage = () => {

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1>Tournaments Page</h1>
        <Link to="/tournaments/create">
          <button id="createButton"
            className="size-auto bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Create a Tournament</button>
        </Link>
      </section>

    </div>
  );
};

export default TournamentsPage;