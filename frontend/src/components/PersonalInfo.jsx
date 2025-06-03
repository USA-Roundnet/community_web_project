import vite from '/vite.svg';

const PersonalInfo = ({ user }) => {
    return (
        <div className="p-8">
            <div className="flex flex-col items-center">
                <img src={vite} alt="User Avatar" className="w-24 h-24 rounded-full" />
                <h2 className="text-2xl font-bold mt-4">
                    {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">
                    {user.city}, {user.state}, {user.country}
                </p>
                <div className="mt-4 text-center">
                    <p>{user.email}</p>
                    <p>{user.phoneNumber}</p>
                </div>
            </div>
            <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold">Memberships</h2>
                <ul>
                    <li>NYC Roundnet Club - Active</li>
                    <li>USA Roundnet Association - Expired</li>
                </ul>
            </div>
        </div>
    );
};

export default PersonalInfo;
