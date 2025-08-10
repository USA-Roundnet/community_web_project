import hero from "/who.webp";

const Hero = () => {
    return (
        <div
            className="relative w-[95%] sm:w-[90%] md:w-7/8 h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cover bg-center text-white flex flex-col items-center justify-center mx-auto rounded-md"
            style={{ backgroundImage: `url(${hero})` }}
        >
            <div className="absolute inset-0 bg-black/50 rounded-md" />
            <div className="h-[50%] relative z-10 flex flex-col items-center justify-evenly"></div>
        </div>
    );
};

export default Hero;
