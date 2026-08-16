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

    // =========================================================
    // LOAD ADMIN
    // =========================================================

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            navigate("/");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            // Admin protection
            if (parsedUser.role?.toLowerCase() !== "admin") {
                navigate("/dashboard");
                return;
            }

            setUser(parsedUser);
            fetchDashboardStats();
        } catch (err) {
            console.error("Invalid user data:", err);

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            navigate("/");
        }
    }, [navigate]);

    // =========================================================
    // FETCH DASHBOARD STATISTICS
    // =========================================================

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/dashboard");

            console.log("Admin dashboard response:", response.data);

            if (response.data.success) {
                setStats(response.data.data);
            } else {
                setError(
                    response.data.message ||
                    "Unable to load dashboard statistics."
                );
            }
        } catch (err) {
            console.error("Dashboard stats error:", err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    // =========================================================
    // NAVIGATION
    // =========================================================

    const goTo = (path) => {
        navigate(path);
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (!user || loading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-card">
                    <div className="admin-spinner"></div>

                    <h2>Loading Admin Dashboard</h2>

                    <p>
                        Please wait while we load your platform statistics.
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    return (
        <div className="admin-dashboard">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">

                {/* BRAND */}

                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        Q
                    </div>

                    <div className="admin-brand-text">
                        <h2>Quiz Platform</h2>
                        <span>Administration</span>
                    </div>
                </div>


                {/* NAVIGATION */}

                <nav className="admin-nav">

                    {/* Dashboard */}

                    <button
                        type="button"
                        className="admin-nav-item active"
                        onClick={() => goTo("/admin-dashboard")}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </button>


                    {/* Create Quiz */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/create-quiz")}
                    >
                        <span className="nav-icon">➕</span>
                        <span>Create Quiz</span>
                    </button>


                    {/* Manage Quizzes */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/manage-quizzes")}
                    >
                        <span className="nav-icon">📝</span>
                        <span>Manage Quizzes</span>
                    </button>


                    {/* Manage Users */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/manage-users")}
                    >
                        <span className="nav-icon">👥</span>
                        <span>Manage Users</span>
                    </button>


                    {/* Results */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/admin/results")}
                    >
                        <span className="nav-icon">📈</span>
                        <span>Results</span>
                    </button>


                    {/* Analytics */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/admin/analytics")}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Analytics</span>
                    </button>


                    {/* Categories */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/admin/categories")}
                    >
                        <span className="nav-icon">🗂️</span>
                        <span>Manage Categories</span>
                    </button>


                    {/* Reports */}

                    <button
                        type="button"
                        className="admin-nav-item"
                        onClick={() => goTo("/reports")}
                    >
                        <span className="nav-icon">📋</span>
                        <span>Reports</span>
                    </button>

                </nav>


                {/* SIDEBAR FOOTER */}

                <div className="admin-sidebar-footer">

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        <span className="nav-icon">🚪</span>
                        <span>Logout</span>
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-main">

                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="admin-topbar">

                    <div className="admin-heading">

                        <div className="admin-breadcrumb">
                            Administration
                            <span>›</span>
                            Dashboard
                        </div>

                        <h1>Admin Dashboard</h1>

                        <p>
                            Manage your quiz platform, users and performance
                            from one place.
                        </p>

                    </div>


                    {/* ADMIN PROFILE */}

                    <div className="admin-user">

                        <div className="admin-avatar">
                            {(
                                user.full_name ||
                                user.fullName ||
                                user.name ||
                                user.email ||
                                "A"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="admin-user-info">

                            <strong>
                                {user.full_name ||
                                    user.fullName ||
                                    user.name ||
                                    "Administrator"}
                            </strong>

                            <span>Administrator</span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="admin-error">

                        <div className="admin-error-icon">
                            ⚠️
                        </div>

                        <div>
                            <strong>Unable to load statistics</strong>

                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchDashboardStats}
                        >
                            Retry
                        </button>

                    </div>
                )}


                {/* =================================================
                    WELCOME BANNER
                ================================================= */}

                <section className="admin-welcome">

                    <div className="welcome-content">

                        <span className="welcome-label">
                            ADMINISTRATION CENTER
                        </span>

                        <h2>
                            Welcome back,{" "}
                            {(
                                user.full_name ||
                                user.fullName ||
                                user.name ||
                                "Administrator"
                            ).split(" ")[0]}
                            ! 👋
                        </h2>

                        <p>
                            Keep your quiz platform organized and monitor
                            everything from your administration dashboard.
                        </p>

                    </div>

                    <div className="welcome-decoration">
                        <div className="welcome-circle circle-one"></div>
                        <div className="welcome-circle circle-two"></div>
                        <div className="welcome-grid"></div>
                    </div>

                </section>


                {/* =================================================
                    MAIN STATISTICS
                ================================================= */}

                {stats && (
                    <>
                        <section className="admin-section">

                            <div className="admin-section-heading">

                                <div>
                                    <span className="section-eyebrow">
                                        PLATFORM OVERVIEW
                                    </span>

                                    <h2>Key Statistics</h2>

                                    <p>
                                        A quick overview of your platform
                                        activity.
                                    </p>
                                </div>

                            </div>


                            <div className="admin-stats-grid">

                                {/* Students */}

                                <div className="admin-stat-card">

                                    <div className="admin-stat-icon blue">
                                        👥
                                    </div>

                                    <div className="admin-stat-content">
                                        <span>Total Students</span>

                                        <h3>
                                            {stats.total_students ?? 0}
                                        </h3>

                                        <small>
                                            Registered students
                                        </small>
                                    </div>

                                </div>


                                {/* Quizzes */}

                                <div className="admin-stat-card">

                                    <div className="admin-stat-icon purple">
                                        📝
                                    </div>

                                    <div className="admin-stat-content">
                                        <span>Total Quizzes</span>

                                        <h3>
                                            {stats.total_quizzes ?? 0}
                                        </h3>

                                        <small>
                                            Created quizzes
                                        </small>
                                    </div>

                                </div>


                                {/* Published */}

                                <div className="admin-stat-card">

                                    <div className="admin-stat-icon green">
                                        📢
                                    </div>

                                    <div className="admin-stat-content">
                                        <span>Published</span>

                                        <h3>
                                            {stats.published_quizzes ?? 0}
                                        </h3>

                                        <small>
                                            Live quizzes
                                        </small>
                                    </div>

                                </div>


                                {/* Draft */}

                                <div className="admin-stat-card">

                                    <div className="admin-stat-icon orange">
                                        📄
                                    </div>

                                    <div className="admin-stat-content">
                                        <span>Draft Quizzes</span>

                                        <h3>
                                            {stats.draft_quizzes ?? 0}
                                        </h3>

                                        <small>
                                            Unpublished quizzes
                                        </small>
                                    </div>

                                </div>


                                {/* Questions */}

                                <div className="admin-stat-card">

                                    <div className="admin-stat-icon cyan">
                                        ❓
                                    </div>

                                    <div className="admin-stat-content">
                                        <span>Total Questions</span>

                                        <h3>
                                            {stats.total_questions ?? 0}
                                        </h3>

                                        <small>
                                            Question bank
                                        </small>
                                    </div>

                                </div>


                                {/* Attempts */}

                                <div className="admin-stat-card">

                                    <div className="admin-stat-icon red">
                                        🎯
                                    </div>

                                    <div className="admin-stat-content">
                                        <span>Total Attempts</span>

                                        <h3>
                                            {stats.total_attempts ?? 0}
                                        </h3>

                                        <small>
                                            Quiz attempts
                                        </small>
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            PERFORMANCE
                        ================================================= */}

                        <section className="admin-performance-grid">

                            {/* Average Score */}

                            <div className="performance-card">

                                <div className="performance-icon purple">
                                    📊
                                </div>

                                <div>
                                    <span>Average Score</span>

                                    <h2>
                                        {stats.average_score ?? 0}%
                                    </h2>

                                    <small>
                                        Overall platform average
                                    </small>
                                </div>

                            </div>


                            {/* Passed */}

                            <div className="performance-card">

                                <div className="performance-icon green">
                                    ✅
                                </div>

                                <div>
                                    <span>Passed Attempts</span>

                                    <h2>
                                        {stats.passed_attempts ?? 0}
                                    </h2>

                                    <small>
                                        Successful attempts
                                    </small>
                                </div>

                            </div>


                            {/* Failed */}

                            <div className="performance-card">

                                <div className="performance-icon red">
                                    ❌
                                </div>

                                <div>
                                    <span>Failed Attempts</span>

                                    <h2>
                                        {stats.failed_attempts ?? 0}
                                    </h2>

                                    <small>
                                        Attempts needing improvement
                                    </small>
                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <section className="admin-section">

                            <div className="admin-section-heading">

                                <div>
                                    <span className="section-eyebrow">
                                        ADMIN TOOLS
                                    </span>

                                    <h2>Quick Actions</h2>

                                    <p>
                                        Frequently used administration tools.
                                    </p>
                                </div>

                            </div>


                            <div className="admin-actions-grid">

                                {/* Create Quiz */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo("/create-quiz")
                                    }
                                >
                                    <span className="action-icon purple">
                                        ➕
                                    </span>

                                    <div>
                                        <strong>Create Quiz</strong>

                                        <small>
                                            Create a new assessment
                                        </small>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>


                                {/* Manage Quizzes */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo("/manage-quizzes")
                                    }
                                >
                                    <span className="action-icon blue">
                                        📝
                                    </span>

                                    <div>
                                        <strong>Manage Quizzes</strong>

                                        <small>
                                            Edit and organize quizzes
                                        </small>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>


                                {/* Manage Users */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo("/manage-users")
                                    }
                                >
                                    <span className="action-icon green">
                                        👥
                                    </span>

                                    <div>
                                        <strong>Manage Users</strong>

                                        <small>
                                            View registered users
                                        </small>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>


                                {/* Analytics */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo("/admin/analytics")
                                    }
                                >
                                    <span className="action-icon orange">
                                        📊
                                    </span>

                                    <div>
                                        <strong>View Analytics</strong>

                                        <small>
                                            Monitor platform performance
                                        </small>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>


                                {/* Reports */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo("/reports")
                                    }
                                >
                                    <span className="action-icon red">
                                        📋
                                    </span>

                                    <div>
                                        <strong>Reports</strong>

                                        <small>
                                            View platform reports
                                        </small>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>


                                {/* Categories */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo("/admin/categories")
                                    }
                                >
                                    <span className="action-icon cyan">
                                        🗂️
                                    </span>

                                    <div>
                                        <strong>Categories</strong>

                                        <small>
                                            Manage quiz categories
                                        </small>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>

                            </div>

                        </section>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <section className="admin-summary-grid">

                            {/* Quiz Status */}

                            <div className="summary-card">

                                <div className="summary-icon purple">
                                    📝
                                </div>

                                <div className="summary-content">

                                    <span>Quiz Status</span>

                                    <strong>
                                        {stats.published_quizzes ?? 0}
                                    </strong>

                                    <p>
                                        Published quizzes
                                    </p>

                                    <small>
                                        {stats.draft_quizzes ?? 0} drafts
                                        waiting for publication
                                    </small>

                                </div>

                            </div>


                            {/* Attempt Performance */}

                            <div className="summary-card">

                                <div className="summary-icon green">
                                    🎯
                                </div>

                                <div className="summary-content">

                                    <span>Attempt Performance</span>

                                    <strong>
                                        {stats.passed_attempts ?? 0}
                                    </strong>

                                    <p>
                                        Passed attempts
                                    </p>

                                    <small>
                                        {stats.failed_attempts ?? 0} failed
                                        attempts
                                    </small>

                                </div>

                            </div>


                            {/* Question Bank */}

                            <div className="summary-card">

                                <div className="summary-icon blue">
                                    ❓
                                </div>

                                <div className="summary-content">

                                    <span>Question Bank</span>

                                    <strong>
                                        {stats.total_questions ?? 0}
                                    </strong>

                                    <p>
                                        Total questions
                                    </p>

                                    <small>
                                        Available across your quizzes
                                    </small>

                                </div>

                            </div>

                        </section>

                    </>
                )}

                {/* FOOTER */}

                <footer className="admin-footer">
                    <span>
                        Quiz Management Platform
                    </span>

                    <span>
                        Administration Panel
                    </span>
                </footer>

            </main>

        </div>
    );
};

export default AdminDashboard;