import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const CreateTournamentBasicInfo = () => {
    const [formData, setFormData] = useState({
        tournamentName: "",
        description: "",
        date: "",
        time: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (
            !formData.tournamentName ||
            !formData.date ||
            !formData.address1 ||
            !formData.city ||
            !formData.state ||
            !formData.zipCode ||
            !formData.country
        ) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate("/events/create/format", { replace: true });
        } catch (err) {
            console.error("Error creating tournament:", err);
            setError("Tournament creation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center text-black ">
            <div className="w-7/8 h-full flex flex-col gap-2 p-10">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">Create Tournament</h1>
                <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">Basic Info</h2>
                {error && <div className="text-red-600 text-center font-semibold mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Tournament Name */}
                    <div>
                        <input
                            className="w-full p-4 rounded-md text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 font-semibold"
                            type="text"
                            id="tournamentName"
                            name="tournamentName"
                            value={formData.tournamentName}
                            onChange={handleChange}
                            placeholder="Tournament Name"
                            required
                        />
                    </div>

                    {/* Row 2: Tournament Description */}
                    <div>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full p-4 rounded-md text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 min-h-[80px] font-medium"
                        />
                    </div>

                    {/* Row 3: Date and Time */}
                    <div className="flex flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="date" className="text-blue-900 font-semibold mb-1">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="time" className="text-blue-900 font-semibold mb-1">Time</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                placeholder="12:00"
                            />
                        </div>
                    </div>

                    {/* Row 4,5,6: Location */}
                    <div>
                        <label htmlFor="location" className="text-blue-900 font-semibold mb-2 block">Location</label>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                id="address1"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                placeholder="Address 1"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                required
                            />
                            <input
                                type="text"
                                id="address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                placeholder="Address 2"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                            />
                            <div className="flex flex-row gap-3">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                    required
                                />
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                    required
                                />
                            </div>
                            <div className="flex flex-row gap-3">
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="Zip"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                    required
                                />
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="hover:cursor-pointer w-full py-3 mt-2 rounded-md bg-blue-900 text-white font-bold text-lg shadow hover:bg-blue-800 transition-colors duration-300"
                    >
                        {isLoading ? "Next..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentBasicInfo;