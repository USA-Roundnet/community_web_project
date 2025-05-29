const PersonalInfo = ({ user }) => {
    return (
        <div className="personal-info">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="info-item">
                <strong>Name:</strong> {user.firstName} {user.lastName}
            </div>
            <div className="info-item">
                <strong>Email:</strong> {user.email}
            </div>
            <div className="info-item">
                <strong>Phone Number:</strong> {user.phoneNumber}
            </div>
            <div className="info-item">
                <strong>City:</strong> {user.city}
            </div>
            <div className="info-item">
                <strong>State:</strong> {user.state}
            </div>
            <div className="info-item">
                <strong>Country:</strong> {user.country}
            </div>
        </div>
    );
};

export default PersonalInfo;