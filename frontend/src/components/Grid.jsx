import React from 'react';
import Card from './Card';

const Grid = () => {
  return (
    <section className="p-10">
      <h2 className="text-2xl font-bold text-center mb-4">You are new and want to:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Learn more about Roundnet" description="Explore the sport." />
        <Card title="Support the sport" description="Help grow the community." />
        <Card title="Get to know Rally Point" description="Meet the team." />
      </div>
    </section>
  );
};

export default Grid;
