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
    // QUIZZES
    // =====================================================

    const [quizzes, setQuizzes] = useState([]);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState("");

    // =====================================================
    // FILTERS
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

            // Dashboard is ONLY for students.
            // If an admin somehow reaches /dashboard,
            // send them to the admin dashboard.
            if (parsedUser.role?.toLowerCase() === "admin") {
                navigate("/admin-dashboard", { replace: true });
                return;
            }

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

        const fetchStudentDashboard = async () => {
            try {
                setStudentDashboardLoading(true);
                setStudentDashboardError("");

                const response = await api.get("/student/dashboard");

                console.log(
                    "STUDENT DASHBOARD:",
                    response.data
                );

                if (response.data.success) {
                    const dashboardData =
                        response.data.data || {};

                    setStudentStats(
                        dashboardData.statistics || {
                            available_quizzes: 0,
                            total_attempted: 0,
                            average_score: 0,
                            rank: null,
                        }
                    );

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

        const fetchQuizzes = async () => {
            try {
                setQuizLoading(true);
                setQuizError("");

                const response = await api.get("/discovery");

                console.log(
                    "DISCOVER QUIZZES:",
                    response.data
                );

                setQuizzes(response.data.data || []);
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
    // CATEGORIES
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
    // DIFFICULTIES
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
        navigate(`/quiz/${quizId}`);
    };

    // =====================================================
    // CATEGORY ICON
    // =====================================================

    const getCategoryIcon = (categoryName) => {
        const value =
            categoryName?.toLowerCase() || "";

        if (value.includes("java")) return "☕";
        if (value.includes("python")) return "🐍";

        if (
            value.includes("sql") ||
            value.includes("database")
        ) {
            return "🗄️";
        }

        if (value.includes("javascript")) return "JS";
        if (value.includes("react")) return "⚛";
        if (value.includes("spring")) return "🍃";
        if (value.includes("web")) return "🌐";

        if (
            value.includes("c++") ||
            value.includes("cpp")
        ) {
            return "C++";
        }

        return "✦";
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (!user) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <span>Loading dashboard...</span>
            </div>
        );
    }

    // =====================================================
    // STUDENT DASHBOARD
    // =====================================================

    return (
        <div className="dashboard">

            {/* =================================================
                STUDENT SIDEBAR
            ================================================= */}

            <aside className="sidebar">

                {/* BRAND */}

                <div className="brand">
                    <div className="brand-icon">
                        Q
                    </div>

                    <div>
                        <h2>Quiz Platform</h2>
                        <span>Learning System</span>
                    </div>
                </div>

                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    <button
                        className="nav-item active"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>📊</span>
                        Dashboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/discover")
                        }
                    >
                        <span>🔍</span>
                        Discover
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        <span>📝</span>
                        Quiz History
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/leaderboard")
                        }
                    >
                        <span>🏆</span>
                        Leaderboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/results")
                        }
                    >
                        <span>📈</span>
                        Results
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        <span>👤</span>
                        Profile
                    </button>

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
                    TOPBAR
                ================================================= */}

                <header className="topbar">

                    <div>
                        <h1>Student Dashboard</h1>

                        <p>
                            Discover quizzes and track your
                            learning progress.
                        </p>
                    </div>

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
                            Ready to test your knowledge
                            and improve your skills?
                        </p>
                    </div>

                    <div className="welcome-visual">

                        <div className="visual-circle visual-circle-one"></div>

                        <div className="visual-circle visual-circle-two"></div>

                        <div className="welcome-illustration">
                            ✦
                        </div>

                        <div className="floating-card floating-card-one">
                            ✓
                        </div>

                        <div className="floating-card floating-card-two">
                            100%
                        </div>

                    </div>

                </section>

                {/* =================================================
                    STUDENT STATISTICS
                ================================================= */}

                <section className="stats-grid">

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

                {/* ERROR */}

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
                                View your latest quiz
                                performance.
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

                        {studentDashboardLoading ? (

                            <div className="recent-attempt-loading">
                                Loading recent attempts...
                            </div>

                        ) : recentAttempts.length === 0 ? (

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
                                navigate("/discover")
                            }
                        >
                            Explore All
                        </button>

                    </div>

                    {/* FILTERS */}

                    <div className="quiz-filters">

                        <div className="search-box">

                            <span>🔍</span>

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

                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}

                        </select>

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

                            {difficulties.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item
                                            .charAt(0)
                                            .toUpperCase() +
                                        item.slice(1)}
                                </option>
                            ))}

                        </select>

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

                    {/* QUIZ LOADING */}

                    {quizLoading && (
                        <div className="dashboard-loading">
                            Loading available quizzes...
                        </div>
                    )}

                    {/* QUIZ ERROR */}

                    {!quizLoading && quizError && (
                        <div className="quiz-error">
                            {quizError}
                        </div>
                    )}

                    {/* NO QUIZZES */}

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

                    {/* QUIZ GRID */}

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

                                            {/* VISUAL */}

                                            <div className="quiz-visual">

                                                <div className="quiz-visual-glow"></div>

                                                <span className="quiz-visual-icon">
                                                    {getCategoryIcon(
                                                        quiz.category
                                                    )}
                                                </span>

                                                <span className="quiz-visual-label">
                                                    {quiz.category ||
                                                        "General"}
                                                </span>

                                            </div>

                                            {/* CARD TOP */}

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

                                            <h3>
                                                {quiz.title}
                                            </h3>

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