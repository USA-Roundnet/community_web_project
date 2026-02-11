import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: "",
        gender: "",
        date_of_birth: "",
        city: "",
        state_province: "",
        zip_code: "",
        country: "",
    });

    const [editForm, setEditForm] = useState({ ...profile });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    navigate("/login");
                    return;
                }

                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${API_BASE_URL}/api/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load profile");
                }

                const data = await response.json();
                const profileData = {
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    username: data.username || "",
                    email: data.email || "",
                    phone_number: data.phone_number || "",
                    gender: data.gender || "",
                    date_of_birth: data.date_of_birth
                        ? data.date_of_birth.split("T")[0]
                        : "",
                    city: data.city || "",
                    state_province: data.state_province || "",
                    zip_code: data.zip_code || "",
                    country: data.country || "",
                };
                setProfile(profileData);
                setEditForm(profileData);
            } catch (err) {
                setError(err.message);
                // Use placeholder data when backend is unavailable
                const placeholder = {
                    first_name: "Demo",
                    last_name: "User",
                    username: "demo.user",
                    email: "demo@rallypoint.com",
                    phone_number: "555-0100",
                    gender: "male",
                    date_of_birth: "2000-01-15",
                    city: "Columbus",
                    state_province: "OH",
                    zip_code: "43201",
                    country: "USA",
                };
                setProfile(placeholder);
                setEditForm(placeholder);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setEditForm({ ...profile });
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API_BASE_URL}/api/users/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editForm),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to update profile");
            }

            const updated = await response.json();
            const profileData = {
                first_name: updated.first_name || editForm.first_name,
                last_name: updated.last_name || editForm.last_name,
                username: updated.username || editForm.username,
                email: updated.email || editForm.email,
                phone_number: updated.phone_number || editForm.phone_number,
                gender: updated.gender || editForm.gender,
                date_of_birth: updated.date_of_birth
                    ? updated.date_of_birth.split("T")[0]
                    : editForm.date_of_birth,
                city: updated.city || editForm.city,
                state_province:
                    updated.state_province || editForm.state_province,
                zip_code: updated.zip_code || editForm.zip_code,
                country: updated.country || editForm.country,
            };
            setProfile(profileData);
            setEditForm(profileData);
            setIsEditing(false);
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-screen bg-[#f8f8f8] flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen bg-[#f8f8f8] text-gray-800">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium hover:cursor-pointer"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                        {/* Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="First Name"
                                name="first_name"
                                value={editForm.first_name}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                            <ProfileField
                                label="Last Name"
                                name="last_name"
                                value={editForm.last_name}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Username & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="Username"
                                name="username"
                                value={editForm.username}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                            <ProfileField
                                label="Email"
                                name="email"
                                value={editForm.email}
                                editing={false}
                                type="email"
                            />
                        </div>

                        {/* Phone & Gender */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="Phone"
                                name="phone_number"
                                value={editForm.phone_number}
                                editing={isEditing}
                                onChange={handleChange}
                                type="tel"
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Gender
                                </label>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={editForm.gender}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-800 p-3 bg-gray-50 rounded-md capitalize">
                                        {editForm.gender || "—"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* DOB */}
                        <ProfileField
                            label="Date of Birth"
                            name="date_of_birth"
                            value={editForm.date_of_birth}
                            editing={isEditing}
                            onChange={handleChange}
                            type="date"
                        />

                        {/* Location */}
                        <h3 className="text-lg font-semibold text-gray-700 pt-2 border-t">
                            Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="City"
                                name="city"
                                value={editForm.city}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                            <ProfileField
                                label="State / Province"
                                name="state_province"
                                value={editForm.state_province}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                label="Zip Code"
                                name="zip_code"
                                value={editForm.zip_code}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                            <ProfileField
                                label="Country"
                                name="country"
                                value={editForm.country}
                                editing={isEditing}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Action buttons */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 hover:cursor-pointer"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium hover:cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProfileField = ({
    label,
    name,
    value,
    editing,
    onChange,
    type = "text",
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
            {label}
        </label>
        {editing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
        ) : (
            <p className="text-gray-800 p-3 bg-gray-50 rounded-md">
                {value || "—"}
            </p>
        )}
    </div>
);

export default ProfilePage;
