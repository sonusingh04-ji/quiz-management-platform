import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            navigate("/");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            // Frontend protection
            if (parsedUser.role?.toLowerCase() !== "admin") {
                navigate("/dashboard");
                return;
            }

            setUser(parsedUser);
            fetchDashboardStats();
        } catch (error) {
            console.error("Invalid user data:", error);

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            navigate("/");
        }
    }, [navigate]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/dashboard");

            console.log("Admin dashboard response:", response.data);

            if (response.data.success) {
                setStats(response.data.data);
            } else {
                setError("Unable to load dashboard statistics.");
            }
        } catch (error) {
            console.error("Dashboard stats error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    if (!user || loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* ================= SIDEBAR ================= */}

            <aside className="admin-sidebar">

                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        Q
                    </div>

                    <div>
                        <h2>Quiz Platform</h2>
                        <span>Administration</span>
                    </div>
                </div>

                <nav className="admin-nav">

                    <button
                        className="admin-nav-item active"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>📊</span>
                        Dashboard
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                    >
                        <span>👥</span>
                        Users
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate("/admin/quizzes")
                        }
                    >
                        <span>📝</span>
                        Quizzes
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate("/create-quiz")
                        }
                    >
                        <span>➕</span>
                        Create Quiz
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate("/admin/results")
                        }
                    >
                        <span>📈</span>
                        Results
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate("/admin/analytics")
                        }
                    >
                        <span>📊</span>
                        Analytics
                    </button>
                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate("/admin/categories")
                        }
                    >
                        <span>🗂️</span>
                        Categories
                    </button>
                </nav>

                <button
                    className="admin-logout"
                    onClick={handleLogout}
                >
                    <span>🚪</span>
                    Logout
                </button>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="admin-main">

                {/* TOP BAR */}

                <header className="admin-topbar">

                    <div>
                        <h1>Admin Dashboard</h1>

                        <p>
                            Manage the quiz platform and monitor
                            performance.
                        </p>
                    </div>

                    <div className="admin-user">

                        <div className="admin-avatar">
                            {user.full_name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {user.full_name}
                            </strong>

                            <span>
                                Administrator
                            </span>
                        </div>

                    </div>

                </header>


                {/* ERROR */}

                {error && (
                    <div className="admin-error">
                        ⚠️ {error}
                    </div>
                )}


                {/* ================= STATISTICS ================= */}

                {stats && (
                    <>
                        <section className="admin-stats-grid">

                            <div className="admin-stat-card">

                                <div className="admin-stat-icon blue">
                                    👥
                                </div>

                                <div>
                                    <span>Total Students</span>

                                    <h3>
                                        {stats.total_students}
                                    </h3>
                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon purple">
                                    📝
                                </div>

                                <div>
                                    <span>Total Quizzes</span>

                                    <h3>
                                        {stats.total_quizzes}
                                    </h3>
                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon green">
                                    📢
                                </div>

                                <div>
                                    <span>Published Quizzes</span>

                                    <h3>
                                        {stats.published_quizzes}
                                    </h3>
                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon orange">
                                    📄
                                </div>

                                <div>
                                    <span>Draft Quizzes</span>

                                    <h3>
                                        {stats.draft_quizzes}
                                    </h3>
                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon cyan">
                                    ❓
                                </div>

                                <div>
                                    <span>Total Questions</span>

                                    <h3>
                                        {stats.total_questions}
                                    </h3>
                                </div>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-icon red">
                                    🎯
                                </div>

                                <div>
                                    <span>Total Attempts</span>

                                    <h3>
                                        {stats.total_attempts}
                                    </h3>
                                </div>

                            </div>

                        </section>


                        {/* ================= PERFORMANCE ================= */}

                        <section className="admin-performance">

                            <div className="performance-card">

                                <div className="performance-icon">
                                    📊
                                </div>

                                <div>
                                    <span>
                                        Average Score
                                    </span>

                                    <h2>
                                        {stats.average_score}%
                                    </h2>
                                </div>

                            </div>


                            <div className="performance-card">

                                <div className="performance-icon">
                                    ✅
                                </div>

                                <div>
                                    <span>
                                        Passed Attempts
                                    </span>

                                    <h2>
                                        {stats.passed_attempts}
                                    </h2>
                                </div>

                            </div>


                            <div className="performance-card">

                                <div className="performance-icon">
                                    ❌
                                </div>

                                <div>
                                    <span>
                                        Failed Attempts
                                    </span>

                                    <h2>
                                        {stats.failed_attempts}
                                    </h2>
                                </div>

                            </div>

                        </section>


                        {/* ================= QUICK ACTIONS ================= */}

                        <section className="admin-section">

                            <div className="admin-section-header">

                                <div>
                                    <h2>
                                        Quick Actions
                                    </h2>

                                    <p>
                                        Common administration tasks.
                                    </p>
                                </div>

                            </div>


                            <div className="admin-actions-grid">

                                <button
                                    onClick={() =>
                                        navigate("/create-quiz")
                                    }
                                >
                                    <span>➕</span>

                                    <div>
                                        <strong>
                                            Create Quiz
                                        </strong>

                                        <small>
                                            Create a new quiz
                                        </small>
                                    </div>
                                </button>


                                <button
                                    onClick={() =>
                                        navigate("/admin/users")
                                    }
                                >
                                    <span>👥</span>

                                    <div>
                                        <strong>
                                            Manage Users
                                        </strong>

                                        <small>
                                            View and manage students
                                        </small>
                                    </div>
                                </button>


                                <button
                                    onClick={() =>
                                        navigate("/admin/quizzes")
                                    }
                                >
                                    <span>📝</span>

                                    <div>
                                        <strong>
                                            Manage Quizzes
                                        </strong>

                                        <small>
                                            Edit and manage quizzes
                                        </small>
                                    </div>
                                </button>
                                <button
                                    onClick={() =>
                                        navigate("/admin/categories")
                                    }
                                >
                                    <span>🗂️</span>

                                    <div>
                                        <strong>
                                            Manage Categories
                                        </strong>

                                        <small>
                                            Create and manage quiz categories
                                        </small>
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/admin/analytics")
                                    }
                                >
                                    <span>📊</span>

                                    <div>
                                        <strong>
                                            View Analytics
                                        </strong>

                                        <small>
                                            Monitor platform performance
                                        </small>
                                    </div>
                                </button>

                            </div>

                        </section>


                        {/* ================= SUMMARY ================= */}

                        <section className="admin-summary">

                            <div>
                                <span>Quiz Status</span>

                                <strong>
                                    {stats.published_quizzes} Published
                                </strong>

                                <small>
                                    {stats.draft_quizzes} Draft
                                </small>
                            </div>


                            <div>
                                <span>Attempt Performance</span>

                                <strong>
                                    {stats.passed_attempts} Passed
                                </strong>

                                <small>
                                    {stats.failed_attempts} Failed
                                </small>
                            </div>


                            <div>
                                <span>Question Bank</span>

                                <strong>
                                    {stats.total_questions}
                                </strong>

                                <small>
                                    Total Questions
                                </small>
                            </div>

                        </section>

                    </>
                )}

            </main>

        </div>
    );
};

export default AdminDashboard;