import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Results.css";

const Results = () => {
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

            const response = await api.get(
                "/results/my-results"
            );

            if (response.data.success) {
                setResults(response.data.data || []);
            }

        } catch (error) {
            console.error("Results Error:", error);

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
                "Failed to load results."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // Statistics
    // =====================================================

    const totalAttempts = results.length;

    const passed = results.filter(
        (result) =>
            Number(result.percentage || 0) >= 60
    ).length;

    const failed = results.filter(
        (result) =>
            Number(result.percentage || 0) < 60
    ).length;

    const averageScore =
        totalAttempts > 0
            ? (
                results.reduce(
                    (sum, result) =>
                        sum +
                        Number(
                            result.percentage || 0
                        ),
                    0
                ) / totalAttempts
            ).toFixed(2)
            : "0.00";

    const highestScore =
        totalAttempts > 0
            ? Math.max(
                ...results.map(
                    (result) =>
                        Number(
                            result.percentage || 0
                        )
                )
            ).toFixed(2)
            : "0.00";

    // =====================================================
    // Format Date
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString();
    };

    // =====================================================
    // Status
    // =====================================================

    const getStatus = (percentage) => {

        return Number(percentage || 0) >= 60
            ? "PASSED"
            : "FAILED";
    };

    const getStatusClass = (percentage) => {

        return Number(percentage || 0) >= 60
            ? "result-status-passed"
            : "result-status-failed";
    };

    // =====================================================
    // View Result
    // =====================================================

    const handleViewResult = (attemptId) => {
        navigate(`/attempt-details/${attemptId}`
        );
    };

    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (
            <div className="results-page">

                <div className="results-loading">
                    Loading your results...
                </div>

            </div>
        );
    }

    // =====================================================
    // Page
    // =====================================================

    return (
        <div className="results-page">

            {/* =========================================
                Header
            ========================================= */}

            <header className="results-header">

                <div>

                    <h1>
                        📊 My Results
                    </h1>

                    <p>
                        Review your quiz performance
                        and track your progress.
                    </p>

                </div>

                <button
                    className="results-back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>

            {/* =========================================
                Error
            ========================================= */}

            {error && (

                <div className="results-error">
                    {error}
                </div>

            )}

            {/* =========================================
                Statistics
            ========================================= */}

            <section className="results-stats">

                <div className="result-stat-card">

                    <div className="result-stat-icon blue">
                        📝
                    </div>

                    <div>

                        <span>
                            Total Attempts
                        </span>

                        <strong>
                            {totalAttempts}
                        </strong>

                    </div>

                </div>


                <div className="result-stat-card">

                    <div className="result-stat-icon green">
                        🎯
                    </div>

                    <div>

                        <span>
                            Average Score
                        </span>

                        <strong>
                            {averageScore}%
                        </strong>

                    </div>

                </div>


                <div className="result-stat-card">

                    <div className="result-stat-icon orange">
                        🏆
                    </div>

                    <div>

                        <span>
                            Highest Score
                        </span>

                        <strong>
                            {highestScore}%
                        </strong>

                    </div>

                </div>


                <div className="result-stat-card">

                    <div className="result-stat-icon purple">
                        ✅
                    </div>

                    <div>

                        <span>
                            Passed
                        </span>

                        <strong>
                            {passed}
                        </strong>

                    </div>

                </div>

            </section>

            {/* =========================================
                Pass / Fail Summary
            ========================================= */}

            <section className="result-summary">

                <div className="summary-item">

                    <span>
                        Passed Quizzes
                    </span>

                    <strong className="summary-passed">
                        {passed}
                    </strong>

                </div>


                <div className="summary-item">

                    <span>
                        Failed Quizzes
                    </span>

                    <strong className="summary-failed">
                        {failed}
                    </strong>

                </div>


                <div className="summary-item">

                    <span>
                        Success Rate
                    </span>

                    <strong>
                        {totalAttempts > 0
                            ? (
                                (passed /
                                    totalAttempts) *
                                100
                            ).toFixed(2)
                            : "0.00"}
                        %
                    </strong>

                </div>

            </section>

            {/* =========================================
                Results Table
            ========================================= */}

            <section className="results-card">

                <div className="results-card-header">

                    <div>

                        <h2>
                            Quiz Results
                        </h2>

                        <p>
                            Your completed quiz
                            performance.
                        </p>

                    </div>

                </div>


                {results.length === 0 ? (

                    <div className="results-empty">

                        <div className="results-empty-icon">
                            📚
                        </div>

                        <h3>
                            No Results Yet
                        </h3>

                        <p>
                            Complete a quiz to see
                            your results here.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >
                            Find a Quiz
                        </button>

                    </div>

                ) : (

                    <div className="results-table-wrapper">

                        <table className="results-table">

                            <thead>

                            <tr>

                                <th>#</th>

                                <th>
                                    Quiz
                                </th>

                                <th>
                                    Questions
                                </th>

                                <th>
                                    Correct
                                </th>

                                <th>
                                    Wrong
                                </th>

                                <th>
                                    Score
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Submitted
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {results.map(
                                (result, index) => {

                                    const percentage =
                                        Number(
                                            result.percentage ||
                                            0
                                        );

                                    return (

                                        <tr
                                            key={
                                                result.id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td className="result-quiz-title">
                                                {
                                                    result.quiz_title
                                                }
                                            </td>

                                            <td>
                                                {
                                                    result.total_questions
                                                }
                                            </td>

                                            <td className="result-correct">
                                                {
                                                    result.correct_answers
                                                }
                                            </td>

                                            <td className="result-wrong">
                                                {
                                                    result.wrong_answers
                                                }
                                            </td>

                                            <td className="result-score">
                                                {percentage.toFixed(
                                                    2
                                                )}
                                                %
                                            </td>

                                            <td>

                                                <span
                                                    className={`result-status ${getStatusClass(
                                                        percentage
                                                    )}`}
                                                >
                                                    {
                                                        getStatus(
                                                            percentage
                                                        )
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {formatDate(
                                                    result.submitted_at
                                                )}
                                            </td>

                                            <td>

                                                <button
                                                    className="view-result-btn"
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

export default Results;