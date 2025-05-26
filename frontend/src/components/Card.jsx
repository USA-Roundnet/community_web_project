// import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, description, link }) => {

  return (
    <div className="bg-white text-black p-4 shadow-md rounded-md text-center">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
      <Link to={link}>
        <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded">More</button>
      </Link>
    </div>
  );
};

export default Card;
