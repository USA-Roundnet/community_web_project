import hero from "/spikeball-default.jpg";

const Hero = () => {
    return (
        <div
            className="relative mt-10 w-7/8 h-[50vh] bg-cover bg-center text-white flex flex-col items-center justify-center mx-auto rounded-md"
            style={{ backgroundImage: `url(${hero})` }}
        >
            <div className="absolute inset-0 bg-black/50 rounded-md" />{" "}
            {/* semi-transparent overlay */}
            
        </div>
    );
};

export default Hero;
