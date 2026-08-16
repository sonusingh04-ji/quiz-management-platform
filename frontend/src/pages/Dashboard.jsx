import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import api from "../services/api";

const Dashboard = () => {
    const navigate = useNavigate();

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(null);

    // =====================================================
    // STUDENT DASHBOARD STATISTICS
    // =====================================================

    const [studentStats, setStudentStats] = useState({
        available_quizzes: 0,
        total_attempted: 0,
        average_score: 0,
        rank: null,
    });

    // =====================================================
    // RECENT ATTEMPTS
    // =====================================================

    const [recentAttempts, setRecentAttempts] = useState([]);

    const [studentDashboardLoading, setStudentDashboardLoading] =
        useState(false);

    const [studentDashboardError, setStudentDashboardError] =
        useState("");

    // =====================================================
    // QUIZ DATA
    // =====================================================

    const [quizzes, setQuizzes] = useState([]);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState("");

    // =====================================================
    // DISCOVERY FILTERS
    // =====================================================

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");

    // =====================================================
    // LOAD USER
    // =====================================================

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

    // =====================================================
    // LOAD STUDENT DASHBOARD
    // =====================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        const isAdmin =
            user.role?.toLowerCase() === "admin";

        if (isAdmin) {
            return;
        }

        const fetchStudentDashboard = async () => {
            try {
                setStudentDashboardLoading(true);
                setStudentDashboardError("");

                const response = await api.get(
                    "/student/dashboard"
                );

                console.log(
                    "STUDENT DASHBOARD:",
                    response.data
                );

                if (response.data.success) {
                    const dashboardData =
                        response.data.data || {};

                    // -----------------------------
                    // Statistics
                    // -----------------------------

                    setStudentStats(
                        dashboardData.statistics || {
                            available_quizzes: 0,
                            total_attempted: 0,
                            average_score: 0,
                            rank: null,
                        }
                    );

                    // -----------------------------
                    // Recent Attempts
                    // -----------------------------

                    setRecentAttempts(
                        dashboardData.recent_attempts || []
                    );
                }
            } catch (error) {
                console.error(
                    "Student Dashboard Error:",
                    error
                );

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/");
                    return;
                }

                setStudentDashboardError(
                    error.response?.data?.message ||
                    "Failed to load dashboard statistics."
                );
            } finally {
                setStudentDashboardLoading(false);
            }
        };

        fetchStudentDashboard();
    }, [user, navigate]);

    // =====================================================
    // LOAD QUIZZES
    // =====================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        const isAdmin =
            user.role?.toLowerCase() === "admin";

        if (isAdmin) {
            return;
        }

        const fetchQuizzes = async () => {
            try {
                setQuizLoading(true);
                setQuizError("");

                const response = await api.get(
                    "/discovery"
                );

                console.log(
                    "DISCOVER QUIZZES:",
                    response.data
                );

                setQuizzes(
                    response.data.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch quizzes:",
                    error
                );

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/");
                    return;
                }

                setQuizError(
                    error.response?.data?.message ||
                    "Failed to load quizzes."
                );
            } finally {
                setQuizLoading(false);
            }
        };

        fetchQuizzes();
    }, [user, navigate]);

    // =====================================================
    // FILTER QUIZZES
    // =====================================================

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter((quiz) => {
            const matchesSearch =
                !search.trim() ||
                quiz.title
                    ?.toLowerCase()
                    .includes(
                        search.trim().toLowerCase()
                    );

            const matchesCategory =
                !category ||
                quiz.category === category;

            const matchesDifficulty =
                !difficulty ||
                quiz.difficulty === difficulty;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesDifficulty
            );
        });
    }, [
        quizzes,
        search,
        category,
        difficulty,
    ]);

    // =====================================================
    // UNIQUE CATEGORIES
    // =====================================================

    const categories = useMemo(() => {
        return [
            ...new Set(
                quizzes
                    .map((quiz) => quiz.category)
                    .filter(Boolean)
            ),
        ].sort();
    }, [quizzes]);

    // =====================================================
    // UNIQUE DIFFICULTIES
    // =====================================================

    const difficulties = useMemo(() => {
        return [
            ...new Set(
                quizzes
                    .map((quiz) => quiz.difficulty)
                    .filter(Boolean)
            ),
        ].sort();
    }, [quizzes]);

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClearFilters = () => {
        setSearch("");
        setCategory("");
        setDifficulty("");
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    // =====================================================
    // START QUIZ
    // =====================================================

    const handleStartQuiz = (quizId) => {
        console.log(
            "Starting quiz:",
            quizId
        );

        navigate(`/quiz/${quizId}`);
    };

    // =====================================================
    // LOADING USER
    // =====================================================

    if (!user) {
        return (
            <div className="dashboard-loading">
                Loading...
            </div>
        );
    }

    // =====================================================
    // ROLE
    // =====================================================

    const isAdmin =
        user.role?.toLowerCase() === "admin";

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <div className="dashboard">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="sidebar">

                {/* BRAND */}

                <div className="brand">

                    <div className="brand-icon">
                        Q
                    </div>

                    <div>
                        <h2>
                            Quiz Platform
                        </h2>

                        <span>
                            Management System
                        </span>
                    </div>

                </div>

                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    {/* DASHBOARD */}

                    <button
                        className="nav-item active"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>📊</span>
                        Dashboard
                    </button>

                    {/* ADMIN MENU */}

                    {isAdmin && (
                        <>
                            <button
                                className="nav-item"
                                onClick={() =>
                                    navigate(
                                        "/create-quiz"
                                    )
                                }
                            >
                                <span>➕</span>
                                Create Quiz
                            </button>

                            <button
                                className="nav-item"
                                onClick={() => navigate("/manage-quizzes")}
                            >
                                <span>📝</span>
                                Manage Quizzes
                            </button>

                            <button
                                className="nav-item"
                                onClick={() => navigate("/manage-users")}
                            >
                                <span>👥</span>
                                Manage Users
                            </button>

                            <button
                                className="nav-item"
                                onClick={() => navigate("/admin/results")}
                            >
                                <span>📋</span>
                                Results
                            </button>

                            <button
                                className="nav-item"
                                onClick={() => navigate("/admin/analytics")}
                            >
                                <span>📊</span>
                                Analytics
                            </button>

                            <button
                                className="nav-item"
                                onClick={() => navigate("/admin/categories")}
                            >
                                <span>📂</span>
                                Manage Categories
                            </button>


                            <button
                                className="nav-item"
                                onClick={() => navigate("/reports")}
                            >
                                <span>📋</span>
                                Reports
                            </button>
                        </>
                    )}

                    {/* STUDENT MENU */}

                    {!isAdmin && (
                        <>
                            <button
                                className="nav-item"
                                onClick={() => navigate("/discover")}
                            >
                                <span>🔍</span>
                                Discover
                            </button>

                            <button
                                className="nav-item"
                                onClick={() =>
                                    navigate(
                                        "/history"
                                    )
                                }

                            >
                                <span>📝</span>
                                Quiz History
                            </button>

                            <button
                                className="nav-item"
                                onClick={() =>
                                    navigate(
                                        "/leaderboard"
                                    )
                                }
                            >
                                <span>🏆</span>
                                Leaderboard
                            </button>

                            <button
                                className="nav-item"
                                onClick={() =>
                                    navigate(
                                        "/results"
                                    )
                                }
                            >
                                <span>📈</span>
                                Results
                            </button>

                            <button
                                className="nav-item"
                                onClick={() => navigate("/profile")}
                            >
                                <span>👤</span>
                                Profile
                            </button>
                        </>
                    )}

                </nav>

                {/* LOGOUT */}

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <span>🚪</span>
                    Logout
                </button>

            </aside>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="dashboard-main">

                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="topbar">

                    <div>

                        <h1>
                            {isAdmin
                                ? "Admin Dashboard"
                                : "Dashboard"}
                        </h1>

                        <p>
                            {isAdmin
                                ? "Manage quizzes, questions, users and platform activity."
                                : "Discover quizzes and track your learning progress."}
                        </p>

                    </div>

                    {/* USER INFO */}

                    <div className="user-info">

                        <div className="avatar">
                            {user.full_name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>

                            <strong>
                                {user.full_name}
                            </strong>

                            <span>
                                {user.role}
                            </span>

                        </div>

                    </div>

                </header>

                {/* =================================================
                    WELCOME CARD
                ================================================= */}

                <section className="welcome-card">

                    <div>

                        <h2>
                            Welcome back,{" "}
                            {user.full_name}! 👋
                        </h2>

                        <p>
                            {isAdmin
                                ? "Manage your quiz platform from one place."
                                : "Ready to test your knowledge and improve your skills?"}
                        </p>

                    </div>

                    <div className="welcome-icon">
                        {isAdmin
                            ? "⚙️"
                            : "🧠"}
                    </div>

                </section>

                {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

                {isAdmin && (
                    <>

                        {/* ADMIN STATISTICS */}

                        <section className="stats-grid">

                            {/* TOTAL QUIZZES */}

                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    📝
                                </div>

                                <div>

                                    <span>
                                        Total Quizzes
                                    </span>

                                    <h3>
                                        12
                                    </h3>

                                </div>

                            </div>

                            {/* TOTAL STUDENTS */}

                            <div className="stat-card">

                                <div className="stat-icon green">
                                    👥
                                </div>

                                <div>

                                    <span>
                                        Total Students
                                    </span>

                                    <h3>
                                        8
                                    </h3>

                                </div>

                            </div>

                            {/* TOTAL ATTEMPTS */}

                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    🎯
                                </div>

                                <div>

                                    <span>
                                        Total Attempts
                                    </span>

                                    <h3>
                                        24
                                    </h3>

                                </div>

                            </div>

                            {/* PUBLISHED QUIZZES */}

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    📊
                                </div>

                                <div>

                                    <span>
                                        Published Quizzes
                                    </span>

                                    <h3>
                                        8
                                    </h3>

                                </div>

                            </div>

                        </section>

                        {/* ADMIN ACTIONS */}

                        <section className="content-section">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Admin Actions
                                    </h2>

                                    <p>
                                        Manage your quiz platform.
                                    </p>

                                </div>

                            </div>

                            <div className="quiz-grid">

                                {/* CREATE QUIZ */}

                                <div className="quiz-card">

                                    <div className="quiz-card-top">

                                        <span className="quiz-category">
                                            Quiz
                                        </span>

                                    </div>

                                    <h3>
                                        Create New Quiz
                                    </h3>

                                    <p>
                                        Create a new quiz and add
                                        questions for students.
                                    </p>

                                    <div className="quiz-footer">

                                        <span>
                                            Admin
                                        </span>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/create-quiz"
                                                )
                                            }
                                        >
                                            Create Quiz
                                        </button>

                                    </div>

                                </div>

                                {/* MANAGE QUIZZES */}

                                <div className="quiz-card">

                                    <div className="quiz-card-top">

                                        <span className="quiz-category">
                                            Management
                                        </span>

                                    </div>

                                    <h3>
                                        Manage Quizzes
                                    </h3>

                                    <p>
                                        View, edit, publish or delete
                                        existing quizzes.
                                    </p>

                                    <div className="quiz-footer">

                                        <span>
                                            Admin
                                        </span>

                                        <button>
                                            Manage
                                        </button>

                                    </div>

                                </div>

                                {/* RESULTS */}

                                <div className="quiz-card">

                                    <div className="quiz-card-top">

                                        <span className="quiz-category">
                                            Analytics
                                        </span>

                                    </div>

                                    <h3>
                                        Results & Analytics
                                    </h3>

                                    <p>
                                        View student attempts,
                                        results and performance.
                                    </p>

                                    <div className="quiz-footer">

                                        <span>
                                            Admin
                                        </span>

                                        <button
                                            onClick={() =>
                                                navigate("/admin/results")
                                            }
                                        >
                                            View Results
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </>
                )}

                {/* =================================================
                    STUDENT DASHBOARD
                ================================================= */}

                {!isAdmin && (
                    <>

                        {/* =================================================
                            STUDENT STATISTICS
                        ================================================= */}

                        <section className="stats-grid">

                            {/* AVAILABLE QUIZZES */}

                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    📝
                                </div>

                                <div>

                                    <span>
                                        Available Quizzes
                                    </span>

                                    <h3>
                                        {studentDashboardLoading
                                            ? "..."
                                            : studentStats.available_quizzes}
                                    </h3>

                                </div>

                            </div>

                            {/* COMPLETED */}

                            <div className="stat-card">

                                <div className="stat-icon green">
                                    ✅
                                </div>

                                <div>

                                    <span>
                                        Completed
                                    </span>

                                    <h3>
                                        {studentDashboardLoading
                                            ? "..."
                                            : studentStats.total_attempted}
                                    </h3>

                                </div>

                            </div>

                            {/* AVERAGE SCORE */}

                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    🎯
                                </div>

                                <div>

                                    <span>
                                        Average Score
                                    </span>

                                    <h3>
                                        {studentDashboardLoading
                                            ? "..."
                                            : `${Number(
                                                studentStats.average_score || 0
                                            ).toFixed(2)}%`}
                                    </h3>

                                </div>

                            </div>

                            {/* RANK */}

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    🏆
                                </div>

                                <div>

                                    <span>
                                        Rank
                                    </span>

                                    <h3>
                                        {studentDashboardLoading
                                            ? "..."
                                            : studentStats.rank
                                                ? `#${studentStats.rank}`
                                                : "--"}
                                    </h3>

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            DASHBOARD STATISTICS ERROR
                        ================================================= */}

                        {studentDashboardError && (
                            <div className="quiz-error">
                                {studentDashboardError}
                            </div>
                        )}

                        {/* =================================================
                            RECENT ATTEMPTS
                        ================================================= */}

                        <section className="content-section">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Recent Attempts
                                    </h2>

                                    <p>
                                        View your latest quiz performance.
                                    </p>

                                </div>

                                <button
                                    className="view-all-btn"
                                    onClick={() =>
                                        navigate("/history")
                                    }
                                >
                                    View All
                                </button>

                            </div>

                            <div className="recent-attempts-card">

                                {/* LOADING */}

                                {studentDashboardLoading ? (

                                    <div className="recent-attempt-loading">
                                        Loading recent attempts...
                                    </div>

                                ) : recentAttempts.length === 0 ? (

                                    /* EMPTY */

                                    <div className="recent-attempt-empty">

                                        <div className="empty-icon">
                                            📝
                                        </div>

                                        <h3>
                                            No attempts yet
                                        </h3>

                                        <p>
                                            Complete a quiz to see
                                            your performance here.
                                        </p>

                                    </div>

                                ) : (

                                    /* ATTEMPTS */

                                    <div className="attempt-list">

                                        {recentAttempts.map(
                                            (attempt, index) => {

                                                const score =
                                                    Number(
                                                        attempt.percentage || 0
                                                    );

                                                const isPassed =
                                                    score >= 60;

                                                return (
                                                    <div
                                                        className="attempt-row"
                                                        key={`${attempt.quiz_id}-${attempt.submitted_at}-${index}`}
                                                    >

                                                        {/* ATTEMPT INFO */}

                                                        <div className="attempt-info">

                                                            <div className="attempt-icon">
                                                                📝
                                                            </div>

                                                            <div>

                                                                <h3>
                                                                    {attempt.quiz_title ||
                                                                        "Untitled Quiz"}
                                                                </h3>

                                                                <span>
                                                                    {attempt.submitted_at
                                                                        ? new Date(
                                                                            attempt.submitted_at
                                                                        ).toLocaleString()
                                                                        : "Date unavailable"}
                                                                </span>

                                                            </div>

                                                        </div>

                                                        {/* RESULT */}

                                                        <div className="attempt-result">

                                                            <strong
                                                                className={
                                                                    isPassed
                                                                        ? "score-pass"
                                                                        : "score-fail"
                                                                }
                                                            >
                                                                {score.toFixed(2)}%
                                                            </strong>

                                                            <span
                                                                className={
                                                                    isPassed
                                                                        ? "status-pass"
                                                                        : "status-fail"
                                                                }
                                                            >
                                                                {isPassed
                                                                    ? "PASSED"
                                                                    : "FAILED"}
                                                            </span>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                )}

                            </div>

                        </section>

                        {/* =================================================
                            QUIZ DISCOVERY
                        ================================================= */}

                        <section className="content-section">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Discover Quizzes
                                    </h2>

                                    <p>
                                        Search and filter quizzes
                                        before starting.
                                    </p>

                                </div>

                                <button
                                    className="view-all-btn"
                                    onClick={() =>
                                        navigate(
                                            "/history"
                                        )
                                    }
                                >
                                    Quiz History
                                </button>

                            </div>

                            {/* =================================================
                                SEARCH + FILTERS
                            ================================================= */}

                            <div className="quiz-filters">

                                {/* SEARCH */}

                                <div className="search-box">

                                    <span>
                                        🔍
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Search quizzes..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                {/* CATEGORY */}

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Categories
                                    </option>

                                    {categories.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}

                                </select>

                                {/* DIFFICULTY */}

                                <select
                                    value={difficulty}
                                    onChange={(e) =>
                                        setDifficulty(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Difficulties
                                    </option>

                                    {difficulties.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    item.slice(1)}
                                            </option>
                                        )
                                    )}

                                </select>

                                {/* CLEAR */}

                                {(search ||
                                    category ||
                                    difficulty) && (

                                    <button
                                        className="clear-filter-btn"
                                        onClick={
                                            handleClearFilters
                                        }
                                    >
                                        Clear
                                    </button>

                                )}

                            </div>

                            {/* =================================================
                                LOADING
                            ================================================= */}

                            {quizLoading && (

                                <div className="dashboard-loading">
                                    Loading available quizzes...
                                </div>

                            )}

                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {!quizLoading &&
                                quizError && (

                                    <div className="quiz-error">
                                        {quizError}
                                    </div>

                                )}

                            {/* =================================================
                                NO QUIZZES
                            ================================================= */}

                            {!quizLoading &&
                                !quizError &&
                                filteredQuizzes.length === 0 && (

                                    <div className="quiz-card">

                                        <h3>
                                            No quizzes found
                                        </h3>

                                        <p>
                                            Try changing your
                                            search or filters.
                                        </p>

                                        {(search ||
                                            category ||
                                            difficulty) && (

                                            <button
                                                onClick={
                                                    handleClearFilters
                                                }
                                            >
                                                Clear Filters
                                            </button>

                                        )}

                                    </div>

                                )}

                            {/* =================================================
                                QUIZ CARDS
                            ================================================= */}

                            {!quizLoading &&
                                !quizError &&
                                filteredQuizzes.length > 0 && (

                                    <div className="quiz-grid">

                                        {filteredQuizzes.map(
                                            (quiz) => (

                                                <div
                                                    className="quiz-card"
                                                    key={quiz.id}
                                                >

                                                    {/* CATEGORY + TIME */}

                                                    <div className="quiz-card-top">

                                                        <span className="quiz-category">
                                                            {quiz.category ||
                                                                "General"}
                                                        </span>

                                                        <span className="quiz-time">
                                                            ⏱{" "}
                                                            {quiz.duration ||
                                                                30}{" "}
                                                            min
                                                        </span>

                                                    </div>

                                                    {/* TITLE */}

                                                    <h3>
                                                        {quiz.title}
                                                    </h3>

                                                    {/* DESCRIPTION */}

                                                    <p>
                                                        {quiz.description ||
                                                            "Test your knowledge with this quiz."}
                                                    </p>

                                                    {/* FOOTER */}

                                                    <div className="quiz-footer">

                                                        <span>
                                                            {quiz.difficulty
                                                                ? quiz.difficulty
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                quiz.difficulty.slice(
                                                                    1
                                                                )
                                                                : "General"}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                handleStartQuiz(
                                                                    quiz.id
                                                                )
                                                            }
                                                        >
                                                            Start Quiz
                                                        </button>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                        </section>

                    </>
                )}

                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <section className="account-card">

                    <div>

                        <h2>
                            Account Information
                        </h2>

                        <p>
                            Email: {user.email}
                        </p>

                        <p>
                            Role:{" "}
                            <span className="role-badge">
                                {user.role}
                            </span>
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Dashboard;