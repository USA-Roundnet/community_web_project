
const Hero = () => {
  return (
    <section
      className="relative h-[300px] bg-cover bg-center text-white flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/spikeball-default.jpeg')"
      }}
    >
      <div className="absolute inset-0 bg-black/50" /> {/* semi-transparent overlay */}
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to Rally Point!</h2>
        <p className="mb-4">Your home for everything roundnet.</p>
        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Become a member</button>
      </div>
    </section>
  );
};


export default Hero;
