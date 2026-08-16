import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ManageQuizzes.css";

const ManageQuizzes = () => {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingQuiz, setEditingQuiz] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "medium",
        maxAttempts: 1,
        passingScore: 60,
    });

    // ==========================================
    // FETCH QUIZZES
    // ==========================================

    const fetchQuizzes = async () => {
        try {
            setLoading(true);

            const response = await api.get("/quizzes");
            const data = response.data;

            if (Array.isArray(data)) {
                setQuizzes(data);
            } else if (Array.isArray(data.data)) {
                setQuizzes(data.data);
            } else {
                setQuizzes([]);
            }
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load quizzes."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    // ==========================================
    // STATISTICS
    // ==========================================

    const statistics = useMemo(() => {
        const published = quizzes.filter(
            (quiz) => quiz.status === "published"
        ).length;

        const drafts = quizzes.length - published;

        return {
            total: quizzes.length,
            published,
            drafts,
        };
    }, [quizzes]);

    // ==========================================
    // EDIT QUIZ
    // ==========================================

    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);

        setFormData({
            title: quiz.title || "",
            description: quiz.description || "",
            category: quiz.category || "",
            difficulty: quiz.difficulty || "medium",
            maxAttempts: quiz.max_attempts ?? 1,
            passingScore: quiz.passing_score ?? 60,
        });
    };

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==========================================
    // UPDATE QUIZ
    // ==========================================

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingQuiz) {
            return;
        }

        try {
            await api.put(
                `/quizzes/${editingQuiz.id}`,
                {
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    difficulty: formData.difficulty,
                    maxAttempts: Number(formData.maxAttempts),
                    passingScore: Number(formData.passingScore),
                }
            );

            alert("Quiz updated successfully.");

            setEditingQuiz(null);

            await fetchQuizzes();
        } catch (error) {
            console.error("Update quiz error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update quiz."
            );
        }
    };

    // ==========================================
    // DELETE QUIZ
    // ==========================================

    const handleDelete = async (quiz) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${quiz.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/quizzes/${quiz.id}`);

            alert("Quiz deleted successfully.");

            await fetchQuizzes();
        } catch (error) {
            console.error("Delete quiz error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete quiz."
            );
        }
    };

    // ==========================================
    // PUBLISH / UNPUBLISH
    // ==========================================

    const handleStatusChange = async (quiz) => {
        const newStatus =
            quiz.status === "published"
                ? "draft"
                : "published";

        try {
            await api.patch(
                `/quizzes/${quiz.id}/publish`,
                {
                    status: newStatus,
                }
            );

            await fetchQuizzes();
        } catch (error) {
            console.error("Status update error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update quiz status."
            );
        }
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancelEdit = () => {
        setEditingQuiz(null);
    };

    // ==========================================
    // DIFFICULTY CLASS
    // ==========================================

    const getDifficultyClass = (difficulty) => {
        return String(difficulty || "medium").toLowerCase();
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="manage-quizzes-page">
                <div className="manage-loading">
                    <div className="loading-spinner"></div>
                    <h3>Loading your quizzes</h3>
                    <p>Please wait while we prepare your dashboard...</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="manage-quizzes-page">

            {/* ======================================
                HERO HEADER
            ====================================== */}

            <header className="manage-header">

                <div className="manage-header-content">

                    <div className="manage-title-icon">
                        📝
                    </div>

                    <div>
                        <div className="manage-eyebrow">
                            ADMINISTRATION
                        </div>

                        <h1>
                            Manage Quizzes
                        </h1>

                        <p>
                            Create, organize, publish and manage
                            your assessment library.
                        </p>
                    </div>

                </div>

                <div className="header-actions">

                    <button
                        className="back-dashboard-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>←</span>
                        Dashboard
                    </button>

                    <button
                        className="create-quiz-btn"
                        onClick={() => navigate("/create-quiz")}
                    >
                        <span>＋</span>
                        Create Quiz
                    </button>

                </div>

            </header>


            {/* ======================================
                STATISTICS
            ====================================== */}

            <section className="quiz-stats">

                <div className="quiz-stat-card">

                    <div className="quiz-stat-icon blue">
                        📚
                    </div>

                    <div className="quiz-stat-content">

                        <span className="quiz-stat-label">
                            Total Quizzes
                        </span>

                        <strong>
                            {statistics.total}
                        </strong>

                        <small>
                            Assessment library
                        </small>

                    </div>

                </div>


                <div className="quiz-stat-card">

                    <div className="quiz-stat-icon green">
                        🚀
                    </div>

                    <div className="quiz-stat-content">

                        <span className="quiz-stat-label">
                            Published
                        </span>

                        <strong>
                            {statistics.published}
                        </strong>

                        <small>
                            Available to students
                        </small>

                    </div>

                </div>


                <div className="quiz-stat-card">

                    <div className="quiz-stat-icon orange">
                        📝
                    </div>

                    <div className="quiz-stat-content">

                        <span className="quiz-stat-label">
                            Drafts
                        </span>

                        <strong>
                            {statistics.drafts}
                        </strong>

                        <small>
                            Still being prepared
                        </small>

                    </div>

                </div>

            </section>


            {/* ======================================
                QUIZ LIST
            ====================================== */}

            <section className="quiz-list-section">

                <div className="section-title">

                    <div>

                        <div className="section-title-row">

                            <h2>
                                Quiz Library
                            </h2>

                            <span className="quiz-count">
                                {quizzes.length}
                            </span>

                        </div>

                        <p>
                            Manage all quizzes created on the platform.
                        </p>

                    </div>

                    {quizzes.length > 0 && (
                        <div className="library-status">
                            <span className="status-dot"></span>
                            {statistics.published} Published
                        </div>
                    )}

                </div>


                {/* ======================================
                    EMPTY STATE
                ====================================== */}

                {quizzes.length === 0 ? (

                    <div className="empty-quizzes">

                        <div className="empty-illustration">
                            📚
                        </div>

                        <h2>
                            Your quiz library is empty
                        </h2>

                        <p>
                            Create your first quiz and start building
                            your assessment collection.
                        </p>

                        <button
                            onClick={() => navigate("/create-quiz")}
                        >
                            ＋ Create Your First Quiz
                        </button>

                    </div>

                ) : (

                    <div className="quiz-table-wrapper">

                        <table className="quiz-table">

                            <thead>

                            <tr>
                                <th>QUIZ</th>
                                <th>CATEGORY</th>
                                <th>DIFFICULTY</th>
                                <th>DURATION</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>

                            </thead>

                            <tbody>

                            {quizzes.map((quiz) => (

                                <tr key={quiz.id}>

                                    {/* QUIZ */}

                                    <td>

                                        <div className="quiz-name-cell">

                                            <div className="quiz-icon">
                                                📝
                                            </div>

                                            <div className="quiz-name-content">

                                                <strong>
                                                    {quiz.title || "Untitled Quiz"}
                                                </strong>

                                                <span>
                                                    {quiz.description ||
                                                        "No description available"}
                                                </span>

                                            </div>

                                        </div>

                                    </td>


                                    {/* CATEGORY */}

                                    <td>

                                        <span className="category-badge">
                                            {quiz.category || "General"}
                                        </span>

                                    </td>


                                    {/* DIFFICULTY */}

                                    <td>

                                        <span
                                            className={`difficulty-badge ${getDifficultyClass(
                                                quiz.difficulty
                                            )}`}
                                        >
                                            <span className="difficulty-dot"></span>

                                            {quiz.difficulty || "Medium"}
                                        </span>

                                    </td>


                                    {/* DURATION */}

                                    <td>

                                        <span className="duration-cell">
                                            <span>⏱</span>
                                            {quiz.duration || 30} min
                                        </span>

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`status-badge ${
                                                quiz.status === "published"
                                                    ? "published"
                                                    : "draft"
                                            }`}
                                        >

                                            <span className="status-indicator"></span>

                                            {quiz.status === "published"
                                                ? "Published"
                                                : "Draft"}

                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(quiz)
                                                }
                                                title="Edit quiz"
                                            >
                                                ✏️
                                                <span>Edit</span>
                                            </button>


                                            <button
                                                className={
                                                    quiz.status === "published"
                                                        ? "unpublish-btn"
                                                        : "publish-btn"
                                                }
                                                onClick={() =>
                                                    handleStatusChange(quiz)
                                                }
                                                title={
                                                    quiz.status === "published"
                                                        ? "Move to draft"
                                                        : "Publish quiz"
                                                }
                                            >
                                                {quiz.status === "published"
                                                    ? "⏸"
                                                    : "🚀"}

                                                <span>
                                                    {quiz.status === "published"
                                                        ? "Unpublish"
                                                        : "Publish"}
                                                </span>
                                            </button>


                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(quiz)
                                                }
                                                title="Delete quiz"
                                            >
                                                🗑️
                                                <span>Delete</span>
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ======================================
                EDIT MODAL
            ====================================== */}

            {editingQuiz && (

                <div
                    className="modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCancelEdit();
                        }
                    }}
                >

                    <div className="edit-modal">

                        <div className="modal-header">

                            <div className="modal-title-wrapper">

                                <div className="modal-icon">
                                    ✏️
                                </div>

                                <div>

                                    <div className="modal-eyebrow">
                                        QUIZ SETTINGS
                                    </div>

                                    <h2>
                                        Edit Quiz
                                    </h2>

                                    <p>
                                        Update your quiz information and
                                        assessment settings.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="close-modal"
                                onClick={handleCancelEdit}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleUpdate}>

                            <div className="form-group">

                                <label>
                                    Quiz Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter quiz title"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe what this quiz is about..."
                                />

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Java, Science"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Difficulty
                                    </label>

                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                    >
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

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Maximum Attempts
                                    </label>

                                    <input
                                        type="number"
                                        name="maxAttempts"
                                        min="1"
                                        value={formData.maxAttempts}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Passing Score (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="passingScore"
                                        min="0"
                                        max="100"
                                        value={formData.passingScore}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    ✓ Save Changes
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ManageQuizzes;