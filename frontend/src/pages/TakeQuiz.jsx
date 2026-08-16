import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./TakeQuiz.css";

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const [timeLeft, setTimeLeft] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [result, setResult] = useState(null);

    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/");
            return;
        }

        try {
            const user = JSON.parse(storedUser);

            if (user.role !== "student") {
                alert("Only students can attempt quizzes.");
                navigate("/dashboard");
                return;
            }
        } catch (error) {
            console.error("Invalid user data:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/");
        }
    }, [navigate]);

    /* =====================================================
       START QUIZ
    ===================================================== */

    useEffect(() => {
        const startQuiz = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/attempts/start/${id}`
                );

                console.log("START QUIZ:", response.data);

                const data = response.data.data;

                setAttemptId(data.attemptId);
                setQuiz(data.quiz);
                setQuestions(data.questions || []);

                const durationInSeconds =
                    Number(data.quiz.duration || 30) * 60;

                setTimeLeft(durationInSeconds);
            } catch (error) {
                console.error("Start Quiz Error:", error);

                const message =
                    error.response?.data?.message ||
                    "Unable to start quiz.";

                alert(message);
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            startQuiz();
        }
    }, [id, navigate]);

    /* =====================================================
       TIMER
    ===================================================== */

    useEffect(() => {
        if (
            loading ||
            timeLeft === null ||
            submitted
        ) {
            return;
        }

        if (timeLeft <= 0) {
            handleSubmit(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previous) => {
                if (previous <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, submitted]);

    /* =====================================================
       FORMAT TIMER
    ===================================================== */

    const formatTime = (seconds) => {
        if (seconds === null) {
            return "00:00";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    /* =====================================================
       TIMER STATE
    ===================================================== */

    const getTimerClass = () => {
        if (timeLeft === null) {
            return "";
        }

        if (timeLeft <= 60) {
            return "timer danger";
        }

        if (timeLeft <= 300) {
            return "timer warning";
        }

        return "timer";
    };

    /* =====================================================
       SELECT ANSWER
    ===================================================== */

    const handleAnswerSelect = (questionId, option) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: option,
        }));
    };

    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(
                (previous) => previous + 1
            );
        }
    };

    /* =====================================================
       PREVIOUS QUESTION
    ===================================================== */

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(
                (previous) => previous - 1
            );
        }
    };

    /* =====================================================
       GO TO QUESTION
    ===================================================== */

    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    /* =====================================================
       SUBMIT QUIZ
    ===================================================== */

    const handleSubmit = async (autoSubmit = false) => {
        if (submitting || submitted) {
            return;
        }

        if (!autoSubmit) {
            const confirmSubmit = window.confirm(
                "Are you sure you want to submit the quiz?"
            );

            if (!confirmSubmit) {
                return;
            }
        }

        try {
            setSubmitting(true);

            const formattedAnswers = Object.entries(
                answers
            ).map(([questionId, selectedOption]) => ({
                questionId: Number(questionId),
                selectedOption,
            }));

            const response = await api.post(
                "/attempts/submit",
                {
                    quizId: Number(id),
                    answers: formattedAnswers,
                }
            );

            console.log("SUBMIT RESULT:", response.data);

            const data = response.data.data;

            setResult(data);
            setSubmitted(true);
            setTimeLeft(0);
        } catch (error) {
            console.error("Submit Quiz Error:", error);

            const message =
                error.response?.data?.message ||
                "Failed to submit quiz.";

            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       LOADING SCREEN
    ===================================================== */

    if (loading) {
        return (
            <div className="take-quiz-loading">
                <div className="loading-box">
                    <div className="loading-icon">
                        🧠
                    </div>

                    <h2>Preparing Your Quiz</h2>

                    <p>
                        Loading questions and setting up your
                        attempt...
                    </p>

                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    /* =====================================================
       RESULT SCREEN
    ===================================================== */

    if (submitted && result) {
        const attempt = result.attempt;

        return (
            <div className="take-quiz-page result-page">

                <div className="result-container">

                    <div className="result-top">
                        <div className="result-icon">
                            {attempt.status === "PASSED"
                                ? "🎉"
                                : "📚"}
                        </div>

                        <span
                            className={`result-badge ${
                                attempt.status === "PASSED"
                                    ? "passed"
                                    : "failed"
                            }`}
                        >
                            {attempt.status}
                        </span>

                        <h1>Quiz Completed!</h1>

                        <p className="result-message">
                            {quiz?.title}
                        </p>

                        <p className="result-subtitle">
                            Great work! Here is your performance
                            summary.
                        </p>
                    </div>

                    <div className="result-score">
                        <div className="score-circle">
                            <strong>
                                {Number(
                                    attempt.percentage
                                ).toFixed(0)}
                                %
                            </strong>

                            <span>Score</span>
                        </div>
                    </div>

                    <div className="result-grid">

                        <div className="result-card">
                            <div className="result-card-icon">
                                📝
                            </div>

                            <span>Total Questions</span>

                            <strong>
                                {attempt.total_questions}
                            </strong>
                        </div>

                        <div className="result-card">
                            <div className="result-card-icon">
                                ✅
                            </div>

                            <span>Correct Answers</span>

                            <strong>
                                {attempt.correct_answers}
                            </strong>
                        </div>

                        <div className="result-card">
                            <div className="result-card-icon">
                                ❌
                            </div>

                            <span>Wrong Answers</span>

                            <strong>
                                {attempt.wrong_answers}
                            </strong>
                        </div>

                        <div className="result-card">
                            <div className="result-card-icon">
                                ⏳
                            </div>

                            <span>Unanswered</span>

                            <strong>
                                {attempt.unanswered}
                            </strong>
                        </div>

                        <div className="result-card">
                            <div className="result-card-icon">
                                ⏱️
                            </div>

                            <span>Time Taken</span>

                            <strong>
                                {Math.floor(
                                    attempt.time_taken / 60
                                )}
                                :
                                {String(
                                    attempt.time_taken % 60
                                ).padStart(2, "0")}
                            </strong>
                        </div>

                        <div className="result-card">
                            <div className="result-card-icon">
                                🏆
                            </div>

                            <span>Result</span>

                            <strong>
                                {attempt.status}
                            </strong>
                        </div>

                    </div>

                    <div className="result-actions">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Back to Dashboard
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/history")
                            }
                        >
                            View History
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    /* =====================================================
       NO QUESTIONS
    ===================================================== */

    if (!questions.length) {
        return (
            <div className="take-quiz-loading">

                <div className="loading-box empty-box">

                    <div className="loading-icon">
                        📭
                    </div>

                    <h2>No Questions Available</h2>

                    <p>
                        This quiz does not have any questions
                        available yet.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }

    const question =
        questions[currentQuestion];

    const selectedAnswer =
        answers[question.id];

    const answeredCount =
        Object.keys(answers).length;

    const unansweredCount =
        questions.length - answeredCount;

    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;

    const options = [
        {
            key: "option_a",
            letter: "A",
            value: question.option_a,
        },
        {
            key: "option_b",
            letter: "B",
            value: question.option_b,
        },
        {
            key: "option_c",
            letter: "C",
            value: question.option_c,
        },
        {
            key: "option_d",
            letter: "D",
            value: question.option_d,
        },
    ];

    /* =====================================================
       QUIZ SCREEN
    ===================================================== */

    return (
        <div className="take-quiz-page">

            {/* ==========================================
                TOP HEADER
            ========================================== */}

            <header className="quiz-header">

                <div className="quiz-title-section">

                    <button
                        className="quiz-back-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ←
                    </button>

                    <div>
                        <span className="quiz-small-label">
                            QUIZ IN PROGRESS
                        </span>

                        <h1>
                            {quiz?.title ||
                                "Untitled Quiz"}
                        </h1>

                        <p>
                            {quiz?.category ||
                                "General"}

                            <span>•</span>

                            {quiz?.difficulty ||
                                "Medium"}

                            {attemptId && (
                                <>
                                    <span>•</span>
                                    Attempt #{attemptId}
                                </>
                            )}
                        </p>
                    </div>

                </div>

                <div className={getTimerClass()}>

                    <div className="timer-icon">
                        ⏱
                    </div>

                    <div>
                        <small>Time Remaining</small>

                        <strong>
                            {formatTime(timeLeft)}
                        </strong>
                    </div>

                </div>

            </header>

            {/* ==========================================
                PROGRESS
            ========================================== */}

            <section className="progress-container">

                <div className="progress-info">

                    <div>
                        <strong>
                            Question {currentQuestion + 1}
                        </strong>

                        <span>
                            {" "}of {questions.length}
                        </span>
                    </div>

                    <span>
                        {answeredCount} answered
                    </span>

                </div>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </section>

            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <main className="quiz-content">

                {/* ======================================
                    QUESTION
                ====================================== */}

                <section className="question-card">

                    <div className="question-card-header">

                        <span className="question-number">
                            Question{" "}
                            {String(
                                currentQuestion + 1
                            ).padStart(2, "0")}
                        </span>

                        <span className="question-hint">
                            Choose one answer
                        </span>

                    </div>

                    <h2>
                        {question.question}
                    </h2>

                    {/* OPTIONS */}

                    <div className="options">

                        {options.map((option) => {

                            const isSelected =
                                selectedAnswer ===
                                option.key;

                            return (
                                <label
                                    key={option.key}
                                    className={
                                        isSelected
                                            ? "option selected"
                                            : "option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.key}
                                        checked={
                                            isSelected
                                        }
                                        onChange={() =>
                                            handleAnswerSelect(
                                                question.id,
                                                option.key
                                            )
                                        }
                                    />

                                    <span className="option-letter">
                                        {option.letter}
                                    </span>

                                    <span className="option-text">
                                        {option.value}
                                    </span>

                                    <span className="option-check">
                                        {isSelected
                                            ? "✓"
                                            : ""}
                                    </span>

                                </label>
                            );
                        })}

                    </div>

                    {/* NAVIGATION */}

                    <div className="question-navigation">

                        <button
                            className="secondary-btn"
                            disabled={
                                currentQuestion === 0
                            }
                            onClick={
                                handlePrevious
                            }
                        >
                            ← Previous
                        </button>

                        <span className="navigation-count">
                            {currentQuestion + 1} /{" "}
                            {questions.length}
                        </span>

                        {currentQuestion <
                        questions.length - 1 ? (
                            <button
                                className="primary-btn"
                                onClick={handleNext}
                            >
                                Next Question →
                            </button>
                        ) : (
                            <button
                                className="submit-btn"
                                disabled={submitting}
                                onClick={() =>
                                    handleSubmit(false)
                                }
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Quiz ✓"}
                            </button>
                        )}

                    </div>

                </section>

                {/* ======================================
                    SIDEBAR
                ====================================== */}

                <aside className="question-sidebar">

                    <div className="sidebar-heading">

                        <div>
                            <h3>Questions</h3>

                            <p>
                                Navigate through the quiz
                            </p>
                        </div>

                        <span>
                            {answeredCount}/
                            {questions.length}
                        </span>

                    </div>

                    <div className="question-list">

                        {questions.map(
                            (item, index) => {

                                const isAnswered =
                                    answers[item.id] !==
                                    undefined;

                                const isCurrent =
                                    index ===
                                    currentQuestion;

                                return (
                                    <button
                                        key={item.id}
                                        className={`
                                            question-index
                                            ${
                                            isCurrent
                                                ? "current"
                                                : ""
                                        }
                                            ${
                                            isAnswered
                                                ? "answered"
                                                : ""
                                        }
                                        `}
                                        onClick={() =>
                                            goToQuestion(
                                                index
                                            )
                                        }
                                    >
                                        <span>
                                            {index + 1}
                                        </span>

                                        {isAnswered && (
                                            <small>
                                                ✓
                                            </small>
                                        )}
                                    </button>
                                );
                            }
                        )}

                    </div>

                    {/* LEGEND */}

                    <div className="legend">

                        <div>
                            <span className="legend-box current-box" />
                            <span>Current</span>
                        </div>

                        <div>
                            <span className="legend-box answered-box" />
                            <span>Answered</span>
                        </div>

                        <div>
                            <span className="legend-box unanswered-box" />
                            <span>Unanswered</span>
                        </div>

                    </div>

                    {/* SUMMARY */}

                    <div className="quiz-summary">

                        <div className="summary-row">
                            <span>Answered</span>
                            <strong>
                                {answeredCount}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Remaining</span>
                            <strong>
                                {unansweredCount}
                            </strong>
                        </div>

                    </div>

                    {/* SUBMIT FROM SIDEBAR */}

                    <button
                        className="sidebar-submit"
                        disabled={submitting}
                        onClick={() =>
                            handleSubmit(false)
                        }
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Quiz"}
                    </button>

                </aside>

            </main>

        </div>
    );
};

export default TakeQuiz;