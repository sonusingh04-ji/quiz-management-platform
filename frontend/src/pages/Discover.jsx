import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Discover.css";

const Discover = () => {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [difficulty, setDifficulty] = useState("all");

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);

            const response = await api.get("/discovery");

            console.log("DISCOVER QUIZZES:", response.data);

            if (response.data.success) {
                setQuizzes(response.data.data || []);
            } else {
                setQuizzes([]);
            }
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);

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

    const getQuizId = (quiz) => {
        return quiz.id || quiz.quiz_id;
    };

    const getQuizTitle = (quiz) => {
        return quiz.title || quiz.quiz_title || "Untitled Quiz";
    };

    const getQuizDescription = (quiz) => {
        return (
            quiz.description ||
            quiz.quiz_description ||
            "Test your knowledge with this quiz."
        );
    };

    const getQuizCategory = (quiz) => {
        return quiz.category || quiz.category_name || "General";
    };

    const getQuizDifficulty = (quiz) => {
        return quiz.difficulty || "Medium";
    };

    const getQuizTime = (quiz) => {
        return (
            quiz.time_limit ||
            quiz.timeLimit ||
            quiz.duration ||
            30
        );
    };

    const filteredQuizzes = quizzes.filter((quiz) => {
        const title = getQuizTitle(quiz).toLowerCase();
        const description = getQuizDescription(quiz).toLowerCase();
        const quizCategory = getQuizCategory(quiz).toLowerCase();
        const quizDifficulty = getQuizDifficulty(quiz).toLowerCase();

        const searchMatch =
            title.includes(search.toLowerCase()) ||
            description.includes(search.toLowerCase());

        const categoryMatch =
            category === "all" ||
            quizCategory === category.toLowerCase();

        const difficultyMatch =
            difficulty === "all" ||
            quizDifficulty === difficulty.toLowerCase();

        return searchMatch && categoryMatch && difficultyMatch;
    });

    const categories = [
        ...new Set(quizzes.map((quiz) => getQuizCategory(quiz))),
    ];

    const handleStartQuiz = (quiz) => {
        const quizId = getQuizId(quiz);

        if (!quizId) {
            alert("Quiz ID not found.");
            return;
        }

        navigate(`/quiz/${quizId}`);
    };

    return (
        <div className="discover-page">

            {/* Header */}
            <header className="discover-header">
                <div>
                    <h1>🔍 Discover Quizzes</h1>
                    <p>
                        Search and explore quizzes to test your knowledge.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </header>

            {/* Search & Filters */}
            <section className="discover-filters">

                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>

                    {categories.map((item) => (
                        <option key={item} value={item.toLowerCase()}>
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

            </section>

            {/* Result Count */}
            {!loading && (
                <div className="discover-result-count">
                    Showing <strong>{filteredQuizzes.length}</strong> quiz
                    {filteredQuizzes.length !== 1 ? "zes" : ""}
                </div>
            )}

            {/* Quiz Grid */}
            {loading ? (
                <div className="discover-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading quizzes...</p>
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="no-quizzes">
                    <div className="no-quizzes-icon">📭</div>

                    <h2>No quizzes found</h2>

                    <p>
                        Try changing your search or filters.
                    </p>

                    <button
                        onClick={() => {
                            setSearch("");
                            setCategory("all");
                            setDifficulty("all");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <section className="discover-grid">

                    {filteredQuizzes.map((quiz) => (
                        <div
                            className="discover-quiz-card"
                            key={getQuizId(quiz)}
                        >

                            <div className="quiz-card-top">

                                <span className="quiz-category">
                                    {getQuizCategory(quiz)}
                                </span>

                                <span className="quiz-time">
                                    ⏱ {getQuizTime(quiz)} min
                                </span>

                            </div>

                            <h2>
                                {getQuizTitle(quiz)}
                            </h2>

                            <p className="quiz-description">
                                {getQuizDescription(quiz)}
                            </p>

                            <div className="quiz-card-info">

                                <span
                                    className={`difficulty ${getQuizDifficulty(
                                        quiz
                                    ).toLowerCase()}`}
                                >
                                    {getQuizDifficulty(quiz)}
                                </span>

                                <span>
                                    📝{" "}
                                    {quiz.question_count ||
                                        quiz.questionCount ||
                                        quiz.total_questions ||
                                        "Questions"}
                                </span>

                            </div>

                            <button
                                className="start-quiz-btn"
                                onClick={() =>
                                    handleStartQuiz(quiz)
                                }
                            >
                                Start Quiz →
                            </button>

                        </div>
                    ))}

                </section>
            )}

        </div>
    );
};

export default Discover;