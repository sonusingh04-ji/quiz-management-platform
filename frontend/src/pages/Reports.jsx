import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Reports.css";

const Reports = () => {
    const [attempts, setAttempts] = useState([]);
    const [users, setUsers] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                attemptsResponse,
                usersResponse,
                quizzesResponse
            ] = await Promise.all([
                api.get("/admin/reports/attempts"),
                api.get("/admin/reports/users"),
                api.get("/admin/reports/quizzes")
            ]);

            setAttempts(
                attemptsResponse.data?.data || []
            );

            setUsers(
                usersResponse.data?.data || []
            );

            setQuizzes(
                quizzesResponse.data?.data || []
            );

        } catch (err) {
            console.error("Reports loading error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // ==========================================
    // Statistics
    // ==========================================

    const statistics = useMemo(() => {

        const completedAttempts = attempts.filter(
            (attempt) =>
                attempt.status !== "IN_PROGRESS"
        );

        const passedAttempts = completedAttempts.filter(
            (attempt) =>
                attempt.status === "PASSED"
        );

        const failedAttempts = completedAttempts.filter(
            (attempt) =>
                attempt.status === "FAILED"
        );

        const averageScore =
            completedAttempts.length > 0
                ? completedAttempts.reduce(
                (sum, attempt) =>
                    sum +
                    Number(attempt.percentage || 0),
                0
            ) / completedAttempts.length
                : 0;

        return {
            totalQuizzes: quizzes.length,

            publishedQuizzes: quizzes.filter(
                (quiz) =>
                    quiz.status === "published"
            ).length,

            totalStudents: users.filter(
                (user) =>
                    user.role === "student"
            ).length,

            totalAttempts:
            completedAttempts.length,

            passedAttempts:
            passedAttempts.length,

            failedAttempts:
            failedAttempts.length,

            averageScore:
                averageScore.toFixed(2)
        };

    }, [attempts, users, quizzes]);

    // ==========================================
    // Helpers
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatTime = (seconds) => {

        if (!seconds && seconds !== 0) {
            return "-";
        }

        const totalSeconds = Number(seconds);

        const minutes =
            Math.floor(totalSeconds / 60);

        const remainingSeconds =
            totalSeconds % 60;

        return `${minutes}m ${remainingSeconds}s`;
    };

    // ==========================================
    // Export
    // ==========================================

    const exportReport = async (type) => {

        try {

            const response =
                await api.get(
                    `/admin/reports/export/${type}`
                );

            const data =
                response.data?.data || [];

            if (!data.length) {
                alert("No data available to export.");
                return;
            }

            const headers =
                Object.keys(data[0]);

            const csvRows = [
                headers.join(",")
            ];

            data.forEach((row) => {

                const values =
                    headers.map((header) => {

                        const value =
                            row[header] ?? "";

                        return `"${String(value)
                            .replace(/"/g, '""')}"`;
                    });

                csvRows.push(
                    values.join(",")
                );
            });

            const csvContent =
                csvRows.join("\n");

            const blob =
                new Blob(
                    [csvContent],
                    {
                        type: "text/csv;charset=utf-8;"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${type}-report.csv`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Export report error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to export report."
            );
        }
    };

    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (
            <div className="reports-page">

                <div className="reports-loading">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading Reports...
                    </h2>

                    <p>
                        Please wait while we fetch
                        the latest platform data.
                    </p>

                </div>

            </div>
        );
    }

    // ==========================================
    // Error
    // ==========================================

    if (error) {

        return (
            <div className="reports-page">

                <div className="reports-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Reports
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchReports}
                        className="retry-button"
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (

        <div className="reports-page">

            {/* ==================================
                Header
            ================================== */}

            <div className="reports-header">

                <div>

                    <h1>
                        📊 Admin Reports
                    </h1>

                    <p>
                        View platform activity,
                        student performance and
                        quiz analytics.
                    </p>

                </div>

                <div className="header-actions">

                    <Link
                        to="/dashboard"
                        className="back-button"
                    >
                        ← Dashboard
                    </Link>

                    <button
                        className="refresh-button"
                        onClick={fetchReports}
                    >
                        🔄 Refresh
                    </button>

                </div>

            </div>


            {/* ==================================
                Statistics
            ================================== */}

            <div className="report-stats">

                <div className="report-stat-card">

                    <div className="stat-icon purple">
                        📝
                    </div>

                    <div>

                        <span>
                            Total Quizzes
                        </span>

                        <strong>
                            {statistics.totalQuizzes}
                        </strong>

                    </div>

                </div>


                <div className="report-stat-card">

                    <div className="stat-icon blue">
                        👨‍🎓
                    </div>

                    <div>

                        <span>
                            Total Students
                        </span>

                        <strong>
                            {statistics.totalStudents}
                        </strong>

                    </div>

                </div>


                <div className="report-stat-card">

                    <div className="stat-icon orange">
                        🎯
                    </div>

                    <div>

                        <span>
                            Total Attempts
                        </span>

                        <strong>
                            {statistics.totalAttempts}
                        </strong>

                    </div>

                </div>


                <div className="report-stat-card">

                    <div className="stat-icon green">
                        📈
                    </div>

                    <div>

                        <span>
                            Average Score
                        </span>

                        <strong>
                            {statistics.averageScore}%
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================
                Performance Summary
            ================================== */}

            <div className="summary-section">

                <div className="summary-card">

                    <div className="summary-header">
                        <span className="summary-icon">
                            🟢
                        </span>

                        <div>
                            <h3>
                                Passed Attempts
                            </h3>

                            <p>
                                Successfully completed
                            </p>
                        </div>
                    </div>

                    <strong className="success-number">
                        {statistics.passedAttempts}
                    </strong>

                </div>


                <div className="summary-card">

                    <div className="summary-header">
                        <span className="summary-icon">
                            🔴
                        </span>

                        <div>
                            <h3>
                                Failed Attempts
                            </h3>

                            <p>
                                Attempts below passing score
                            </p>
                        </div>
                    </div>

                    <strong className="failed-number">
                        {statistics.failedAttempts}
                    </strong>

                </div>


                <div className="summary-card">

                    <div className="summary-header">
                        <span className="summary-icon">
                            📢
                        </span>

                        <div>
                            <h3>
                                Published Quizzes
                            </h3>

                            <p>
                                Currently available
                            </p>
                        </div>
                    </div>

                    <strong className="published-number">
                        {statistics.publishedQuizzes}
                    </strong>

                </div>

            </div>


            {/* ==================================
                Quiz Reports
            ================================== */}

            <section className="report-section">

                <div className="section-header">

                    <div>

                        <h2>
                            📚 Quiz Performance
                        </h2>

                        <p>
                            Performance summary for
                            every quiz.
                        </p>

                    </div>

                    <button
                        className="export-button"
                        onClick={() =>
                            exportReport("quizzes")
                        }
                    >
                        ⬇ Export CSV
                    </button>

                </div>


                <div className="table-wrapper">

                    <table className="reports-table">

                        <thead>

                        <tr>

                            <th>
                                Quiz
                            </th>

                            <th>
                                Created By
                            </th>

                            <th>
                                Questions
                            </th>

                            <th>
                                Attempts
                            </th>

                            <th>
                                Average Score
                            </th>

                            <th>
                                Pass Rate
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {quizzes.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-cell"
                                >
                                    No quiz report data
                                    available.
                                </td>

                            </tr>

                        ) : (

                            quizzes.map((quiz) => (

                                <tr
                                    key={quiz.quiz_id}
                                >

                                    <td>

                                        <strong>
                                            {quiz.title}
                                        </strong>

                                    </td>

                                    <td>
                                        {quiz.created_by ||
                                            "Unknown"}
                                    </td>

                                    <td>
                                        {quiz.total_questions}
                                    </td>

                                    <td>
                                        {quiz.total_attempts}
                                    </td>

                                    <td>

                                            <span className="score-badge">
                                                {quiz.average_score}%
                                            </span>

                                    </td>

                                    <td>

                                            <span className="pass-badge">
                                                {quiz.pass_rate}%
                                            </span>

                                    </td>

                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* ==================================
                Student Reports
            ================================== */}

            <section className="report-section">

                <div className="section-header">

                    <div>

                        <h2>
                            👨‍🎓 Student Performance
                        </h2>

                        <p>
                            Quiz attempts and average
                            performance of users.
                        </p>

                    </div>

                    <button
                        className="export-button"
                        onClick={() =>
                            exportReport("users")
                        }
                    >
                        ⬇ Export CSV
                    </button>

                </div>


                <div className="table-wrapper">

                    <table className="reports-table">

                        <thead>

                        <tr>

                            <th>
                                Student
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Quizzes Attempted
                            </th>

                            <th>
                                Average Score
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty-cell"
                                >
                                    No user report data
                                    available.
                                </td>

                            </tr>

                        ) : (

                            users
                                .filter(
                                    (user) =>
                                        user.role ===
                                        "student"
                                )
                                .map((user) => (

                                    <tr
                                        key={user.id}
                                    >

                                        <td>

                                            <div className="student-cell">

                                                <div className="student-avatar">
                                                    {user.full_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                        "U"}
                                                </div>

                                                <strong>
                                                    {user.full_name ||
                                                        "Unknown User"}
                                                </strong>

                                            </div>

                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>

                                                <span className="role-badge">
                                                    Student
                                                </span>

                                        </td>

                                        <td>
                                            {user.quizzes_attempted}
                                        </td>

                                        <td>

                                                <span className="score-badge">
                                                    {user.average_score}%
                                                </span>

                                        </td>

                                    </tr>

                                ))

                        )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* ==================================
                Attempt Reports
            ================================== */}

            <section className="report-section">

                <div className="section-header">

                    <div>

                        <h2>
                            🎯 Recent Quiz Attempts
                        </h2>

                        <p>
                            Detailed record of completed
                            quiz attempts.
                        </p>

                    </div>

                </div>


                <div className="table-wrapper">

                    <table className="reports-table">

                        <thead>

                        <tr>

                            <th>
                                Student
                            </th>

                            <th>
                                Quiz
                            </th>

                            <th>
                                Score
                            </th>

                            <th>
                                Correct
                            </th>

                            <th>
                                Wrong
                            </th>

                            <th>
                                Time
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Date
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {attempts.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="empty-cell"
                                >
                                    No completed attempts
                                    available.
                                </td>

                            </tr>

                        ) : (

                            attempts.map((attempt) => (

                                <tr
                                    key={attempt.attempt_id}
                                >

                                    <td>

                                        <strong>
                                            {attempt.student_name ||
                                                "Unknown"}
                                        </strong>

                                    </td>

                                    <td>
                                        {attempt.quiz_title}
                                    </td>

                                    <td>

                                            <span className="score-badge">
                                                {attempt.percentage}%
                                            </span>

                                    </td>

                                    <td className="correct-text">
                                        {attempt.correct_answers}
                                    </td>

                                    <td className="wrong-text">
                                        {attempt.wrong_answers}
                                    </td>

                                    <td>
                                        {formatTime(
                                            attempt.time_taken
                                        )}
                                    </td>

                                    <td>

                                            <span
                                                className={
                                                    attempt.status ===
                                                    "PASSED"
                                                        ? "status-badge passed"
                                                        : "status-badge failed"
                                                }
                                            >
                                                {attempt.status}
                                            </span>

                                    </td>

                                    <td>
                                        {formatDate(
                                            attempt.submitted_at
                                        )}
                                    </td>

                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
};

export default Reports;