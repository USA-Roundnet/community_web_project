import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const TeamPage = () => {
    const { teamId } = useParams();

    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [isEditingNewUser, setIsEditingNewUser] = useState(false);
    const [isLoadingNewUser, setIsLoadingNewUser] = useState(true);
    const [isSavingNewUser, setIsSavingNewUser] = useState(false);
    const [errorNewUser, setErrorNewUser] = useState(null);
    const [successNewUser, setSuccessNewUser] = useState(null);

    const [team, setTeam] = useState({
        team_name: "",
        team_type_id: 0,
        public: 0,
        description: "",
        users: [],
        created_at: "",
    });

    const [editForm, setEditForm] = useState({ ...team });

    const [newUserData, setNewUserData] = useState({id: 0, role: "player"});
    const [newUserDataForm, setNewUserDataForm] = useState({...newUserData});

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                if (!teamId) {
                    throw new Error("Failed to load team")
                }

                const token = localStorage.getItem("authToken");
                const response = await fetch(
                    `${API_BASE_URL}/api/teams/${teamId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load team");
                }

                const data = await response.json();

                const userTeamResponse = await fetch(
                    `${API_BASE_URL}/api/userTeams/teamId/${teamId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (!userTeamResponse.ok) {
                    throw new Error("Failed to load userTeams");
                }

                const userTeamData = await userTeamResponse.json();

                const users = await Promise.all(
                    userTeamData.map(async (userTeam) => {
                        const userResponse = await fetch(
                            `${API_BASE_URL}/api/users/${userTeam.user_id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (!userResponse.ok) {
                            throw new Error(`Failed to load user with id ${userTeam.user_id}`);
                        }

                        const userData = await userResponse.json();
                        userData.teamRole   = userTeam.role;
                        userData.teamStatus = userTeam.status;
                        userData.teamJoined = userTeam.created_at;
                        return userData;
                    })
                );

                const teamData = {
                    team_name: data.name || "",
                    team_type_id: data.team_type_id || "",
                    public: data.public || 0,
                    description: data.description || "",
                    users: users,
                    created_at: data.created_at
                        ? data.created_at.split("T")[0]
                        : "",
                };
                setTeam(teamData);
                setEditForm(teamData);

            } catch (err) {
                setError(err.message);
                // Use placeholder data when backend is unavailable
                const placeholder = {
                    team_name: "Team 1",
                    team_type_id: 2,
                    public: 0,
                    description: "Example team for testing",
                    users: [{
                        id: 123,
                        first_name: "John",
                        last_name: "Smith",
                        teamRole: "player",
                        teamStatus: "accepted",
                        teamJoined: "2026-01-31",
                        profile_picture_url: "www.JohnSmith.com/picture"
                    },
                    {
                        id: 246,
                        first_name: "Jane",
                        last_name: "Doe",
                        teamRole: "player",
                        teamStatus: "invited",
                        teamJoined: "2026-02-01",
                        profile_picture_url: "www.JaneDoe.com/picture"
                    }],
                    created_at: "2026-01-31",
                };
                setTeam(placeholder);
                setEditForm(placeholder);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeam();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setEditForm({ ...team });
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
            // const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `${API_BASE_URL}/api/teams/${teamId}`,
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
                throw new Error(data.message || "Failed to update team");
            }

            const updated = await response.json();
            const teamData = {
                team_name: updated.team_name || editForm.team_name,
                team_type_id: updated.team_type_id || editForm.team_type_id,
                public: updated.public,
                description: updated.description || editForm.description,
                users: editForm.users,
                created_at: updated.created_at
                    ? updated.created_at.split("T")[0]
                    : editForm.created_at,
            };
            setTeam(teamData);
            setEditForm(teamData);
            setIsEditing(false);
            setSuccess("Team updated successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangeNewUser = (e) => {
        const { name, value } = e.target;
        setNewUserDataForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelNewUser = () => {
        setNewUserDataForm({ ...newUserData });
        setIsEditingNewUser(false);
        setErrorNewUser(null);
        setSuccessNewUser(null);
    };

    const handleSaveNewUser = async (e) => {
        e.preventDefault();
        setIsSavingNewUser(true);
        setErrorNewUser(null);
        setSuccessNewUser(null);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `${API_BASE_URL}/api/userTeams`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_id: newUserDataForm.id,
                        team_id: teamId,
                        role: newUserDataForm.role,
                        status: "invited",
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to add user");
            }

            const updated = await response.json();

            setIsEditingNewUser(false);
            setSuccessNewUser("Team updated successfully!");
        } catch (err) {
            setErrorNewUser(err.message);
        } finally {
            setIsSavingNewUser(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-screen bg-[#f8f8f8] flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading team...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen bg-[#f8f8f8] text-gray-800">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Team</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium hover:cursor-pointer"
                        >
                            Edit Team
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
                        {/* Team Name & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TeamField
                                label="Team Name"
                                name="team_name"
                                value={editForm.team_name}
                                editing={false}
                                onChange={handleChange}
                            />
                            <TeamField
                                label="Team Type ID"
                                name="team_type_id"
                                value={editForm.team_type_id}
                                editing={false}
                                onChange={handleChange}
                                type="integer"
                            />
                        </div>

                        {/* Public/Private & Created at */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TeamField
                                label="Public"
                                name="public"
                                value={editForm.public}
                                editing={isEditing}
                                onChange={handleChange}
                                type="bool"
                            />
                            <TeamField
                                label="Created at"
                                name="created_at"
                                value={editForm.created_at}
                                editing={false}
                                type="date"
                            />
                        </div>

                        {/* Team Description */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <TeamField
                                label="Description"
                                name="description"
                                value={editForm.description}
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

          {/*Users Section*/}
          <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Team Members</h1>
                    {!isEditingNewUser && (
                        <button
                            onClick={() => setIsEditingNewUser(true)}
                            className="px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium hover:cursor-pointer"
                        >
                            Invite Team Member
                        </button>
                    )}
                </div>

                {successNewUser && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                        {successNewUser}
                    </div>
                )}
                {errorNewUser && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {errorNewUser}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {isEditingNewUser && (
                            <div>
                                <form onSubmit={handleSaveNewUser}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="block text-xl font-medium text-gray-500 mb-1">
                                            User ID
                                        </label>
                                        <input
                                            type="string"
                                            name="id"
                                            value={newUserDataForm.id}
                                            onChange={handleChangeNewUser}
                                            className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                                        />
                                        <label className="block text-xl font-medium text-gray-500 mb-1">
                                            User Role
                                        </label>
                                        <select
                                          name="role"
                                          onChange={handleChangeNewUser}
                                          className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:outline-none">
                                            <option value="player">Player</option>
                                            <option value="coach">Coach</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    {/* Action buttons */}
                                    {isEditingNewUser && (
                                        <div className="flex gap-3 pt-4 border-t">
                                            <button
                                                type="submit"
                                                disabled={isSavingNewUser}
                                                className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 hover:cursor-pointer"
                                            >
                                                {isSavingNewUser ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelNewUser}
                                                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium hover:cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}
                        {team.users.map((user) => (
                            <UserField
                                firstName={user.first_name}
                                lastName={user.last_name}
                                teamRole={user.teamRole}
                                teamStatus={user.teamStatus}
                                teamJoined={user.teamJoined}
                                profilePic={user.profile_picture_url}
                            />
                        ))}
                    </div>

                </div>
            </div>
        
        </div>
    );
};

const TeamField = ({
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

const UserField = ({
    firstName,
    lastName,
    teamRole,
    teamStatus,
    teamJoined,
    profilePic,
}) => (
    <div>
        <label className="block text-xl font-medium text-gray-500 mb-1">
            {firstName} {lastName} | {teamRole} {teamStatus == "invited" ? "(pending)" : "" }
        </label>
        <p className="text-gray-800 p-3 bg-gray-50 rounded-md">
            Team Member since {teamJoined.split('T')[0]}
        </p>
        <p className="text-gray-800 p-3 bg-gray-50 rounded-md">
            Profile Picture link (idk how to display yet): {profilePic}
        </p>
    </div>
);

export default TeamPage;
