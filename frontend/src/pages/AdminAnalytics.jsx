import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAnalytics.css";
import api from "../services/api";

function AdminAnalytics() {

    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attemptsOverTime, setAttemptsOverTime] = useState([]);
    const [popularCategories, setPopularCategories] = useState([]);
    const [studentRegistrations, setStudentRegistrations] = useState([]);
    const [averageScores, setAverageScores] = useState([]);

    // =====================================================
    // LOAD ANALYTICS
    // =====================================================

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/admin/analytics");
                const attemptsResponse =
                    await api.get("/admin/analytics/attempts-over-time");
                const categoriesResponse =
                    await api.get("/admin/analytics/popular-categories");
                const registrationsResponse =
                    await api.get("/admin/analytics/student-registrations");
                const averageScoresResponse =
                    await api.get("/admin/analytics/average-scores");


                console.log(
                    "ATTEMPTS OVER TIME:",
                    attemptsResponse.data
                );
                console.log(
                    "ANALYTICS RESPONSE:",
                    response.data
                );

                if (response.data.success) {

                    setAnalytics(
                        response.data.data
                    );
                    if (attemptsResponse.data.success) {

                        setAttemptsOverTime(
                            attemptsResponse.data.data || []
                        );
                        if (categoriesResponse.data.success) {

                            setPopularCategories(
                                categoriesResponse.data.data || []
                            );
                            if (registrationsResponse.data.success) {

                                setStudentRegistrations(
                                    registrationsResponse.data.data || []
                                );
                                if (averageScoresResponse.data.success) {

                                    setAverageScores(
                                        averageScoresResponse.data.data || []
                                    );

                                }
                            }
                        }
                    }
                } else {

                    setError(
                        response.data.message ||
                        "Failed to load analytics."
                    );

                }

            } catch (error) {

                console.error(
                    "Analytics Error:",
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

                setError(
                    error.response?.data?.message ||
                    "Failed to load analytics."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAnalytics();

    }, [navigate]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-analytics-page">

                <div className="analytics-header">

                    <div>

                        <h1>
                            📊 Analytics
                        </h1>

                        <p>
                            Loading quiz performance and platform analytics...
                        </p>

                    </div>

                </div>

            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="admin-analytics-page">

                <div className="analytics-header">

                    <div>

                        <h1>
                            📊 Analytics
                        </h1>

                        <p>
                            View quiz performance and platform analytics.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

                <div className="analytics-section">

                    <h2>
                        Unable to load analytics
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );

    }


    // =====================================================
    // ANALYTICS DATA
    // =====================================================

    const statistics =
        analytics?.statistics || {};

    const topQuizzes =
        analytics?.top_quizzes || [];

    const leastAttemptedQuizzes =
        analytics?.least_attempted_quizzes || [];
    const maxAttempts = Math.max(
        ...attemptsOverTime.map(
            item => Number(item.attempts || 0)
        ),
        1
    );


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="admin-analytics-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="analytics-header">

                <div>

                    <h1>
                        📊 Analytics
                    </h1>

                    <p>
                        View quiz performance and platform analytics.
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* =================================================
                STATISTICS CARDS
            ================================================= */}

            <div className="analytics-cards">

                {/* TOTAL QUIZZES */}

                <div className="analytics-card">

                    <span className="analytics-icon">
                        📝
                    </span>

                    <div>

                        <p>
                            Total Quizzes
                        </p>

                        <h2>
                            {statistics.total_quizzes ?? 0}
                        </h2>

                    </div>

                </div>


                {/* TOTAL ATTEMPTS */}

                <div className="analytics-card">

                    <span className="analytics-icon">
                        🎯
                    </span>

                    <div>

                        <p>
                            Total Attempts
                        </p>

                        <h2>
                            {statistics.total_attempts ?? 0}
                        </h2>

                    </div>

                </div>


                {/* AVERAGE SCORE */}

                <div className="analytics-card">

                    <span className="analytics-icon">
                        📈
                    </span>

                    <div>

                        <p>
                            Average Score
                        </p>

                        <h2>
                            {Number(
                                statistics.average_score || 0
                            ).toFixed(2)}
                            %
                        </h2>

                    </div>

                </div>


                {/* PASS RATE */}

                <div className="analytics-card">

                    <span className="analytics-icon">
                        ✅
                    </span>

                    <div>

                        <p>
                            Pass Rate
                        </p>

                        <h2>
                            {Number(
                                statistics.pass_rate || 0
                            ).toFixed(2)}
                            %
                        </h2>

                    </div>

                </div>

            </div>

            {/* =================================================
    ATTEMPTS OVER TIME
================================================= */}

            <div className="analytics-section">

                <h2>
                    📈 Attempts Over Time
                </h2>

                {attemptsOverTime.length === 0 ? (

                    <p>
                        No attempt data available yet.
                    </p>

                ) : (

                    <div className="attempts-chart">

                        {attemptsOverTime.map((item) => {

                            const attempts =
                                Number(item.attempts || 0);

                            const height =
                                (attempts / maxAttempts) * 100;

                            return (

                                <div
                                    className="attempt-bar-wrapper"
                                    key={item.date}
                                >

                                    <div className="attempt-value">
                                        {attempts}
                                    </div>

                                    <div className="attempt-bar-container">

                                        <div
                                            className="attempt-bar"
                                            style={{
                                                height: `${height}%`
                                            }}
                                        />

                                    </div>

                                    <div className="attempt-date">
                                        {item.date}
                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>
            {/* =================================================
    STUDENT REGISTRATIONS
================================================= */}

            <div className="analytics-section">

                <h2>
                    👨‍🎓 Student Registrations
                </h2>

                {studentRegistrations.length === 0 ? (

                    <p>
                        No student registration data available yet.
                    </p>

                ) : (

                    <div className="analytics-list">

                        {studentRegistrations.map((item, index) => (

                            <div
                                className="analytics-list-item"
                                key={item.date || index}
                            >

                                <div>
                                    <strong>
                                        {item.date}
                                    </strong>
                                </div>

                                <div>
                        <span>
                            Registrations:{" "}
                            {item.registrations || 0}
                        </span>
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            {/* =================================================
    AVERAGE QUIZ SCORES
================================================= */}

            <div className="analytics-section">

                <h2>
                    📊 Average Quiz Scores
                </h2>

                {averageScores.length === 0 ? (

                    <p>
                        No quiz score data available yet.
                    </p>

                ) : (

                    <div className="analytics-list">

                        {averageScores.map((quiz, index) => (

                            <div
                                className="analytics-list-item"
                                key={quiz.quiz_id}
                            >

                                <div>

                                    <strong>
                                        #{index + 1}{" "}
                                        {quiz.quiz_title}
                                    </strong>

                                </div>

                                <div>

                        <span>
                            Average Score:{" "}
                            {Number(
                                quiz.average_score || 0
                            ).toFixed(2)}
                            %
                        </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            {/* =================================================
    PASS / FAIL RATIO
================================================= */}

            <div className="analytics-section">

                <h2>
                    📊 Pass / Fail Ratio
                </h2>

                <div className="pass-fail-container">

                    <div className="pass-fail-item">

                        <div className="pass-fail-header">

                            <strong>
                                ✅ Passed
                            </strong>

                            <span>
                    {statistics.passed_attempts ?? 0}
                </span>

                        </div>

                        <div className="pass-fail-bar">

                            <div
                                className="pass-bar"
                                style={{
                                    width: `${
                                        (
                                            (statistics.passed_attempts || 0) /
                                            Math.max(
                                                (
                                                    (statistics.passed_attempts || 0) +
                                                    (statistics.failed_attempts || 0)
                                                ),
                                                1
                                            )
                                        ) * 100
                                    }%`
                                }}
                            />

                        </div>

                    </div>


                    <div className="pass-fail-item">

                        <div className="pass-fail-header">

                            <strong>
                                ❌ Failed
                            </strong>

                            <span>
                    {statistics.failed_attempts ?? 0}
                </span>

                        </div>

                        <div className="pass-fail-bar">

                            <div
                                className="fail-bar"
                                style={{
                                    width: `${
                                        (
                                            (statistics.failed_attempts || 0) /
                                            Math.max(
                                                (
                                                    (statistics.passed_attempts || 0) +
                                                    (statistics.failed_attempts || 0)
                                                ),
                                                1
                                            )
                                        ) * 100
                                    }%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>
            {/* =================================================
                TOP QUIZZES
            ================================================= */}

            <div className="analytics-section">

                <h2>
                    🏆 Top Quizzes
                </h2>

                {topQuizzes.length === 0 ? (

                    <p>
                        No quiz analytics available yet.
                    </p>

                ) : (

                    <div className="analytics-list">

                        {topQuizzes.map(
                            (quiz, index) => (

                                <div
                                    className="analytics-list-item"
                                    key={quiz.id}
                                >

                                    <div>

                                        <strong>
                                            #{index + 1}{" "}
                                            {quiz.title}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Attempts:{" "}
                                            {quiz.attempts}
                                        </span>

                                        <span>
                                            Average Score:{" "}
                                            {Number(
                                                quiz.average_score || 0
                                            ).toFixed(2)}
                                            %
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>
            {
                /* =================================================
    POPULAR CATEGORIES
================================================= */}

            <div className="analytics-section">

                <h2>
                    📚 Popular Categories
                </h2>

                {popularCategories.length === 0 ? (

                    <p>
                        No category analytics available yet.
                    </p>

                ) : (

                    <div className="analytics-list">

                        {popularCategories.map((category, index) => (

                            <div
                                className="analytics-list-item"
                                key={category.category || category.id || index}
                            >

                                <div>
                                    <strong>
                                        #{index + 1}{" "}
                                        {category.category || category.name}
                                    </strong>
                                </div>

                                <div>
                        <span>
                            Attempts:{" "}
                            {category.attempts || 0}
                        </span>
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* =================================================
                LEAST ATTEMPTED QUIZZES
            ================================================= */}

            <div className="analytics-section">

                <h2>
                    📉 Least Attempted Quizzes
                </h2>

                {leastAttemptedQuizzes.length === 0 ? (

                    <p>
                        No quiz data available.
                    </p>

                ) : (

                    <div className="analytics-list">

                        {leastAttemptedQuizzes.map(
                            (quiz, index) => (

                                <div
                                    className="analytics-list-item"
                                    key={quiz.id}
                                >

                                    <div>

                                        <strong>
                                            {index + 1}.{" "}
                                            {quiz.title}
                                        </strong>

                                    </div>

                                    <span>
                                        Attempts:{" "}
                                        {quiz.attempts}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminAnalytics;