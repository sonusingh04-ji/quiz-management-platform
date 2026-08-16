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

    // =====================================================
    // CHECK LOGIN
    // =====================================================
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/");
            return;
        }

        try {
            const user = JSON.parse(storedUser);

            // Student should take quizzes.
            // Admin should manage quizzes instead.
            if (user.role !== "student") {
                alert("Only students can attempt quizzes.");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Invalid user data:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/");
        }
    }, [navigate]);

    // =====================================================
    // START QUIZ
    // =====================================================
    useEffect(() => {
        const startQuiz = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/attempts/start/${id}`
                );

                const data = response.data.data;

                setAttemptId(data.attemptId);
                setQuiz(data.quiz);
                setQuestions(data.questions);

                // Duration is in minutes
                const durationInSeconds =
                    Number(data.quiz.duration || 30) * 60;

                setTimeLeft(durationInSeconds);

            } catch (error) {
                console.error(
                    "Start Quiz Error:",
                    error
                );

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

    // =====================================================
    // TIMER
    // =====================================================
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

    // =====================================================
    // FORMAT TIMER
    // =====================================================
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

    // =====================================================
    // SELECT ANSWER
    // =====================================================
    const handleAnswerSelect = (questionId, option) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: option
        }));
    };

    // =====================================================
    // NEXT QUESTION
    // =====================================================
    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((previous) => previous + 1);
        }
    };

    // =====================================================
    // PREVIOUS QUESTION
    // =====================================================
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((previous) => previous - 1);
        }
    };

    // =====================================================
    // GO TO QUESTION
    // =====================================================
    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    // =====================================================
    // SUBMIT QUIZ
    // =====================================================
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

            // Convert frontend answers object
            // into backend expected format.
            const formattedAnswers = Object.entries(
                answers
            ).map(([questionId, selectedOption]) => ({
                questionId: Number(questionId),
                selectedOption
            }));

            const response = await api.post(
                "/attempts/submit",
                {
                    quizId: Number(id),
                    answers: formattedAnswers
                }
            );

            const data = response.data.data;

            setResult(data);
            setSubmitted(true);
            setTimeLeft(0);

        } catch (error) {
            console.error(
                "Submit Quiz Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to submit quiz.";

            alert(message);

        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================
    if (loading) {
        return (
            <div className="take-quiz-loading">
                <div className="loading-box">
                    <h2>Loading Quiz...</h2>
                    <p>Please wait.</p>
                </div>
            </div>
        );
    }

    // =====================================================
    // RESULT SCREEN
    // =====================================================
    if (submitted && result) {
        const attempt = result.attempt;
        const savedResult = result.result;

        return (
            <div className="take-quiz-page">
                <div className="result-container">

                    <div className="result-icon">
                        {attempt.status === "PASSED"
                            ? "🎉"
                            : "📚"}
                    </div>

                    <h1>Quiz Completed</h1>

                    <p className="result-message">
                        {quiz?.title}
                    </p>

                    <div className="result-status">
                        <span
                            className={
                                attempt.status ===
                                "PASSED"
                                    ? "passed"
                                    : "failed"
                            }
                        >
                            {attempt.status}
                        </span>
                    </div>

                    <div className="result-grid">

                        <div className="result-card">
                            <span>Score</span>
                            <strong>
                                {Number(
                                    attempt.percentage
                                ).toFixed(2)}
                                %
                            </strong>
                        </div>

                        <div className="result-card">
                            <span>Total Questions</span>
                            <strong>
                                {
                                    attempt.total_questions
                                }
                            </strong>
                        </div>

                        <div className="result-card">
                            <span>Correct</span>
                            <strong>
                                {
                                    attempt.correct_answers
                                }
                            </strong>
                        </div>

                        <div className="result-card">
                            <span>Wrong</span>
                            <strong>
                                {
                                    attempt.wrong_answers
                                }
                            </strong>
                        </div>

                        <div className="result-card">
                            <span>Unanswered</span>
                            <strong>
                                {
                                    attempt.unanswered
                                }
                            </strong>
                        </div>

                        <div className="result-card">
                            <span>Time Taken</span>
                            <strong>
                                {Math.floor(
                                    attempt.time_taken /
                                    60
                                )}
                                :
                                {String(
                                    attempt.time_taken %
                                    60
                                ).padStart(2, "0")}
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
                            Back to Dashboard
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

    // =====================================================
    // NO QUESTIONS
    // =====================================================
    if (!questions.length) {
        return (
            <div className="take-quiz-loading">
                <div className="loading-box">
                    <h2>No Questions Available</h2>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Back to Dashboard
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

    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;

    // =====================================================
    // QUIZ SCREEN
    // =====================================================
    return (
        <div className="take-quiz-page">

            {/* Header */}
            <header className="quiz-header">

                <div>
                    <h1>{quiz.title}</h1>

                    <p>
                        {quiz.category} •{" "}
                        {quiz.difficulty}
                    </p>
                </div>

                <div className="timer">
                    <span>⏱</span>
                    <strong>
                        {formatTime(timeLeft)}
                    </strong>
                </div>

            </header>

            {/* Progress */}
            <div className="progress-container">

                <div className="progress-info">
                    <span>
                        Question{" "}
                        {currentQuestion + 1} of{" "}
                        {questions.length}
                    </span>

                    <span>
                        {answeredCount} /{" "}
                        {questions.length} answered
                    </span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`
                        }}
                    />
                </div>

            </div>

            {/* Main */}
            <main className="quiz-content">

                {/* Question */}
                <section className="question-card">

                    <div className="question-number">
                        Question{" "}
                        {currentQuestion + 1}
                    </div>

                    <h2>
                        {question.question}
                    </h2>

                    <div className="options">

                        <label
                            className={
                                selectedAnswer ===
                                "option_a"
                                    ? "option selected"
                                    : "option"
                            }
                        >
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={
                                    selectedAnswer ===
                                    "option_a"
                                }
                                onChange={() =>
                                    handleAnswerSelect(
                                        question.id,
                                        "option_a"
                                    )
                                }
                            />

                            <span className="option-letter">
                                A
                            </span>

                            <span>
                                {question.option_a}
                            </span>
                        </label>

                        <label
                            className={
                                selectedAnswer ===
                                "option_b"
                                    ? "option selected"
                                    : "option"
                            }
                        >
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={
                                    selectedAnswer ===
                                    "option_b"
                                }
                                onChange={() =>
                                    handleAnswerSelect(
                                        question.id,
                                        "option_b"
                                    )
                                }
                            />

                            <span className="option-letter">
                                B
                            </span>

                            <span>
                                {question.option_b}
                            </span>
                        </label>

                        <label
                            className={
                                selectedAnswer ===
                                "option_c"
                                    ? "option selected"
                                    : "option"
                            }
                        >
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={
                                    selectedAnswer ===
                                    "option_c"
                                }
                                onChange={() =>
                                    handleAnswerSelect(
                                        question.id,
                                        "option_c"
                                    )
                                }
                            />

                            <span className="option-letter">
                                C
                            </span>

                            <span>
                                {question.option_c}
                            </span>
                        </label>

                        <label
                            className={
                                selectedAnswer ===
                                "option_d"
                                    ? "option selected"
                                    : "option"
                            }
                        >
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={
                                    selectedAnswer ===
                                    "option_d"
                                }
                                onChange={() =>
                                    handleAnswerSelect(
                                        question.id,
                                        "option_d"
                                    )
                                }
                            />

                            <span className="option-letter">
                                D
                            </span>

                            <span>
                                {question.option_d}
                            </span>
                        </label>

                    </div>

                    {/* Navigation */}
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

                        {currentQuestion <
                        questions.length - 1 ? (
                            <button
                                className="primary-btn"
                                onClick={
                                    handleNext
                                }
                            >
                                Next →
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
                                    : "Submit Quiz"}
                            </button>
                        )}

                    </div>

                </section>

                {/* Question Navigator */}
                <aside className="question-sidebar">

                    <h3>Questions</h3>

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
                                        {index + 1}
                                    </button>
                                );
                            }
                        )}

                    </div>

                    <div className="legend">

                        <div>
                            <span className="legend-box current-box" />
                            Current
                        </div>

                        <div>
                            <span className="legend-box answered-box" />
                            Answered
                        </div>

                        <div>
                            <span className="legend-box unanswered-box" />
                            Unanswered
                        </div>

                    </div>

                    <div className="quiz-summary">

                        <p>
                            <strong>
                                {answeredCount}
                            </strong>{" "}
                            answered
                        </p>

                        <p>
                            <strong>
                                {questions.length -
                                    answeredCount}
                            </strong>{" "}
                            unanswered
                        </p>

                    </div>

                </aside>

            </main>

        </div>
    );
};

export default TakeQuiz;