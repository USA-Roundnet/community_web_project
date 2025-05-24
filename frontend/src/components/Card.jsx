import React from 'react';

const Card = ({ title, description }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md text-center">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
      <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded">More</button>
    </div>
  );
};

export default Card;
