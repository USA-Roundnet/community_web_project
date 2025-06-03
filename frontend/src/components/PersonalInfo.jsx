import { useState } from "react";

const GEOAPIFY_API_KEY = "3cfdf04a71db4f31a3bf17a9d206d45e"; // Replace with your Geoapify API key

const PersonalInfo = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ ...user });
    const [locationQuery, setLocationQuery] = useState("");
    const [locationResults, setLocationResults] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);

    const handleEditClick = () => setIsEditing((prev) => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Geoapify location search
    const handleLocationSearch = async (e) => {
        const value = e.target.value;
        setLocationQuery(value);
        setForm((prev) => ({
            ...prev,
            city: "",
            state: "",
            country: "",
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
            setLocationResults([]);
        } finally {
            setLocationLoading(false);
        }
    };

    // When user selects a location
    const handleLocationSelect = (feature) => {
        // Fallbacks for city, state, country
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

        setForm((prev) => ({
            ...prev,
            city,
            state,
            country,
        }));
        setLocationQuery([city, state, country].filter(Boolean).join(", "));
        setLocationResults([]);
    };

    const handleSave = (e) => {
        e.preventDefault();
        // call an API to save the changes
        setIsEditing(false);
    };

    return (
        <div className="p-8 mx-auto relative">
            <div className="flex flex-col items-center">
                <img
                    src={
                        user.profilePicture
                            ? user.profilePicture
                            : `https://ui-avatars.com/api/?background=225975&color=fff&name=${encodeURIComponent(
                                  user.firstName + " " + user.lastName
                              )}`
                    }
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-2 border-blue-200 shadow"
                />
                {isEditing ? (
                    <form
                        className="w-full flex flex-col items-center gap-2"
                        onSubmit={handleSave}
                    >
                        <input
                            className="w-1/2 p-2 rounded-md bg-blue-50 text-lg font-bold text-blue-900 text-center border border-blue-200 focus:outline-none"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-1/2 p-2 rounded-md bg-blue-50 text-lg font-bold text-blue-900 text-center border border-blue-200 focus:outline-none"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                        <div className="w-full relative flex items-center justify-center">
                            <input
                                className="w-2/3 p-4 rounded-md bg-blue-50 text-lg font-bold text-blue-900 text-center border border-blue-200 focus:outline-none"
                                name="location"
                                value={locationQuery}
                                onChange={handleLocationSearch}
                                placeholder="Start typing your city..."
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
                                    {locationResults.map((feature) => {
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
                                            feature.properties.country ||
                                            feature.properties.country_code ||
                                            "";
                                        return (
                                            <li
                                                key={
                                                    feature.properties.place_id
                                                }
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() =>
                                                    handleLocationSelect({
                                                        properties: {
                                                            ...feature.properties,
                                                            city,
                                                            state,
                                                            country,
                                                        },
                                                    })
                                                }
                                            >
                                                {[city, state, country]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        <input type="hidden" name="city" value={form.city} />
                        <input type="hidden" name="state" value={form.state} />
                        <input
                            type="hidden"
                            name="country"
                            value={form.country}
                        />

                        <select
                            className="w-1/2 p-2 rounded-md bg-blue-50 text-lg font-bold text-blue-900 text-center border border-blue-200 focus:outline-none"
                            name="gender"
                            value={form.gender}
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
                        <input
                            className="w-1/2 p-2 rounded-md bg-blue-50 text-lg font-bold text-blue-900 text-center border border-blue-200 focus:outline-none"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-1/2 p-2 rounded-md bg-blue-50 text-lg font-bold text-blue-900 text-center border border-blue-200 focus:outline-none"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-300"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="bg-gray-200 text-blue-900 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-gray-300 hover:cursor-pointer"
                                onClick={handleEditClick}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h2 className="text-3xl font-extrabold text-blue-900 mt-4 tracking-tight">
                            {form.firstName} {form.lastName}
                        </h2>
                        <p className="text-blue-700 font-medium mt-1">
                            {form.city}, {form.state}, {form.country}
                        </p>
                        <p className="text-gray-700">
                            {form.gender
                                ? form.gender.charAt(0).toUpperCase() +
                                  form.gender.slice(1)
                                : ""}
                        </p>
                        <div className="mt-4 text-center space-y-1">
                            <p className="text-gray-700">{form.email}</p>
                            <p className="text-gray-700">{form.phoneNumber}</p>
                        </div>
                        <button
                            className="absolute top-6 right-6 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold px-4 py-2 rounded transition-colors shadow"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalInfo;
