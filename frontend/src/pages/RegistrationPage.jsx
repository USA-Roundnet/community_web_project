import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const GEOAPIFY_API_KEY = "3cfdf04a71db4f31a3bf17a9d206d45e";
import { API_BASE_URL } from "../config";

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        dateOfBirth: "",
        gender: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationQuery, setLocationQuery] = useState("");
    const [locationResults, setLocationResults] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationSearch = async (e) => {
        const value = e.target.value;
        setLocationQuery(value);
        setFormData((prev) => ({
            ...prev,
            city: "",
            state: "",
            country: "",
            zip: "",
        }));

        if (value.length < 3) {
            setLocationResults([]);
            return;
        }

        setLocationLoading(true);
        try {
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    value
                )}&limit=5&apiKey=${GEOAPIFY_API_KEY}`
            );
            const data = await response.json();
            setLocationResults(data.features || []);
        } catch (err) {
            console.error("Location search error:", err);
            setLocationResults([]);
        } finally {
            setLocationLoading(false);
        }
    };
    const handleLocationSelect = (feature) => {
        // Fallbacks for city, state, country, and zip
        const city =
            feature.properties.city ||
            feature.properties.town ||
            feature.properties.village ||
            feature.properties.hamlet ||
            feature.properties.suburb ||
            feature.properties.county ||
            "";
        const state =
            feature.properties.state ||
            feature.properties.region ||
            feature.properties.state_code ||
            "";
        const country =
            feature.properties.country || feature.properties.country_code || "";
        const zip =
            feature.properties.postcode || feature.properties.postal_code || "";

        setFormData((prev) => ({
            ...prev,
            city,
            state,
            country,
            zip,
        }));
        setLocationQuery([city, state, country].filter(Boolean).join(", "));
        setLocationResults([]);
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
            !formData.phoneNumber ||
            !formData.email ||
            !formData.city ||
            !formData.state ||
            !formData.country ||
            !formData.zip ||
            !formData.dateOfBirth ||
            !formData.gender
        ) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    username: formData.email,
                    email: formData.email,
                    password: formData.password,
                    gender: formData.gender,
                    city: formData.city,
                    state_province: formData.state,
                    zip_code: formData.zip,
                    country: formData.country,
                    phone_number: formData.phoneNumber,
                    date_of_birth: formData.dateOfBirth,
                }),
                credentials: "include",
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data.message || "Account creation failed. Please try again."
                );
            }
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100vh] flex flex-col md:flex-row-reverse justify-center items-center min-h-screen">
            <div className="bg-[#f8f8f8] h-full w-1/2 flex justify-center items-center p-8 hidden md:flex">
                <Link to="/">
                    <img src={logo} className="h-[30vh]" />
                </Link>
            </div>
            <div className="bg-[#225975] w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8">
                <h2 className="text-[#fff] text-3xl h-[10%] font-bold">
                    Create Account
                </h2>
                {error && <div className="error-message">{error}</div>}
                <form
                    className="flex flex-col h-[65%] justify-between w-full max-w-xl"
                    onSubmit={handleSubmit}
                >
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
                    <div className="flex flex-row gap-4">
                        <div className="basis-full relative">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                id="location"
                                name="location"
                                value={locationQuery}
                                onChange={handleLocationSearch}
                                placeholder="Start typing your city"
                                autoComplete="off"
                                required
                            />
                            {locationLoading && (
                                <div className="absolute left-0 right-0 bg-white text-black p-2 z-10">
                                    Searching...
                                </div>
                            )}
                            {locationResults.length > 0 && (
                                <ul className="absolute left-0 right-0 bg-white text-black border border-gray-300 rounded z-10 max-h-40 overflow-y-auto">
                                    {locationResults.map((feature) => (
                                        <li
                                            key={feature.properties.place_id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() =>
                                                handleLocationSelect(feature)
                                            }
                                        >
                                            {[
                                                feature.properties.city,
                                                feature.properties.state,
                                                feature.properties.country,
                                                feature.properties.postcode,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Show parsed location fields (readonly or editable) */}
                    <div className="flex flex-row gap-4">
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State / Province"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                placeholder="Postal Code"
                                required
                            />
                        </div>
                        <div className="basis-1/2">
                            <input
                                className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                required
                            />
                        </div>
                    </div>

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
