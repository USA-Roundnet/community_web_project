import hero from "/spikeball-default.jpg";

const Hero = () => {
    return (
        <div
            className="relative mt-10 w-7/8 h-[50vh] bg-cover bg-center text-white flex flex-col items-center justify-center mx-auto rounded-md"
            style={{ backgroundImage: `url(${hero})` }}
        >
            <div className="absolute inset-0 bg-black/50 rounded-md" />{" "}
            {/* semi-transparent overlay */}
            <div className="h-[50%] relative z-10 flex flex-col items-center justify-evenly">
                <h2 className="text-3xl font-bold mb-2">
                    Welcome to Rally Point!
                </h2>
                <p className="mb-4">
                    Connecting the roundnet community — discover events,
                    resources, and more.
                </p>
            </div>
        </div>
    );
};

export default Hero;
