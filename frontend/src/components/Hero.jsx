import React from 'react';

const Hero = () => {
  return (
    <section
      className="relative text-center text-white bg-cover bg-center p-10"
    >
      <h2 className="text-3xl font-bold">Welcome to Rally Point!</h2>
      <p className="text-lime-500 text-2xl">Tailwind test!</p>
      <p>Your home for everything roundnet. Become a member now, click to learn more.</p>
      <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded">Become a member</button>
    </section>
  );
};

export default Hero;
