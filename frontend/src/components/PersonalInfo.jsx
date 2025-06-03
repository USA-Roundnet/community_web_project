const PersonalInfo = ({ user }) => {
    return (
        <div className="personal-info">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="">
                <h2>
                    {user.firstName} {user.lastName}
                </h2>
                <p>
                    {user.city}, {user.state}, {user.country}
                </p>
            </div>
            <div className="info-item">
                <strong>Email:</strong> {user.email}
            </div>
            <div className="info-item">
                <strong>Phone Number:</strong> {user.phoneNumber}
            </div>
            <h2 className="text-lg font-bold mb-2">Memberships</h2>
            <ul>
                <li>NYC Roundnet Club - Active</li>
                <li>USA Roundnet Association - Expired</li>
            </ul>
        </div>
    );
};

export default PersonalInfo;
