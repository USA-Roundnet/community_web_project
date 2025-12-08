import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const API_BASE_URL = 'http://localhost:5000';

const CreateTournamentRegistration = () => {
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('tournamentRegistration');
        return saved ? JSON.parse(saved) : {
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
        };
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };

        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Match inputs like "divisionName-0", "playersPerTeam-1", etc.
        const divisionMatch = name.match(
            /^(divisionName|playersPerTeam|maxTeams)-(\d+)$/
        );

        if (divisionMatch) {
            const field = divisionMatch[1];
            const index = parseInt(divisionMatch[2]);

            setFormData((prev: any) => {
                const updatedDivisions = [...prev.divisions];
                updatedDivisions[index] = {
                    ...updatedDivisions[index],
                    [field]: value,
                };
                const updatedData = { ...prev, divisions: updatedDivisions };
                localStorage.setItem('tournamentRegistration', JSON.stringify(updatedData));
                return updatedData;
            });
        } else {
            setFormData((prev: any) => {
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
                localStorage.setItem('tournamentRegistration', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.availability) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        try {
            const basicInfo = JSON.parse(localStorage.getItem('tournamentBasicInfo') || '{}');
            const format = JSON.parse(localStorage.getItem('tournamentFormat') || '{}');
            
            const tournamentDate = new Date(basicInfo.date);
            const registrationDeadline = new Date(tournamentDate);
            registrationDeadline.setDate(tournamentDate.getDate() - 2);

            let startDateTime = basicInfo.date;
            if (basicInfo.time) {
                startDateTime = `${basicInfo.date}T${basicInfo.time}:00`;
            } else {
                startDateTime = `${basicInfo.date}T09:00:00`; 
            }

            let endDateTime = basicInfo.date;
            if (basicInfo.time) {
                const startTime = new Date(`${basicInfo.date}T${basicInfo.time}:00`);
                const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000); 
                endDateTime = endTime.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss
            } else {
                endDateTime = `${basicInfo.date}T18:00:00`;
            }

            const tournamentData = {
                name: basicInfo.tournamentName,
                city: basicInfo.city,
                state_province: basicInfo.state,
                zip_code: basicInfo.zipCode,
                country: basicInfo.country,
                timezone: 'UTC',
                status: formData.availability === 'public' ? 'upcoming' : 'upcoming',
                format: format.format === 'traditional' ? 'classic' : 'classic',
                start_date: startDateTime,
                end_date: endDateTime,
                registration_deadline: registrationDeadline.toISOString(),
                director_id: 1,
            };

            await makeApiCall('/api/tournaments/', {
                method: 'POST',
                body: JSON.stringify(tournamentData),
            });

            localStorage.removeItem('tournamentBasicInfo');
            localStorage.removeItem('tournamentFormat');
            localStorage.removeItem('tournamentRegistration');

            navigate("/events", { 
                replace: true, 
                state: { message: `Tournament "${tournamentData.name}" created successfully!` }
            });
        } catch  {
            setError("Tournament creation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center text-black">
            <div className="w-full max-w-4xl flex flex-col gap-4 p-4 sm:p-6 md:p-8 lg:p-10">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
                    Create Tournament
                </h1>
                <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 text-center">
                    Registration Info
                </h2>
                {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="availability"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                Tournament Availability
                            </label>
                            <select
                                id="availability"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                            >
                                <option value="">Select availability</option>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <label
                                htmlFor="divisionsType"
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                            >
                                USAR Divisions or Custom Divisions
                            </label>
                            <select
                                id="divisionsType"
                                name="divisionsType"
                                value={formData.divisionsType}
                                onChange={handleChange}
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
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
                                className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
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
                                className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-sm sm:text-base"
                                required
                                min={1}
                            />
                        </div>
                    </div>

                    {formData.divisions.map((division: any, index: number) => (
                        <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100 mb-2"
                        >
                            <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2">
                                Division #{index + 1}
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 flex flex-col">
                                    <label
                                        htmlFor={`divisionName-${index}`}
                                        className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                                    >
                                        Division Name
                                    </label>
                                    <input
                                        type="text"
                                        id={`divisionName-${index}`}
                                        name={`divisionName-${index}`}
                                        value={division.divisionName}
                                        onChange={handleChange}
                                        className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-sm sm:text-base"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <div className="flex-1 flex flex-col">
                                    <label
                                        htmlFor={`playersPerTeam-${index}`}
                                        className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                                    >
                                        Players per Team
                                    </label>
                                    <input
                                        type="number"
                                        id={`playersPerTeam-${index}`}
                                        name={`playersPerTeam-${index}`}
                                        value={division.playersPerTeam}
                                        onChange={handleChange}
                                        className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-sm sm:text-base"
                                        required
                                        min={1}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label
                                        htmlFor={`maxTeams-${index}`}
                                        className="text-blue-900 font-semibold mb-1 text-sm sm:text-base"
                                    >
                                        Max # of Teams
                                    </label>
                                    <input
                                        type="number"
                                        id={`maxTeams-${index}`}
                                        name={`maxTeams-${index}`}
                                        value={division.maxTeams}
                                        onChange={handleChange}
                                        className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-sm sm:text-base"
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
                        className="w-full py-3 mt-2 rounded-md bg-blue-900 text-white font-bold text-base sm:text-lg shadow hover:bg-blue-800 transition-colors hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? "Creating Tournament..." : "Create Tournament"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentRegistration;

