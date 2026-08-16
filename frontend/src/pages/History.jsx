import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./History.css";

const History = () => {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        limit: 10,
    });

    useEffect(() => {
        fetchHistory();
    }, [page]);

    // =====================================================
    // FETCH QUIZ HISTORY
    // =====================================================
    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/attempts/history?page=${page}&limit=10`
            );

            if (response.data.success) {
                setHistory(response.data.data || []);

                setPagination({
                    total: response.data.total || 0,
                    totalPages: response.data.totalPages || 1,
                    limit: response.data.limit || 10,
                });
            }
        } catch (error) {
            console.error("History Error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load quiz history."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FORMAT TIME
    // =====================================================
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) {
            return "—";
        }

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================
    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString();
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================
    const getStatusClass = (status) => {
        return status === "PASSED"
            ? "status-passed"
            : "status-failed";
    };

    // =====================================================
    // VIEW ATTEMPT DETAILS
    // =====================================================
    const handleViewDetails = (attemptId) => {
        navigate(`/attempt-details/${attemptId}`);
    };

    // =====================================================
    // LOADING
    // =====================================================
    if (loading) {
        return (
            <div className="history-page">
                <div className="history-loading">
                    Loading quiz history...
                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================
    return (
        <div className="history-page">

            {/* ================= HEADER ================= */}
            <header className="history-header">

                <div>
                    <h1>Quiz History</h1>

                    <p>
                        View your previous quiz attempts and results.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </header>

            {/* ================= ERROR ================= */}
            {error && (
                <div className="history-error">
                    {error}
                </div>
            )}

            {/* ================= STATISTICS ================= */}
            <section className="history-stats">

                <div className="history-stat-card">
                    <span>Total Attempts</span>
                    <strong>{pagination.total}</strong>
                </div>

                <div className="history-stat-card">
                    <span>Current Page</span>
                    <strong>{page}</strong>
                </div>

                <div className="history-stat-card">
                    <span>Total Pages</span>
                    <strong>{pagination.totalPages}</strong>
                </div>

            </section>

            {/* ================= HISTORY CARD ================= */}
            <section className="history-card">

                <div className="history-card-header">

                    <div>
                        <h2>Previous Attempts</h2>

                        <p>
                            Your completed quiz attempts are shown below.
                        </p>
                    </div>

                </div>

                {/* ================= EMPTY HISTORY ================= */}
                {history.length === 0 ? (

                    <div className="empty-history">

                        <div className="empty-icon">
                            📚
                        </div>

                        <h3>
                            No Quiz Attempts Yet
                        </h3>

                        <p>
                            Complete a quiz to see your results here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Find a Quiz
                        </button>

                    </div>

                ) : (

                    /* ================= HISTORY TABLE ================= */
                    <div className="history-table-wrapper">

                        <table className="history-table">

                            <thead>

                            <tr>
                                <th>#</th>
                                <th>Quiz</th>
                                <th>Score</th>
                                <th>Correct</th>
                                <th>Wrong</th>
                                <th>Unanswered</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Action</th>
                            </tr>

                            </thead>

                            <tbody>

                            {history.map(
                                (attempt, index) => (

                                    <tr key={attempt.id}>

                                        {/* Number */}
                                        <td>
                                            {(page - 1) *
                                                pagination.limit +
                                                index +
                                                1}
                                        </td>

                                        {/* Quiz */}
                                        <td className="quiz-title">
                                            {attempt.quiz_title}
                                        </td>

                                        {/* Score */}
                                        <td className="score">
                                            {Number(
                                                attempt.percentage || 0
                                            ).toFixed(2)}
                                            %
                                        </td>

                                        {/* Correct */}
                                        <td>
                                            {attempt.correct_answers}
                                        </td>

                                        {/* Wrong */}
                                        <td>
                                            {attempt.wrong_answers}
                                        </td>

                                        {/* Unanswered */}
                                        <td>
                                            {attempt.unanswered}
                                        </td>

                                        {/* Time */}
                                        <td>
                                            {formatTime(
                                                attempt.time_taken
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td>

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        attempt.status
                                                    )}`}
                                                >
                                                    {attempt.status}
                                                </span>

                                        </td>

                                        {/* Submitted */}
                                        <td>
                                            {formatDate(
                                                attempt.submitted_at
                                            )}
                                        </td>

                                        {/* View Details */}
                                        <td>

                                            <button
                                                className="view-details-btn"
                                                onClick={() =>
                                                    handleViewDetails(
                                                        attempt.id
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* ================= PAGINATION ================= */}
            {history.length > 0 && (

                <div className="pagination">

                    <button
                        disabled={page <= 1}
                        onClick={() =>
                            setPage((current) =>
                                Math.max(current - 1, 1)
                            )
                        }
                    >
                        ← Previous
                    </button>

                    <span>
                        Page {page} of {pagination.totalPages}
                    </span>

                    <button
                        disabled={
                            page >= pagination.totalPages
                        }
                        onClick={() =>
                            setPage((current) =>
                                Math.min(
                                    current + 1,
                                    pagination.totalPages
                                )
                            )
                        }
                    >
                        Next →
                    </button>

                </div>

            )}

        </div>
    );
};

export default History;