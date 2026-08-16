import { useEffect, useState } from "react";
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
        passingScore: 60
    });

    // ==========================================
    // Fetch Quizzes
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
    // Edit Quiz
    // ==========================================
    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);

        setFormData({
            title: quiz.title || "",
            description: quiz.description || "",
            category: quiz.category || "",
            difficulty: quiz.difficulty || "medium",
            maxAttempts: quiz.max_attempts ?? 1,
            passingScore: quiz.passing_score ?? 60
        });
    };

    // ==========================================
    // Handle Form Change
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ==========================================
    // Update Quiz
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
                    passingScore: Number(formData.passingScore)
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
    // Delete Quiz
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
    // Publish / Unpublish
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
                    status: newStatus
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
    // Cancel Edit
    // ==========================================
    const handleCancelEdit = () => {
        setEditingQuiz(null);
    };

    // ==========================================
    // Loading
    // ==========================================
    if (loading) {
        return (
            <div className="manage-quizzes-page">
                <div className="manage-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading quizzes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-quizzes-page">

            {/* ======================================
                Header
            ====================================== */}
            <header className="manage-header">

                <div>
                    <h1>📝 Manage Quizzes</h1>

                    <p>
                        View, edit, publish or delete quizzes.
                    </p>
                </div>

                <div className="header-actions">

                    <button
                        className="back-dashboard-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="create-quiz-btn"
                        onClick={() => navigate("/create-quiz")}
                    >
                        + Create Quiz
                    </button>

                </div>

            </header>

            {/* ======================================
                Statistics
            ====================================== */}
            <section className="quiz-stats">

                <div className="quiz-stat-card">
                    <span>📚</span>

                    <div>
                        <p>Total Quizzes</p>
                        <strong>{quizzes.length}</strong>
                    </div>
                </div>

                <div className="quiz-stat-card">
                    <span>🟢</span>

                    <div>
                        <p>Published</p>

                        <strong>
                            {
                                quizzes.filter(
                                    (quiz) =>
                                        quiz.status === "published"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="quiz-stat-card">
                    <span>📝</span>

                    <div>
                        <p>Drafts</p>

                        <strong>
                            {
                                quizzes.filter(
                                    (quiz) =>
                                        quiz.status !== "published"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

            </section>

            {/* ======================================
                Quiz List
            ====================================== */}
            <section className="quiz-list-section">

                <div className="section-title">
                    <div>
                        <h2>All Quizzes</h2>

                        <p>
                            {quizzes.length} quiz
                            {quizzes.length !== 1 ? "zes" : ""}
                            {" "}available
                        </p>
                    </div>
                </div>

                {quizzes.length === 0 ? (

                    <div className="empty-quizzes">
                        <div>📭</div>

                        <h2>No quizzes found</h2>

                        <p>
                            Create your first quiz to get started.
                        </p>

                        <button
                            onClick={() => navigate("/create-quiz")}
                        >
                            + Create Quiz
                        </button>
                    </div>

                ) : (

                    <div className="quiz-table-wrapper">

                        <table className="quiz-table">

                            <thead>
                            <tr>
                                <th>Quiz</th>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>

                            {quizzes.map((quiz) => (

                                <tr key={quiz.id}>

                                    <td>
                                        <div className="quiz-name-cell">

                                            <div className="quiz-icon">
                                                📝
                                            </div>

                                            <div>
                                                <strong>
                                                    {quiz.title}
                                                </strong>

                                                <span>
                          {quiz.description ||
                              "No description"}
                          </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                          <span className="category-badge">
                          {quiz.category ||
                              "General"}
                          </span>
                                    </td>

                                    <td>
                          <span
                              className={`difficulty-badge ${String(
                                  quiz.difficulty ||
                                  "medium"
                              ).toLowerCase()}`}
                          >
                              {quiz.difficulty ||
                                  "medium"}
                          </span>
                                    </td>

                                    <td>
                                        ⏱ {quiz.duration || 30} min
                                    </td>

                                    <td>

    <span
        className={`status-badge ${
            quiz.status ===
            "published"
                ? "published"
                : "draft"
        }`}
    >
                              {quiz.status ===
                              "published"
                                  ? "Published"
                                  : "Draft"}
                          </span>

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(quiz)
                                                }
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                className={
                                                    quiz.status ===
                                                    "published"
                                                        ? "unpublish-btn"
                                                        : "publish-btn"
                                                }
                                                onClick={() =>
                                                    handleStatusChange(
                                                        quiz
                                                    )
                                                }
                                            >
                                                {quiz.status ===
                                                "published"
                                                    ? "⏸ Unpublish"
                                                    : "🚀 Publish"}
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(quiz)
                                                }
                                            >
                                                🗑 Delete
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
                Edit Modal
            ====================================== */}
            {editingQuiz && (

                <div className="modal-overlay">

                    <div className="edit-modal">

                        <div className="modal-header">

                            <div>
                                <h2>✏️ Edit Quiz</h2>

                                <p>
                                    Update quiz information.
                                </p>
                            </div>

                            <button
                                className="close-modal"
                                onClick={handleCancelEdit}
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
                                        value={
                                            formData.maxAttempts
                                        }
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
                                        value={
                                            formData.passingScore
                                        }
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
                                    Save Changes
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