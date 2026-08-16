import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./AttemptDetails.css";
import jsPDF from "jspdf";

const AttemptDetails = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH ATTEMPT DETAILS
    // =====================================================
    useEffect(() => {
        fetchAttemptDetails();
    }, [attemptId]);

    const fetchAttemptDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/attempts/${attemptId}`
            );

            if (response.data.success) {
                setAttempt(
                    response.data.data?.attempt || null
                );

                setAnswers(
                    response.data.data?.answers || []
                );
            } else {
                setError(
                    response.data.message ||
                    "Failed to load attempt details."
                );
            }

        } catch (error) {
            console.error(
                "Attempt Details Error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load attempt details."
            );

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // FORMAT TIME
    // =====================================================
    const formatTime = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined ||
            seconds === ""
        ) {
            return "—";
        }

        const totalSeconds = Number(seconds);

        if (Number.isNaN(totalSeconds)) {
            return "—";
        }

        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        return `${mins}:${String(secs).padStart(2, "0")}`;
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================
    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const formattedDate = new Date(date);

        if (Number.isNaN(formattedDate.getTime())) {
            return "—";
        }

        return formattedDate.toLocaleString();
    };


    // =====================================================
    // GET OPTION TEXT
    // =====================================================
    const getOptionText = (answer, option) => {

        if (!answer || !option) {
            return "";
        }

        const optionMap = {
            A: answer.option_a,
            B: answer.option_b,
            C: answer.option_c,
            D: answer.option_d
        };

        return optionMap[option] || option;
    };


    // =====================================================
    // DOWNLOAD RESULT REPORT
    // =====================================================
    const downloadResultReport = () => {

        if (!attempt) {
            alert("Attempt information is not available.");
            return;
        }

        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        const pageHeight =
            doc.internal.pageSize.getHeight();

        let y = 20;


        // =================================================
        // PAGE SPACE CHECK
        // =================================================
        const checkPageSpace = (
            requiredSpace = 15
        ) => {

            if (
                y + requiredSpace >
                pageHeight - 20
            ) {
                doc.addPage();
                y = 20;
            }
        };


        // =================================================
        // TITLE
        // =================================================
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(20);

        doc.text(
            "Quiz Result Report",
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );

        y += 10;


        // =================================================
        // QUIZ TITLE
        // =================================================
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(13);

        const quizTitle =
            attempt.quiz_title || "Quiz";

        doc.text(
            quizTitle,
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );

        y += 15;


        // =================================================
        // STUDENT / ATTEMPT INFORMATION
        // =================================================
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "Attempt Summary",
            15,
            y
        );

        y += 9;

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(10);


        const summary = [

            `Score: ${Number(
                attempt.percentage ?? 0
            ).toFixed(2)}%`,

            `Correct Answers: ${
                attempt.correct_answers ?? 0
            }`,

            `Wrong Answers: ${
                attempt.wrong_answers ?? 0
            }`,

            `Unanswered: ${
                attempt.unanswered ?? 0
            }`,

            `Total Questions: ${
                attempt.total_questions ?? 0
            }`,

            `Time Taken: ${
                formatTime(attempt.time_taken)
            }`,

            `Status: ${
                attempt.status || "—"
            }`,

            `Started At: ${
                formatDate(attempt.started_at)
            }`,

            `Submitted At: ${
                formatDate(attempt.submitted_at)
            }`
        ];


        summary.forEach((line) => {

            checkPageSpace(7);

            doc.text(
                line,
                15,
                y
            );

            y += 6;
        });


        y += 8;


        // =================================================
        // QUESTION REVIEW
        // =================================================
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "Question Review",
            15,
            y
        );

        y += 10;


        // =================================================
        // NO ANSWERS
        // =================================================
        if (!answers.length) {

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(10);

            doc.text(
                "No answer details available.",
                15,
                y
            );

        } else {

            answers.forEach(
                (answer, index) => {

                    checkPageSpace(50);


                    // -----------------------------
                    // QUESTION NUMBER
                    // -----------------------------
                    doc.setFont(
                        "helvetica",
                        "bold"
                    );

                    doc.setFontSize(11);

                    const resultText =
                        answer.is_correct
                            ? "Correct"
                            : "Incorrect";

                    doc.text(
                        `Question ${
                            index + 1
                        }: ${resultText}`,
                        15,
                        y
                    );

                    y += 7;


                    // -----------------------------
                    // QUESTION
                    // -----------------------------
                    doc.setFont(
                        "helvetica",
                        "normal"
                    );

                    doc.setFontSize(10);

                    const questionText =
                        answer.question || "";

                    const questionLines =
                        doc.splitTextToSize(
                            questionText,
                            pageWidth - 30
                        );


                    questionLines.forEach(
                        (line) => {

                            checkPageSpace(6);

                            doc.text(
                                line,
                                15,
                                y
                            );

                            y += 5;
                        }
                    );


                    y += 3;


                    // -----------------------------
                    // YOUR ANSWER
                    // -----------------------------
                    const selectedAnswer =
                        answer.selected_answer;


                    const yourAnswer =
                        selectedAnswer
                            ? `${selectedAnswer}. ${
                                getOptionText(
                                    answer,
                                    selectedAnswer
                                )
                            }`
                            : "Not Answered";


                    checkPageSpace(8);

                    doc.setFont(
                        "helvetica",
                        "normal"
                    );

                    doc.text(
                        `Your Answer: ${yourAnswer}`,
                        20,
                        y
                    );

                    y += 6;


                    // -----------------------------
                    // CORRECT ANSWER
                    // -----------------------------
                    const correctAnswer =
                        answer.correct_answer;


                    const correctAnswerText =
                        correctAnswer
                            ? `${correctAnswer}. ${
                                getOptionText(
                                    answer,
                                    correctAnswer
                                )
                            }`
                            : "—";


                    checkPageSpace(8);

                    doc.text(
                        `Correct Answer: ${correctAnswerText}`,
                        20,
                        y
                    );

                    y += 7;


                    // -----------------------------
                    // EXPLANATION
                    // -----------------------------
                    if (answer.explanation) {

                        checkPageSpace(10);

                        doc.setFont(
                            "helvetica",
                            "bold"
                        );

                        doc.text(
                            "Explanation:",
                            20,
                            y
                        );

                        y += 5;


                        doc.setFont(
                            "helvetica",
                            "normal"
                        );

                        const explanationLines =
                            doc.splitTextToSize(
                                answer.explanation,
                                pageWidth - 40
                            );


                        explanationLines.forEach(
                            (line) => {

                                checkPageSpace(6);

                                doc.text(
                                    line,
                                    20,
                                    y
                                );

                                y += 5;
                            }
                        );

                        y += 4;
                    }


                    y += 8;
                }
            );
        }


        // =================================================
        // FOOTER
        // =================================================
        checkPageSpace(15);

        doc.setFont(
            "helvetica",
            "italic"
        );

        doc.setFontSize(9);

        doc.text(
            "Generated by Quiz Management Platform",
            pageWidth / 2,
            pageHeight - 10,
            {
                align: "center"
            }
        );


        // =================================================
        // FILE NAME
        // =================================================
        const safeQuizTitle =
            (attempt.quiz_title || "Quiz")
                .replace(
                    /[^a-z0-9]/gi,
                    "-"
                )
                .replace(
                    /-+/g,
                    "-"
                )
                .toLowerCase();


        const fileName =
            `${safeQuizTitle}-result-report.pdf`;


        // =================================================
        // DOWNLOAD
        // =================================================
        doc.save(fileName);
    };


    // =====================================================
    // LOADING
    // =====================================================
    if (loading) {

        return (
            <div className="attempt-details-page">

                <div className="attempt-loading">
                    Loading attempt details...
                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================
    if (error) {

        return (
            <div className="attempt-details-page">

                <div className="attempt-error">

                    <h2>
                        Unable to Load Attempt
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        ← Back to Quiz History
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // ATTEMPT NOT FOUND
    // =====================================================
    if (!attempt) {

        return (
            <div className="attempt-details-page">

                <div className="attempt-error">

                    <h2>
                        Attempt Not Found
                    </h2>

                    <p>
                        The requested quiz attempt
                        could not be found.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        ← Back to Quiz History
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================
    return (

        <div className="attempt-details-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="attempt-details-header">

                <div>

                    <h1>
                        Attempt Details
                    </h1>

                    <p>
                        {attempt.quiz_title}
                    </p>

                </div>


                {/* HEADER BUTTONS */}

                <div className="attempt-header-actions">

                    <button
                        type="button"
                        className="download-report-btn"
                        onClick={
                            downloadResultReport
                        }
                    >
                        📄 Download Result Report
                    </button>


                    <button
                        type="button"
                        className="back-history-btn"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        ← Back to History
                    </button>

                </div>

            </header>


            {/* =================================================
                RESULT SUMMARY
            ================================================= */}

            <section className="attempt-summary">


                <div className="summary-card">

                    <span>
                        Score
                    </span>

                    <strong>
                        {Number(
                            attempt.percentage ?? 0
                        ).toFixed(2)}
                        %
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Correct
                    </span>

                    <strong>
                        {attempt.correct_answers ?? 0}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Wrong
                    </span>

                    <strong>
                        {attempt.wrong_answers ?? 0}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Unanswered
                    </span>

                    <strong>
                        {attempt.unanswered ?? 0}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Time Taken
                    </span>

                    <strong>
                        {formatTime(
                            attempt.time_taken
                        )}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Status
                    </span>

                    <strong
                        className={
                            attempt.status === "PASSED"
                                ? "attempt-status-passed"
                                : "attempt-status-failed"
                        }
                    >
                        {attempt.status || "—"}
                    </strong>

                </div>

            </section>


            {/* =================================================
                ATTEMPT INFORMATION
            ================================================= */}

            <section className="attempt-info-card">

                <h2>
                    Attempt Information
                </h2>


                <div className="attempt-info-grid">

                    <div>

                        <span>
                            Quiz
                        </span>

                        <strong>
                            {attempt.quiz_title}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total Questions
                        </span>

                        <strong>
                            {attempt.total_questions ?? 0}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Started At
                        </span>

                        <strong>
                            {formatDate(
                                attempt.started_at
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Submitted At
                        </span>

                        <strong>
                            {formatDate(
                                attempt.submitted_at
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                QUESTION REVIEW
            ================================================= */}

            <section className="attempt-questions-card">

                <div className="questions-header">

                    <h2>
                        Question Review
                    </h2>

                    <p>
                        Review your answers and
                        compare them with the
                        correct answers.
                    </p>

                </div>


                {answers.length === 0 ? (

                    <div className="no-answers">
                        No answer details available.
                    </div>

                ) : (

                    <div className="questions-list">

                        {answers.map(
                            (answer, index) => {

                                const selectedAnswer =
                                    answer.selected_answer;

                                const correctAnswer =
                                    answer.correct_answer;

                                const isCorrect =
                                    Boolean(
                                        answer.is_correct
                                    );


                                return (

                                    <div
                                        key={
                                            answer.question_id ||
                                            index
                                        }

                                        className={
                                            `question-review ${
                                                isCorrect
                                                    ? "question-correct"
                                                    : "question-wrong"
                                            }`
                                        }
                                    >


                                        {/* QUESTION HEADER */}

                                        <div className="question-number">

                                            <span>
                                                Question {
                                                index + 1
                                            }
                                            </span>


                                            <span
                                                className={
                                                    isCorrect
                                                        ? "answer-correct-badge"
                                                        : "answer-wrong-badge"
                                                }
                                            >
                                                {isCorrect
                                                    ? "✓ Correct"
                                                    : "✗ Incorrect"}
                                            </span>

                                        </div>


                                        {/* QUESTION */}

                                        <h3>
                                            {answer.question}
                                        </h3>


                                        {/* OPTIONS */}

                                        <div className="answer-options">

                                            <div
                                                className={
                                                    selectedAnswer === "A"
                                                        ? "selected-option"
                                                        : ""
                                                }
                                            >
                                                <strong>
                                                    A.
                                                </strong>

                                                {answer.option_a}
                                            </div>


                                            <div
                                                className={
                                                    selectedAnswer === "B"
                                                        ? "selected-option"
                                                        : ""
                                                }
                                            >
                                                <strong>
                                                    B.
                                                </strong>

                                                {answer.option_b}
                                            </div>


                                            <div
                                                className={
                                                    selectedAnswer === "C"
                                                        ? "selected-option"
                                                        : ""
                                                }
                                            >
                                                <strong>
                                                    C.
                                                </strong>

                                                {answer.option_c}
                                            </div>


                                            <div
                                                className={
                                                    selectedAnswer === "D"
                                                        ? "selected-option"
                                                        : ""
                                                }
                                            >
                                                <strong>
                                                    D.
                                                </strong>

                                                {answer.option_d}
                                            </div>

                                        </div>


                                        {/* ANSWER RESULT */}

                                        <div className="answer-result">

                                            <div>

                                                <span>
                                                    Your Answer
                                                </span>

                                                <strong>
                                                    {
                                                        selectedAnswer
                                                            ? `${selectedAnswer}. ${getOptionText(
                                                                answer,
                                                                selectedAnswer
                                                            )}`
                                                            : "Not Answered"
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Correct Answer
                                                </span>

                                                <strong>
                                                    {
                                                        correctAnswer
                                                            ? `${correctAnswer}. ${getOptionText(
                                                                answer,
                                                                correctAnswer
                                                            )}`
                                                            : "—"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* EXPLANATION */}

                                        {answer.explanation && (

                                            <div className="explanation">

                                                <strong>
                                                    Explanation
                                                </strong>

                                                <p>
                                                    {
                                                        answer.explanation
                                                    }
                                                </p>

                                            </div>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </section>


            {/* =================================================
                BOTTOM BUTTON
            ================================================= */}

            <div className="attempt-bottom-actions">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/history")
                    }
                >
                    ← Back to Quiz History
                </button>

            </div>

        </div>
    );
};

export default AttemptDetails;