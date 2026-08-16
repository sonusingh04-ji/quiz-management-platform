import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminResults.css";

const AdminResults = () => {
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            setError("");

            // ADMIN API
            const response = await api.get("/results");

            if (response.data.success) {
                setResults(response.data.data || []);
            }

        } catch (error) {
            console.error("Admin Results Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load results."
            );

        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString();
    };

    const getStatus = (percentage) => {
        return Number(percentage || 0) >= 60
            ? "PASSED"
            : "FAILED";
    };

    const getStatusClass = (percentage) => {
        return Number(percentage || 0) >= 60
            ? "admin-result-passed"
            : "admin-result-failed";
    };

    const handleViewResult = (resultId) => {
        navigate(`/attempt-details/${resultId}`);
    };

    const totalResults = results.length;

    const passed = results.filter(
        (result) =>
            Number(result.percentage || 0) >= 60
    ).length;

    const failed = results.filter(
        (result) =>
            Number(result.percentage || 0) < 60
    ).length;

    const averageScore =
        totalResults > 0
            ? (
                results.reduce(
                    (sum, result) =>
                        sum +
                        Number(result.percentage || 0),
                    0
                ) / totalResults
            ).toFixed(2)
            : "0.00";

    if (loading) {
        return (
            <div className="admin-results-page">
                <div className="admin-results-loading">
                    Loading results...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-results-page">

            {/* HEADER */}
            <header className="admin-results-header">

                <div>
                    <h1>📊 Results & Analytics</h1>

                    <p>
                        View student quiz results and
                        performance.
                    </p>
                </div>

                <button
                    className="admin-results-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* ERROR */}
            {error && (
                <div className="admin-results-error">
                    {error}
                </div>
            )}


            {/* STATISTICS */}
            <section className="admin-results-stats">

                <div className="admin-result-stat-card">
                    <span>📝</span>

                    <div>
                        <p>Total Results</p>
                        <strong>{totalResults}</strong>
                    </div>
                </div>


                <div className="admin-result-stat-card">
                    <span>✅</span>

                    <div>
                        <p>Passed</p>
                        <strong>{passed}</strong>
                    </div>
                </div>


                <div className="admin-result-stat-card">
                    <span>❌</span>

                    <div>
                        <p>Failed</p>
                        <strong>{failed}</strong>
                    </div>
                </div>


                <div className="admin-result-stat-card">
                    <span>🎯</span>

                    <div>
                        <p>Average Score</p>
                        <strong>{averageScore}%</strong>
                    </div>
                </div>

            </section>


            {/* RESULTS TABLE */}
            <section className="admin-results-card">

                <div className="admin-results-card-header">

                    <div>
                        <h2>All Student Results</h2>

                        <p>
                            {totalResults} result
                            {totalResults !== 1 ? "s" : ""}
                            {" "}recorded on the platform.
                        </p>
                    </div>

                    <button
                        className="admin-refresh-btn"
                        onClick={fetchResults}
                    >
                        🔄 Refresh
                    </button>

                </div>


                {results.length === 0 ? (

                    <div className="admin-results-empty">
                        <div>📚</div>

                        <h3>No Results Found</h3>

                        <p>
                            No student quiz results are
                            available yet.
                        </p>
                    </div>

                ) : (

                    <div className="admin-results-table-wrapper">

                        <table className="admin-results-table">

                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Student</th>
                                <th>Quiz</th>
                                <th>Questions</th>
                                <th>Correct</th>
                                <th>Wrong</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {results.map(
                                (result, index) => {

                                    const percentage =
                                        Number(
                                            result.percentage || 0
                                        );

                                    return (
                                        <tr
                                            key={
                                                result.id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="admin-student">
                                                    <div className="admin-avatar">
                                                        {(result.first_name ||
                                                            result.email ||
                                                            "U")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {result.first_name ||
                                                                result.email ||
                                                                "Unknown User"}
                                                        </strong>

                                                        {result.email && (
                                                            <small>
                                                                {result.email}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="admin-quiz-title">
                                                {result.quiz_title ||
                                                    "Unknown Quiz"}
                                            </td>

                                            <td>
                                                {
                                                    result.total_questions
                                                }
                                            </td>

                                            <td className="admin-correct">
                                                {
                                                    result.correct_answers
                                                }
                                            </td>

                                            <td className="admin-wrong">
                                                {
                                                    result.wrong_answers
                                                }
                                            </td>

                                            <td className="admin-score">
                                                {percentage.toFixed(
                                                    2
                                                )}
                                                %
                                            </td>

                                            <td>
                                                    <span
                                                        className={`admin-result-status ${getStatusClass(
                                                            percentage
                                                        )}`}
                                                    >
                                                        {getStatus(
                                                            percentage
                                                        )}
                                                    </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    result.submitted_at
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    className="admin-view-btn"
                                                    onClick={() =>
                                                        handleViewResult(
                                                            result.attempt_id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </div>
    );
};

export default AdminResults;