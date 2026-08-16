import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Discover.css";

const Discover = () => {
    const navigate = useNavigate();

    // =====================================================
    // QUIZZES
    // =====================================================

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [difficulty, setDifficulty] = useState("all");

    // =====================================================
    // FETCH QUIZZES
    // =====================================================

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);

            const response = await api.get("/discovery");

            console.log(
                "DISCOVER QUIZZES:",
                response.data
            );

            if (response.data.success) {
                setQuizzes(
                    response.data.data || []
                );
            } else {
                setQuizzes([]);
            }

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

            setQuizzes([]);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // QUIZ HELPERS
    // =====================================================

    const getQuizId = (quiz) => {
        return quiz.id || quiz.quiz_id;
    };

    const getQuizTitle = (quiz) => {
        return (
            quiz.title ||
            quiz.quiz_title ||
            "Untitled Quiz"
        );
    };

    const getQuizDescription = (quiz) => {
        return (
            quiz.description ||
            quiz.quiz_description ||
            "Test your knowledge with this quiz."
        );
    };

    const getQuizCategory = (quiz) => {
        return (
            quiz.category ||
            quiz.category_name ||
            "General"
        );
    };

    const getQuizDifficulty = (quiz) => {
        return (
            quiz.difficulty ||
            "Medium"
        );
    };

    const getQuizTime = (quiz) => {
        return (
            quiz.time_limit ||
            quiz.timeLimit ||
            quiz.duration ||
            30
        );
    };

    const getQuestionCount = (quiz) => {
        return (
            quiz.question_count ||
            quiz.questionCount ||
            quiz.total_questions ||
            0
        );
    };

    // =====================================================
    // CATEGORY VISUAL
    // =====================================================

    const getCategoryVisual = (categoryName) => {

        const value =
            categoryName?.toLowerCase() || "";

        if (value.includes("java")) {
            return {
                icon: "☕",
                className: "java",
                label: "Java"
            };
        }

        if (value.includes("python")) {
            return {
                icon: "🐍",
                className: "python",
                label: "Python"
            };
        }

        if (
            value.includes("sql") ||
            value.includes("database")
        ) {
            return {
                icon: "🗄️",
                className: "sql",
                label: "Database"
            };
        }

        if (
            value.includes("javascript") ||
            value === "js"
        ) {
            return {
                icon: "JS",
                className: "javascript",
                label: "JavaScript"
            };
        }

        if (value.includes("react")) {
            return {
                icon: "⚛",
                className: "react",
                label: "React"
            };
        }

        if (value.includes("web")) {
            return {
                icon: "🌐",
                className: "web",
                label: "Web Development"
            };
        }

        if (value.includes("spring")) {
            return {
                icon: "🍃",
                className: "spring",
                label: "Spring"
            };
        }

        if (
            value.includes("c++") ||
            value.includes("cpp")
        ) {
            return {
                icon: "C++",
                className: "cpp",
                label: "C++"
            };
        }

        return {
            icon: "✦",
            className: "general",
            label: categoryName || "General"
        };
    };

    // =====================================================
    // FILTER QUIZZES
    // =====================================================

    const filteredQuizzes = useMemo(() => {

        return quizzes.filter((quiz) => {

            const title =
                getQuizTitle(quiz)
                    .toLowerCase();

            const description =
                getQuizDescription(quiz)
                    .toLowerCase();

            const quizCategory =
                getQuizCategory(quiz)
                    .toLowerCase();

            const quizDifficulty =
                getQuizDifficulty(quiz)
                    .toLowerCase();

            const searchValue =
                search.trim().toLowerCase();

            const searchMatch =
                !searchValue ||
                title.includes(searchValue) ||
                description.includes(searchValue) ||
                quizCategory.includes(searchValue);

            const categoryMatch =
                category === "all" ||
                quizCategory ===
                category.toLowerCase();

            const difficultyMatch =
                difficulty === "all" ||
                quizDifficulty ===
                difficulty.toLowerCase();

            return (
                searchMatch &&
                categoryMatch &&
                difficultyMatch
            );
        });

    }, [
        quizzes,
        search,
        category,
        difficulty
    ]);

    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = useMemo(() => {

        return [
            ...new Set(
                quizzes
                    .map((quiz) =>
                        getQuizCategory(quiz)
                    )
                    .filter(Boolean)
            )
        ].sort();

    }, [quizzes]);

    // =====================================================
    // START QUIZ
    // =====================================================

    const handleStartQuiz = (quiz) => {

        const quizId =
            getQuizId(quiz);

        if (!quizId) {
            alert("Quiz ID not found.");
            return;
        }

        navigate(`/quiz/${quizId}`);
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setDifficulty("all");
    };

    // =====================================================
    // CHECK FILTER STATUS
    // =====================================================

    const hasActiveFilters =
        search.trim() !== "" ||
        category !== "all" ||
        difficulty !== "all";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="discover-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="discover-hero">

                <div className="discover-hero-content">

                    <div className="discover-badge">
                        <span>✦</span>
                        Explore & Learn
                    </div>

                    <h1>
                        Discover Your
                        <span> Next Challenge</span>
                    </h1>

                    <p>
                        Explore quizzes, test your knowledge,
                        and build your skills one challenge
                        at a time.
                    </p>

                    <div className="discover-hero-stats">

                        <div>
                            <strong>
                                {quizzes.length}
                            </strong>

                            <span>
                                Available Quizzes
                            </span>
                        </div>

                        <div>
                            <strong>
                                {categories.length}
                            </strong>

                            <span>
                                Categories
                            </span>
                        </div>

                        <div>
                            <strong>
                                100%
                            </strong>

                            <span>
                                Learning Focus
                            </span>
                        </div>

                    </div>

                </div>

                <div className="discover-hero-visual">

                    <div className="hero-orbit orbit-one"></div>
                    <div className="hero-orbit orbit-two"></div>

                    <div className="hero-main-circle">
                        <span>✦</span>
                    </div>

                    <div className="floating-topic topic-java">
                        ☕
                    </div>

                    <div className="floating-topic topic-code">
                        {"</>"}
                    </div>

                    <div className="floating-topic topic-check">
                        ✓
                    </div>

                    <div className="floating-score">
                        <strong>100%</strong>
                        <span>Ready?</span>
                    </div>

                </div>

            </section>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header className="discover-header">

                <div>

                    <div className="header-title-row">

                        <div className="header-icon">
                            🔍
                        </div>

                        <div>

                            <h2>
                                Find a Quiz
                            </h2>

                            <p>
                                Choose a challenge that
                                matches your interests.
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>

            {/* =================================================
                FILTERS
            ================================================= */}

            <section className="discover-filters">

                <div className="filter-search">

                    <span className="filter-search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by quiz title, topic..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="filter-select-wrapper">

                    <span>📂</span>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Categories
                        </option>

                        {categories.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={
                                        item.toLowerCase()
                                    }
                                >
                                    {item}
                                </option>
                            )
                        )}

                    </select>

                </div>

                <div className="filter-select-wrapper">

                    <span>🎯</span>

                    <select
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Difficulties
                        </option>

                        <option value="easy">
                            Easy
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="hard">
                            Hard
                        </option>

                    </select>

                </div>

                {hasActiveFilters && (
                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Reset
                    </button>
                )}

            </section>

            {/* =================================================
                RESULT BAR
            ================================================= */}

            {!loading && (
                <div className="discover-result-bar">

                    <div>

                        <strong>
                            {filteredQuizzes.length}
                        </strong>

                        <span>
                            {filteredQuizzes.length === 1
                                ? " quiz found"
                                : " quizzes found"}
                        </span>

                    </div>

                    {hasActiveFilters && (
                        <span className="filter-active">
                            Filters applied
                        </span>
                    )}

                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="discover-loading">

                    <div className="loading-animation">

                        <div></div>
                        <div></div>
                        <div></div>

                    </div>

                    <h3>
                        Finding quizzes...
                    </h3>

                    <p>
                        Preparing your learning challenges.
                    </p>

                </div>

            ) : filteredQuizzes.length === 0 ? (

                /* =================================================
                    EMPTY STATE
                ================================================= */

                <div className="no-quizzes">

                    <div className="empty-visual">

                        <div className="empty-circle">
                            🔍
                        </div>

                    </div>

                    <h2>
                        No quizzes found
                    </h2>

                    <p>
                        We couldn't find any quizzes
                        matching your current filters.
                    </p>

                    <button
                        onClick={clearFilters}
                    >
                        Clear All Filters
                    </button>

                </div>

            ) : (

                /* =================================================
                    QUIZ GRID
                ================================================= */

                <section className="discover-grid">

                    {filteredQuizzes.map(
                        (quiz) => {

                            const categoryName =
                                getQuizCategory(quiz);

                            const visual =
                                getCategoryVisual(
                                    categoryName
                                );

                            const difficultyName =
                                getQuizDifficulty(
                                    quiz
                                );

                            return (
                                <article
                                    className="discover-quiz-card"
                                    key={getQuizId(quiz)}
                                >

                                    {/* VISUAL HEADER */}

                                    <div
                                        className={`quiz-card-visual ${visual.className}`}
                                    >

                                        <div className="visual-shape shape-one"></div>
                                        <div className="visual-shape shape-two"></div>

                                        <span className="visual-icon">
                                            {visual.icon}
                                        </span>

                                        <span className="visual-category">
                                            {visual.label}
                                        </span>

                                        <span className="visual-difficulty">
                                            {difficultyName}
                                        </span>

                                    </div>

                                    {/* CARD BODY */}

                                    <div className="quiz-card-body">

                                        <div className="quiz-card-meta">

                                            <span>
                                                ⏱{" "}
                                                {getQuizTime(
                                                    quiz
                                                )}{" "}
                                                min
                                            </span>

                                            <span>
                                                📝{" "}
                                                {getQuestionCount(
                                                        quiz
                                                    ) ||
                                                    "Questions"}
                                            </span>

                                        </div>

                                        <h2>
                                            {getQuizTitle(
                                                quiz
                                            )}
                                        </h2>

                                        <p className="quiz-description">
                                            {getQuizDescription(
                                                quiz
                                            )}
                                        </p>

                                        <div className="quiz-card-bottom">

                                            <div className="difficulty-info">

                                                <span className="difficulty-label">
                                                    Difficulty
                                                </span>

                                                <span
                                                    className={`difficulty ${difficultyName.toLowerCase()}`}
                                                >
                                                    {difficultyName}
                                                </span>

                                            </div>

                                        </div>

                                        <button
                                            className="start-quiz-btn"
                                            onClick={() =>
                                                handleStartQuiz(
                                                    quiz
                                                )
                                            }
                                        >
                                            <span>
                                                Start Quiz
                                            </span>

                                            <span className="start-arrow">
                                                →
                                            </span>
                                        </button>

                                    </div>

                                </article>
                            );
                        }
                    )}

                </section>
            )}

        </div>
    );
};

export default Discover;