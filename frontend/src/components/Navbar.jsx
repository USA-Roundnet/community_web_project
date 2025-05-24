import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-white' : 'text-blue-200 hover:text-white';
  };

  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Rally Point</h1>
      <div>
        <Link to="/home" className="px-4">Home</Link>
        <Link to="/events" className="px-4">Events</Link>
        <Link to="/tournaments" className="px-4">Tournaments</Link>
        <Link to="/rankings" className="px-4">Rankings</Link>
      </div>
    </nav>
  );
};

export default Navbar;
