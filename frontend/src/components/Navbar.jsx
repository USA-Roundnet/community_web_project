import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Rally Point</h1>
      <div>
        <a href="#" className="px-4">Home</a>
        <a href="#" className="px-4">Events</a>
        <a href="#" className="px-4">Tournaments</a>
        <a href="#" className="px-4">Community</a>
      </div>
    </nav>
  );
};

export default Navbar;
