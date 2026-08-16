import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Invalid user data:", error);

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    if (!user) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }

    const initial = user.full_name
        ? user.full_name.charAt(0).toUpperCase()
        : "U";

    return (
        <div className="profile-page">

            {/* HEADER */}

            <header className="profile-header">

                <button
                    className="back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

                <h1>My Profile</h1>

                <button
                    className="profile-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            {/* PROFILE CONTENT */}

            <main className="profile-container">

                {/* PROFILE CARD */}

                <section className="profile-card">

                    <div className="profile-avatar">
                        {initial}
                    </div>

                    <h2>
                        {user.full_name || "User"}
                    </h2>

                    <span className="profile-role">
                        {user.role || "Student"}
                    </span>

                </section>


                {/* ACCOUNT INFORMATION */}

                <section className="profile-info-card">

                    <div className="profile-section-title">
                        <h2>Account Information</h2>

                        <p>
                            Your registered account details
                        </p>
                    </div>


                    <div className="profile-info-grid">

                        {/* FULL NAME */}

                        <div className="profile-info-item">

                            <div className="info-icon">
                                👤
                            </div>

                            <div>
                                <span>Full Name</span>

                                <strong>
                                    {user.full_name || "Not available"}
                                </strong>
                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="profile-info-item">

                            <div className="info-icon">
                                📧
                            </div>

                            <div>
                                <span>Email Address</span>

                                <strong>
                                    {user.email || "Not available"}
                                </strong>
                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="profile-info-item">

                            <div className="info-icon">
                                🔐
                            </div>

                            <div>
                                <span>Account Role</span>

                                <strong>
                                    {user.role || "Student"}
                                </strong>
                            </div>

                        </div>


                        {/* USER ID */}

                        <div className="profile-info-item">

                            <div className="info-icon">
                                🆔
                            </div>

                            <div>
                                <span>User ID</span>

                                <strong>
                                    {user.id || "Not available"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ACCOUNT STATUS */}

                <section className="profile-status-card">

                    <div className="status-icon">
                        ✅
                    </div>

                    <div>
                        <h3>Account Active</h3>

                        <p>
                            Your account is active and you can access
                            the quiz platform.
                        </p>
                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="profile-actions-card">

                    <h2>Quick Actions</h2>

                    <div className="profile-actions">

                        <button
                            onClick={() => navigate("/history")}
                        >
                            📝 Quiz History
                        </button>

                        <button
                            onClick={() => navigate("/results")}
                        >
                            📊 My Results
                        </button>

                        <button
                            onClick={() => navigate("/leaderboard")}
                        >
                            🏆 Leaderboard
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Profile;
