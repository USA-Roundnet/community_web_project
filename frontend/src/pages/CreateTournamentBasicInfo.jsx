import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const CreateTournamentBasicInfo = () => {
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem("tournamentBasicInfo");
        return saved
            ? JSON.parse(saved)
            : {
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
              };
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
        localStorage.setItem(
            "tournamentBasicInfo",
            JSON.stringify(updatedData)
        );
    };

    const handleSubmit = (e) => {
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
            localStorage.setItem(
                "tournamentBasicInfo",
                JSON.stringify(formData)
            );
            navigate("/events/create/format", { replace: true });
        } catch {
            setError("Tournament creation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black">
            <div className="w-full max-w-4xl flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-10">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
                    Create Tournament
                </h1>
                <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 text-center">
                    Basic Info
                </h2>
                {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            className="w-full p-3 sm:p-4 rounded-md text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 font-semibold text-sm sm:text-base"
                            type="text"
                            id="tournamentName"
                            name="tournamentName"
                            value={formData.tournamentName}
                            onChange={handleChange}
                            placeholder="Tournament Name"
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full p-3 sm:p-4 rounded-md text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 min-h-[80px] font-medium text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="date"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="time"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                Time
                            </label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                placeholder="12:00"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="text-blue-900 font-semibold mb-2 block text-sm sm:text-base"
                        >
                            Location
                        </label>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                id="address1"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                placeholder="Address 1"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            />
                            <input
                                type="text"
                                id="address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                placeholder="Address 2"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                            />
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="Zip"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className="flex-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="hover:cursor-pointer w-full py-3 mt-2 rounded-md bg-blue-900 text-white font-bold text-base sm:text-lg shadow hover:bg-blue-800 transition-colors duration-300"
                    >
                        {isLoading ? "Next..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentBasicInfo;
