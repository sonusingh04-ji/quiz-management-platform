import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateQuiz.css";

const CreateQuiz = () => {
    const navigate = useNavigate();

    // =====================================================
    // QUIZ DETAILS
    // =====================================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [timeLimit, setTimeLimit] = useState("");

    // =====================================================
    // QUESTIONS
    // =====================================================

    const [questions, setQuestions] = useState([]);

    const [questionText, setQuestionText] = useState("");

    const [options, setOptions] = useState([
        "",
        "",
        "",
        ""
    ]);

    const [correctAnswer, setCorrectAnswer] = useState("");

    const [explanation, setExplanation] = useState("");

    const [marks, setMarks] = useState(1);

    const [difficulty, setDifficulty] = useState("Medium");

    const [showQuestions, setShowQuestions] = useState(false);

    // =====================================================
    // QUIZ DETAILS
    // =====================================================

    const handleQuizDetails = (e) => {
        e.preventDefault();

        setShowQuestions(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // OPTION CHANGE
    // =====================================================

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];

        updatedOptions[index] = value;

        setOptions(updatedOptions);
    };

    // =====================================================
    // ADD QUESTION
    // =====================================================

    const handleAddQuestion = (e) => {
        e.preventDefault();

        // -------------------------------------------------
        // Question validation
        // -------------------------------------------------

        if (!questionText.trim()) {
            alert("Please enter the question.");
            return;
        }

        // -------------------------------------------------
        // Options validation
        // -------------------------------------------------

        if (options.some((option) => !option.trim())) {
            alert("Please fill all four options.");
            return;
        }

        // -------------------------------------------------
        // Correct answer validation
        // -------------------------------------------------

        if (!correctAnswer) {
            alert("Please select the correct answer.");
            return;
        }

        // -------------------------------------------------
        // Marks validation
        // -------------------------------------------------

        if (!marks || Number(marks) <= 0) {
            alert("Marks must be greater than 0.");
            return;
        }

        // -------------------------------------------------
        // Create question object
        // -------------------------------------------------

        const newQuestion = {
            question: questionText.trim(),

            options: [
                options[0].trim(),
                options[1].trim(),
                options[2].trim(),
                options[3].trim()
            ],

            correctAnswer: correctAnswer,

            explanation: explanation.trim(),

            marks: Number(marks),

            difficulty: difficulty
        };

        setQuestions([
            ...questions,
            newQuestion
        ]);

        // -------------------------------------------------
        // Reset question form
        // -------------------------------------------------

        setQuestionText("");

        setOptions([
            "",
            "",
            "",
            ""
        ]);

        setCorrectAnswer("");

        setExplanation("");

        setMarks(1);

        setDifficulty("Medium");

        alert("Question added successfully!");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // REMOVE QUESTION
    // =====================================================

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = questions.filter(
            (_, questionIndex) =>
                questionIndex !== index
        );

        setQuestions(updatedQuestions);
    };

    // =====================================================
    // SAVE COMPLETE QUIZ
    // =====================================================

    const handleSaveQuiz = async () => {

        if (questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        try {

            // =================================================
            // 1. CREATE QUIZ
            // =================================================

            const quizResponse = await api.post(
                "/quizzes",
                {
                    title,
                    description,
                    category,

                    // Keeping your existing backend behavior
                    difficulty: "Medium",

                    maxAttempts: 1,

                    passingScore: 60,

                    status: "published",

                    duration: Number(timeLimit)
                }
            );

            console.log(
                "Quiz created:",
                quizResponse.data
            );

            // =================================================
            // 2. GET QUIZ ID
            // =================================================

            const quizId =
                quizResponse.data.data?.id;

            if (!quizId) {

                console.error(
                    "Quiz response:",
                    quizResponse.data
                );

                throw new Error(
                    "Quiz ID was not returned by the server."
                );
            }

            // =================================================
            // 3. SAVE QUESTIONS
            // =================================================

            for (const question of questions) {

                const correctIndex =
                    Number(question.correctAnswer);

                const correctAnswerValue =
                    [
                        "A",
                        "B",
                        "C",
                        "D"
                    ][correctIndex];

                await api.post(
                    `/quizzes/${quizId}/questions`,
                    {
                        question:
                        question.question,

                        option_a:
                            question.options[0],

                        option_b:
                            question.options[1],

                        option_c:
                            question.options[2],

                        option_d:
                            question.options[3],

                        correct_answer:
                        correctAnswerValue,

                        explanation:
                        question.explanation,

                        marks:
                        question.marks,

                        difficulty:
                        question.difficulty
                    }
                );
            }

            // =================================================
            // 4. SUCCESS
            // =================================================

            console.log(
                "All questions saved successfully."
            );

            alert(
                "Quiz and all questions created successfully!"
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Quiz creation failed:",
                error.response?.data ||
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create quiz. Please check the backend."
            );
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="create-quiz-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="create-quiz-header">

                <div>
                    <h1>
                        Create New Quiz
                    </h1>

                    <p>
                        Build an engaging assessment for your students.
                    </p>
                </div>

                <button
                    type="button"
                    className="create-quiz-cancel"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </header>


            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="quiz-builder-progress">

                <div className="progress-steps">

                    <div
                        className={`progress-step ${
                            !showQuestions
                                ? "active"
                                : "completed"
                        }`}
                    >

                        <div className="progress-step-number">
                            {!showQuestions ? "1" : "✓"}
                        </div>

                        <span>
                            Quiz Details
                        </span>

                    </div>


                    <div
                        className={`progress-step ${
                            showQuestions
                                ? "active"
                                : ""
                        }`}
                    >

                        <div className="progress-step-number">
                            2
                        </div>

                        <span>
                            Add Questions
                        </span>

                    </div>


                    <div className="progress-step">

                        <div className="progress-step-number">
                            3
                        </div>

                        <span>
                            Review & Save
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                QUIZ DETAILS
            ================================================= */}

            {!showQuestions && (

                <main className="quiz-builder-card">

                    <div className="builder-section-header">

                        <h2>
                            Quiz Information
                        </h2>

                        <p>
                            Enter the basic information about your quiz.
                        </p>

                    </div>


                    <form onSubmit={handleQuizDetails}>

                        <div className="quiz-form-grid">

                            {/* =================================================
                                TITLE
                            ================================================= */}

                            <div className="quiz-form-group full-width">

                                <label>
                                    Quiz Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Java Programming Fundamentals"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <div className="quiz-form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    placeholder="Write a short description about this quiz..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* =================================================
                                CATEGORY
                            ================================================= */}

                            <div className="quiz-form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    <option value="Java">
                                        Java
                                    </option>

                                    <option value="Python">
                                        Python
                                    </option>

                                    <option value="Database">
                                        Database
                                    </option>

                                    <option value="Web Development">
                                        Web Development
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                TIME LIMIT
                            ================================================= */}

                            <div className="quiz-form-group">

                                <label>
                                    Time Limit
                                </label>

                                <input
                                    type="number"
                                    placeholder="Example: 20"
                                    min="1"
                                    value={timeLimit}
                                    onChange={(e) =>
                                        setTimeLimit(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="quiz-builder-footer">

                            <button
                                type="button"
                                className="secondary-builder-btn"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-builder-btn"
                            >
                                Next: Add Questions →
                            </button>

                        </div>

                    </form>

                </main>

            )}


            {/* =================================================
                QUESTION BUILDER
            ================================================= */}

            {showQuestions && (

                <main className="quiz-builder-card">

                    {/* =================================================
                        SECTION HEADER
                    ================================================= */}

                    <div className="builder-section-header">

                        <h2>
                            Add Questions
                        </h2>

                        <p>
                            Create questions and choose the correct answer.
                        </p>

                    </div>


                    {/* =================================================
                        QUIZ INFORMATION
                    ================================================= */}

                    <div
                        style={{
                            background: "#f5f3ff",
                            padding: "14px 16px",
                            borderRadius: "10px",
                            marginBottom: "25px"
                        }}
                    >

                        <strong
                            style={{
                                color: "#5146e5"
                            }}
                        >
                            Quiz:
                        </strong>

                        <span
                            style={{
                                marginLeft: "8px"
                            }}
                        >
                            {title}
                        </span>

                    </div>


                    {/* =================================================
                        QUESTION FORM
                    ================================================= */}

                    <form
                        onSubmit={handleAddQuestion}
                        className="question-builder"
                    >

                        {/* =================================================
                            QUESTION
                        ================================================= */}

                        <div className="quiz-form-group">

                            <label>
                                Question
                            </label>

                            <textarea
                                className="question-textarea"
                                placeholder="Write your question here..."
                                value={questionText}
                                onChange={(e) =>
                                    setQuestionText(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* =================================================
                            OPTIONS
                        ================================================= */}

                        <h3 className="options-title">
                            Answer Options
                        </h3>

                        {options.map(
                            (option, index) => (

                                <div
                                    className="option-builder"
                                    key={index}
                                >

                                    <div className="option-letter">
                                        {String.fromCharCode(
                                            65 + index
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder={`Enter option ${String.fromCharCode(
                                            65 + index
                                        )}`}
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            )
                        )}


                        {/* =================================================
                            CORRECT ANSWER
                        ================================================= */}

                        <div className="correct-answer-section">

                            <h3>
                                Correct Answer
                            </h3>

                            <div className="correct-answer-options">

                                {options.map(
                                    (option, index) => {

                                        const letter =
                                            String.fromCharCode(
                                                65 + index
                                            );

                                        return (

                                            <div
                                                key={index}
                                                className={`correct-answer-option ${
                                                    correctAnswer ===
                                                    String(index)
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setCorrectAnswer(
                                                        String(index)
                                                    )
                                                }
                                            >

                                                <label>

                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        value={index}
                                                        checked={
                                                            correctAnswer ===
                                                            String(index)
                                                        }
                                                        onChange={(e) =>
                                                            setCorrectAnswer(
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    Option {letter}

                                                </label>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            EXPLANATION
                        ================================================= */}

                        <div
                            className="quiz-form-group"
                            style={{
                                marginTop: "25px"
                            }}
                        >

                            <label>
                                Explanation
                            </label>

                            <textarea
                                placeholder="Explain why the selected answer is correct... (optional)"
                                value={explanation}
                                onChange={(e) =>
                                    setExplanation(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* =================================================
                            MARKS + DIFFICULTY
                        ================================================= */}

                        <div className="quiz-form-grid">

                            <div className="quiz-form-group">

                                <label>
                                    Marks
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={marks}
                                    onChange={(e) =>
                                        setMarks(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="quiz-form-group">

                                <label>
                                    Difficulty
                                </label>

                                <select
                                    value={difficulty}
                                    onChange={(e) =>
                                        setDifficulty(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="Easy">
                                        Easy
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Hard">
                                        Hard
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =================================================
                            ADD QUESTION BUTTON
                        ================================================= */}

                        <div className="quiz-builder-footer">

                            <button
                                type="submit"
                                className="primary-builder-btn"
                            >
                                + Add Question
                            </button>

                        </div>

                    </form>


                    {/* =================================================
                        QUESTIONS PREVIEW
                    ================================================= */}

                    <div
                        style={{
                            marginTop: "35px"
                        }}
                    >

                        <div className="builder-section-header">

                            <h2>
                                Questions Added
                                <span
                                    style={{
                                        color: "#5146e5",
                                        marginLeft: "8px"
                                    }}
                                >
                                    {questions.length}
                                </span>
                            </h2>

                            <p>
                                Review your questions before saving the quiz.
                            </p>

                        </div>


                        {questions.length === 0 ? (

                            <div className="empty-questions">

                                <div className="empty-questions-icon">
                                    📝
                                </div>

                                <strong>
                                    No questions added yet
                                </strong>

                                <p>
                                    Add your first question using the form above.
                                </p>

                            </div>

                        ) : (

                            questions.map(
                                (question, index) => (

                                    <div
                                        className="question-preview"
                                        key={index}
                                    >

                                        <div className="question-preview-header">

                                            <h3>
                                                Question {index + 1}
                                            </h3>

                                            <button
                                                type="button"
                                                className="remove-question-btn"
                                                onClick={() =>
                                                    handleRemoveQuestion(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>


                                        {/* Question */}

                                        <p>
                                            <strong>
                                                {question.question}
                                            </strong>
                                        </p>


                                        {/* Options */}

                                        <ol>

                                            {question.options.map(
                                                (
                                                    option,
                                                    optionIndex
                                                ) => (

                                                    <li
                                                        key={
                                                            optionIndex
                                                        }
                                                    >

                                                        {option}

                                                        {question.correctAnswer ===
                                                            String(
                                                                optionIndex
                                                            ) && (

                                                                <strong
                                                                    style={{
                                                                        color: "#16a34a",
                                                                        marginLeft: "8px"
                                                                    }}
                                                                >
                                                                    ✓ Correct
                                                                </strong>

                                                            )}

                                                    </li>

                                                )
                                            )}

                                        </ol>


                                        {/* Metadata */}

                                        <p>

                                            <strong>
                                                Difficulty:
                                            </strong>{" "}

                                            {question.difficulty}

                                            {"  •  "}

                                            <strong>
                                                Marks:
                                            </strong>{" "}

                                            {question.marks}

                                        </p>


                                        {/* Explanation */}

                                        {question.explanation && (

                                            <p>

                                                <strong>
                                                    Explanation:
                                                </strong>{" "}

                                                {question.explanation}

                                            </p>

                                        )}

                                    </div>

                                )
                            )

                        )}

                    </div>


                    {/* =================================================
                        SAVE QUIZ
                    ================================================= */}

                    <div className="quiz-builder-footer">

                        <button
                            type="button"
                            className="secondary-builder-btn"
                            onClick={() => {
                                setShowQuestions(false);

                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });
                            }}
                        >
                            ← Edit Quiz Details
                        </button>


                        <button
                            type="button"
                            className="primary-builder-btn"
                            onClick={handleSaveQuiz}
                            disabled={questions.length === 0}
                            style={{
                                opacity:
                                    questions.length === 0
                                        ? 0.5
                                        : 1,
                                cursor:
                                    questions.length === 0
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >
                            💾 Save & Publish Quiz
                        </button>

                    </div>

                </main>

            )}

        </div>
    );
};

export default CreateQuiz;