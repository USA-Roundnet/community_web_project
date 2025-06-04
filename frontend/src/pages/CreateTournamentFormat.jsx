import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTournamentFormat = () => {
    const [formData, setFormData] = useState({
        format: "",
        bracketStyle: "",
        rules: "",
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

        if (!formData.format || !formData.bracketStyle) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        if (formData.format !== "traditional") {
            setError("Only Traditional Format is currently supported.");
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
        <div className="h-[85vh] w-full flex items-center justify-center text-black">
            <div className="w-full max-w-2xl flex flex-col gap-4 p-10">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">
                    Create Tournament
                </h1>
                <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                    Format
                </h2>
                {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dropdown 1: Format */}
                    <div>
                        <label
                            htmlFor="format"
                            className="text-blue-900 font-semibold mb-1 block"
                        >
                            Format
                        </label>
                        <select
                            id="format"
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            className="w-full p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 font-semibold"
                            required
                        >
                            <option value="">Select format</option>
                            <option value="traditional">
                                Traditional (Pool play + Bracket)
                            </option>
                            {/*<option value="swiss">Swiss</option>*/}
                            <option value="custom">Custom</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Dropdown 2: Bracket Style */}
                    <div>
                        <label
                            htmlFor="bracketStyle"
                            className="text-blue-900 font-semibold mb-1 block"
                        >
                            Bracket Style
                        </label>
                        <select
                            id="bracketStyle"
                            name="bracketStyle"
                            value={formData.bracketStyle}
                            onChange={handleChange}
                            className="w-full p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 font-semibold"
                            required
                        >
                            <option value="">Select Bracket</option>
                            <option value="single">Single Elimination</option>
                            <option value="double">Double Elimination</option>
                        </select>
                    </div>

                    {/* Row 3: Tournament Rules */}
                    <div>
                        <label
                            htmlFor="rules"
                            className="text-blue-900 font-semibold mb-1 block"
                        >
                            Rules
                        </label>
                        <textarea
                            id="rules"
                            name="rules"
                            value={formData.rules}
                            onChange={handleChange}
                            placeholder="Ruleset"
                            className="w-full p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 min-h-[80px] font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 mt-2 rounded-md bg-blue-900 text-white font-bold text-lg shadow hover:bg-blue-800 transition-colors"
                    >
                        {isLoading ? "Next..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentFormat;
