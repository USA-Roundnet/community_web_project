import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const CreateTournamentRegistration = () => {
    const [formData, setFormData] = useState({
        deadline: "",
        availability: "",
        divisionsType: "",
        numDivisons: 1,
        divisions: [
            {
                divisionName: "",
                playersPerTeam: 1,
                maxTeams: "",
            },
        ],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // const handleChange = (e) => {
    //   const { name, value } = e.target;

    //   setFormData((prev) => {
    //     let updatedData = {
    //       ...prev,
    //       [name]: name === 'numDivisons' ? parseInt(value) : value
    //     };

    //     // Handle updating divisions array only when numDivisons changes
    //     if (name === 'numDivisons') {
    //       const num = parseInt(value) || 1;
    //       updatedData.divisions = Array.from({ length: num }, (_, i) =>
    //         prev.divisions[i] || { divisionName: '', playersPerTeam: '', maxTeams: '' }
    //       );
    //     }

    //     return updatedData;
    //   });

    //   if (formData.divisionsType == "usar") {
    //     // Use formData.divisionsType == "usar" && "html"
    //     // Create usar Divisions checkbox component to display
    //   }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Match inputs like "divisionName-0", "playersPerTeam-1", etc.
        const divisionMatch = name.match(
            /^(divisionName|playersPerTeam|maxTeams)-(\d+)$/
        );

        if (divisionMatch) {
            const field = divisionMatch[1];
            const index = parseInt(divisionMatch[2]);

            setFormData((prev) => {
                const updatedDivisions = [...prev.divisions];
                updatedDivisions[index] = {
                    ...updatedDivisions[index],
                    [field]: value,
                };
                return { ...prev, divisions: updatedDivisions };
            });
        } else {
            setFormData((prev) => {
                const updated = {
                    ...prev,
                    [name]: name === "numDivisons" ? parseInt(value) : value,
                };

                if (name === "numDivisons") {
                    const num = parseInt(value) || 1;
                    updated.divisions = Array.from(
                        { length: num },
                        (_, i) =>
                            prev.divisions[i] || {
                                divisionName: "",
                                playersPerTeam: 1,
                                maxTeams: "",
                            }
                    );
                }

                return updated;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.deadline) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate("/tournaments/create/registration", { replace: true });
        } catch (err) {
            console.error("Error creating tournament:", err);
            setError("Tournament creation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center text-black">
            <div className="w-full max-w-2xl flex flex-col gap-4 p-10">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
                    Create Tournament
                </h1>
                <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                    Registration Info
                </h2>
                {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Option 1: Registration Deadline & Availability */}
                    <div className="flex flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="deadline"
                                className="text-blue-900 font-semibold mb-1"
                            >
                                Registration Deadline
                            </label>
                            <select
                                id="deadline"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                required
                            >
                                <option value="">Select deadline</option>
                                <option value="1day">
                                    1 Day before tournament
                                </option>
                                <option value="2day">
                                    2 Days before tournament
                                </option>
                                <option value="1week">
                                    1 Week before tournament
                                </option>
                                <option value="2week">
                                    2 Weeks before tournament
                                </option>
                                <option value="1month">
                                    1 Month before tournament
                                </option>
                                <option value="2month">
                                    2 Months before tournament
                                </option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="availability"
                                className="text-blue-900 font-semibold mb-1"
                            >
                                Tournament Availability
                            </label>
                            <select
                                id="availability"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                required
                            >
                                <option value="">Select availability</option>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>

                    {/* Divisions for Registration */}
                    <div className="flex flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="divisionsType"
                                className="text-blue-900 font-semibold mb-1"
                            >
                                USAR Divisions or Custom Divisions
                            </label>
                            <select
                                id="divisionsType"
                                name="divisionsType"
                                value={formData.divisionsType}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                required
                            >
                                <option value="">Select type</option>
                                <option value="custom">Custom Divisions</option>
                                <option value="usar">USAR Divisions</option>
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="numDivisons"
                                className="text-blue-900 font-semibold mb-1"
                            >
                                # of Divisions
                            </label>
                            <input
                                type="number"
                                id="numDivisons"
                                name="numDivisons"
                                value={formData.numDivisons}
                                onChange={handleChange}
                                placeholder="# of Divisions"
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                                required
                                min={1}
                            />
                        </div>
                    </div>

                    {/* Display once for each division */}
                    {formData.divisions.map((division, index) => (
                        <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-2"
                        >
                            <h2 className="text-lg font-bold text-blue-900 mb-2">
                                Division #{index + 1}
                            </h2>
                            <div className="flex flex-row gap-4">
                                <div className="flex-1 flex flex-col">
                                    <label
                                        htmlFor={`divisionName-${index}`}
                                        className="text-blue-900 font-semibold mb-1"
                                    >
                                        Division Name
                                    </label>
                                    <input
                                        type="text"
                                        id={`divisionName-${index}`}
                                        name={`divisionName-${index}`}
                                        value={division.divisionName}
                                        onChange={handleChange}
                                        className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 mt-2">
                                <div className="flex-1 flex flex-col">
                                    <label
                                        htmlFor={`playersPerTeam-${index}`}
                                        className="text-blue-900 font-semibold mb-1"
                                    >
                                        Players per Team
                                    </label>
                                    <input
                                        type="number"
                                        id={`playersPerTeam-${index}`}
                                        name={`playersPerTeam-${index}`}
                                        value={division.playersPerTeam}
                                        onChange={handleChange}
                                        className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                                        required
                                        min={1}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label
                                        htmlFor={`maxTeams-${index}`}
                                        className="text-blue-900 font-semibold mb-1"
                                    >
                                        Max # of Teams
                                    </label>
                                    <input
                                        type="number"
                                        id={`maxTeams-${index}`}
                                        name={`maxTeams-${index}`}
                                        value={division.maxTeams}
                                        onChange={handleChange}
                                        className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                                        required
                                        min={1}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 mt-2 rounded-md bg-blue-900 text-white font-bold text-lg shadow hover:bg-blue-800 transition-colors hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? "Next..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentRegistration;
