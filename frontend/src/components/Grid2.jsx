// import React from 'react';
import Card from './Card';

const Grid2 = () => {
  return (
    <section className="p-10">
      <h2 className="text-2xl font-bold text-black text-center mb-4">You are a member and want to:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="View Tournaments" description="See all upcoming/past tournaments."
          link="/tournaments" />
        <Card title="Create a Tournament" description="Set up a tournament through Rally Point."
          link="/tournaments/create"/>
      </div>
    </section>
  );
};

export default Grid2;
