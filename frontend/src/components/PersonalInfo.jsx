import vite from "/vite.svg";

const PersonalInfo = ({ user }) => {
    return (
        <div className="p-8 mx-auto">
            <div className="flex flex-col items-center">
                <img
                    src={vite}
                    alt="User Avatar"
                    className="w-28 h-28 rounded-full border-4 border-blue-200 shadow mb-2"
                />
                <h2 className="text-3xl font-extrabold text-blue-900 mt-4 tracking-tight">
                    {user.firstName} {user.lastName}
                </h2>
                <p className="text-blue-700 font-medium mt-1">
                    {user.city}, {user.state}, {user.country}
                </p>
                <div className="mt-4 text-center space-y-1">
                    <p className="text-gray-700">{user.email}</p>
                    <p className="text-gray-700">{user.phoneNumber}</p>
                </div>
            </div>
            
        </div>
    );
};

export default PersonalInfo;
