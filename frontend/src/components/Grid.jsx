import Card from './Card';

const Grid = () => {
  return (
    <section className="p-10">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Learn more about Roundnet" description="Explore the sport." />
        <Card title="Support the sport" description="Help grow the community." />
        <Card title="Get to know Rally Point" description="Meet the team." />
      </div>
    </section>
  );
};

export default Grid;
