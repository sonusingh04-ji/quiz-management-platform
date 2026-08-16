import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Leaderboard.css";

const Leaderboard = () => {
    const navigate = useNavigate();

    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/leaderboard");

            if (response.data.success) {
                setLeaderboard(response.data.data || []);
            } else {
                setError("Failed to load leaderboard.");
            }

        } catch (error) {
            console.error("Leaderboard Error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load leaderboard."
            );

        } finally {
            setLoading(false);
        }
    };

    const getRankClass = (rank) => {
        if (rank === 1) return "rank-first";
        if (rank === 2) return "rank-second";
        if (rank === 3) return "rank-third";

        return "rank-normal";
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";

        return `#${rank}`;
    };

    if (loading) {
        return (
            <div className="leaderboard-page">
                <div className="leaderboard-loading">
                    Loading leaderboard...
                </div>
            </div>
        );
    }

    return (
        <div className="leaderboard-page">

            {/* Header */}
            <header className="leaderboard-header">

                <div>
                    <h1>🏆 Leaderboard</h1>

                    <p>
                        See how students are performing across the quiz platform.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </header>

            {/* Error */}
            {error && (
                <div className="leaderboard-error">
                    {error}
                </div>
            )}

            {/* Top Three */}
            {!error && leaderboard.length > 0 && (
                <section className="top-three">

                    {leaderboard.slice(0, 3).map((student) => (

                        <div
                            key={student.id}
                            className={`top-student ${getRankClass(student.rank)}`}
                        >

                            <div className="top-rank">
                                {getRankIcon(student.rank)}
                            </div>

                            <div className="top-avatar">
                                {student.full_name
                                    ? student.full_name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}
                            </div>

                            <h2>
                                {student.full_name}
                            </h2>

                            <div className="top-score">
                                {Number(student.highest_score || 0).toFixed(2)}%
                            </div>

                            <span>
                                Highest Score
                            </span>

                        </div>

                    ))}

                </section>
            )}

            {/* Leaderboard Table */}
            <section className="leaderboard-card">

                <div className="leaderboard-card-header">

                    <div>
                        <h2>Student Rankings</h2>

                        <p>
                            Rankings are based on highest score and average score.
                        </p>
                    </div>

                </div>

                {leaderboard.length === 0 ? (

                    <div className="empty-leaderboard">

                        <div className="empty-icon">
                            🏆
                        </div>

                        <h3>
                            No Rankings Available
                        </h3>

                        <p>
                            Complete a quiz to appear on the leaderboard.
                        </p>

                    </div>

                ) : (

                    <div className="leaderboard-table-wrapper">

                        <table className="leaderboard-table">

                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Student</th>
                                <th>Quizzes Attempted</th>
                                <th>Highest Score</th>
                                <th>Average Score</th>
                            </tr>
                            </thead>

                            <tbody>

                            {leaderboard.map((student) => (

                                <tr key={student.id}>

                                    <td>
                                            <span
                                                className={`rank-badge ${getRankClass(
                                                    student.rank
                                                )}`}
                                            >
                                                {getRankIcon(student.rank)}
                                            </span>
                                    </td>

                                    <td>
                                        <div className="student-info">

                                            <div className="student-avatar">
                                                {student.full_name
                                                    ? student.full_name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "U"}
                                            </div>

                                            <span>
                                                    {student.full_name}
                                                </span>

                                        </div>
                                    </td>

                                    <td>
                                        {student.quizzes_attempted}
                                    </td>

                                    <td className="highest-score">
                                        {Number(
                                            student.highest_score || 0
                                        ).toFixed(2)}
                                        %
                                    </td>

                                    <td className="average-score">
                                        {Number(
                                            student.average_score || 0
                                        ).toFixed(2)}
                                        %
                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
};

export default Leaderboard;