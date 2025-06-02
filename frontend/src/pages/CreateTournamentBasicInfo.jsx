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
        <div
            className="login-container"
            style={{ minHeight: "100vh", backgroundColor: "lightgray" }}
        >
            <div className="login-card">
                <h1>Create Tournament</h1>
                <h2>Basic Info</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Row 1: Tournament Name */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tournamentName">
                                Tournament Name
                            </label>
                            <input
                                type="text"
                                id="tournamentName"
                                name="tournamentName"
                                value={formData.tournamentName}
                                onChange={handleChange}
                                placeholder="Tournament Name"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Tournament Description */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="textarea"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                            />
                        </div>
                    </div>

                    {/* Row 3: Date and Time */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="Date"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="time">Time</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                placeholder="12:00"
                            />
                        </div>
                    </div>

                    {/* Row 4,5,6: Location */}
                    <label htmlFor="location">Location</label>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                id="address1"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                placeholder="Address 1"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                id="address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                placeholder="Address 2"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="Zip"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="United States"
                                required
                            />
                        </div>
                    </div>

                    <button type="next" disabled={isLoading}>
                        {isLoading ? "Next..." : "Next"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentBasicInfo;
