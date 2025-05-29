import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const US_STATE_ABBREVIATIONS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        zipCode: "",
        city: "",
        state: "",
        country: "",
        dateOfBirth: "",
        gender: "",
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.zipCode ||
            !formData.city ||
            !formData.state ||
            !formData.country ||
            !formData.dateOfBirth ||
            !formData.gender
        ) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Registration error:", err);
            setError("Account creation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100vh] flex flex-row-reverse justify-center items-center min-h-screen">
            <div className="bg-[#f8f8f8] h-full w-1/2 flex justify-center items-center p-8">
                <Link to="/">
                    <img src={logo} className="h-[30vh]" />
                </Link>
            </div>
            <div className="bg-[#225975] w-1/2 h-full flex flex-col justify-center items-center p-8">
                <h2 className="text-[#fff] text-3xl h-[10%] font-bold">
                    Create Account
                </h2>
                {error && <div className="error-message">{error}</div>}
                <form
                    className="flex flex-col h-[55%] justify-between w-[60%]"
                    onSubmit={handleSubmit}
                >
                    {/* Row 1: First Name, Last Name */}
                    <div className="flex flex-row gap-4">
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                required
                            />
                        </div>
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Email, Password, Confirm Password */}
                    <div className="flex flex-row gap-4">
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className=" basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Zip Code, City, State, Country */}
                    <div className="flex flex-row gap-4">
                        <div className="basis-1/4">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>
                        <div className="basis-1/4">
                            <select
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            >
                                <option value="">State</option>
                                {US_STATE_ABBREVIATIONS.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="basis-1/4">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="Zip code"
                                required
                            />
                        </div>
                        <div className="basis-1/4">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 4: Gender, Date of Birth */}
                    <div className="flex flex-row gap-4">
                        <div className="basis-1/2">
                            <select
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="prefer-not-to-specify">
                                    Prefer not to specify
                                </option>
                            </select>
                        </div>
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        className="w-full p-4 rounded-md bg-black text-white font-semibold"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <div className="h-[10%] flex flex-col justify-center items-center">
                    <p>
                        Already have an account? Login{" "}
                        <Link
                            className="text-[#FFE34A] transition-colors duration-200 underline "
                            to="/login"
                        >
                            here
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
