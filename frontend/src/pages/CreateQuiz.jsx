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

    const [showQuestions, setShowQuestions] =
        useState(false);


    // =====================================================
    // QUIZ DETAILS
    // =====================================================

    const handleQuizDetails = (e) => {

        e.preventDefault();

        setShowQuestions(true);
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


        // -----------------------------
        // Question validation
        // -----------------------------

        if (!questionText.trim()) {

            alert("Please enter the question.");

            return;
        }


        // -----------------------------
        // Options validation
        // -----------------------------

        if (
            options.some(
                (option) => !option.trim()
            )
        ) {

            alert("Please fill all four options.");

            return;
        }


        // -----------------------------
        // Correct answer validation
        // -----------------------------

        if (!correctAnswer) {

            alert(
                "Please select the correct answer."
            );

            return;
        }


        // -----------------------------
        // Marks validation
        // -----------------------------

        if (
            !marks ||
            Number(marks) <= 0
        ) {

            alert(
                "Marks must be greater than 0."
            );

            return;
        }


        // =================================================
        // CREATE QUESTION OBJECT
        // =================================================

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


        // =================================================
        // RESET QUESTION FORM
        // =================================================

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


        alert(
            "Question added successfully!"
        );
    };


    // =====================================================
    // DELETE QUESTION BEFORE SAVING
    // =====================================================

    const handleRemoveQuestion = (index) => {

        const updatedQuestions =
            questions.filter(
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

            alert(
                "Please add at least one question."
            );

            return;
        }


        try {

            // =================================================
            // 1. CREATE QUIZ
            // =================================================

            const quizResponse =
                await api.post(
                    "/quizzes",
                    {
                        title,
                        description,
                        category,

                        difficulty: "Medium",

                        maxAttempts: 1,

                        passingScore: 60,

                        status: "published",

                        duration:
                            Number(timeLimit)
                    }
                );


            console.log(
                "Quiz created:",
                quizResponse.data
            );


            // =================================================
            // GET QUIZ ID
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
            // 2. SAVE QUESTIONS
            // =================================================

            for (
                const question
                of questions
                ) {

                const correctIndex =
                    Number(
                        question.correctAnswer
                    );


                const correctAnswer =
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
                        correctAnswer,

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
            // 3. SUCCESS
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

            <h1>Create Quiz</h1>


            {/* =================================================
                QUIZ DETAILS
            ================================================= */}

            {!showQuestions && (

                <>

                    <p>
                        Create a new quiz for students.
                    </p>


                    <form
                        onSubmit={
                            handleQuizDetails
                        }
                    >

                        {/* Quiz Title */}

                        <div>

                            <label>
                                Quiz Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter quiz title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Description */}

                        <div>

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Enter quiz description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Category */}

                        <div>

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


                        {/* Time Limit */}

                        <div>

                            <label>
                                Time Limit (minutes)
                            </label>

                            <input
                                type="number"
                                placeholder="Example: 20"
                                value={timeLimit}
                                onChange={(e) =>
                                    setTimeLimit(
                                        e.target.value
                                    )
                                }
                                min="1"
                                required
                            />

                        </div>


                        {/* Submit */}

                        <button type="submit">

                            Next: Add Questions

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >

                            Cancel

                        </button>

                    </form>

                </>
            )}


            {/* =================================================
                QUESTION SECTION
            ================================================= */}

            {showQuestions && (

                <div>

                    <h2>
                        Add Questions
                    </h2>


                    <p>
                        Quiz:{" "}
                        <strong>
                            {title}
                        </strong>
                    </p>


                    {/* =================================================
                        QUESTION FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            handleAddQuestion
                        }
                    >

                        {/* Question */}

                        <div>

                            <label>
                                Question
                            </label>

                            <textarea
                                placeholder="Enter your question"
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

                        <h3>
                            Options
                        </h3>


                        {options.map(
                            (
                                option,
                                index
                            ) => (

                                <div
                                    key={index}
                                >

                                    <label>

                                        Option{" "}
                                        {
                                            String.fromCharCode(
                                                65 + index
                                            )
                                        }

                                    </label>


                                    <input
                                        type="text"
                                        placeholder={
                                            `Enter option ${
                                                String.fromCharCode(
                                                    65 + index
                                                )
                                            }`
                                        }
                                        value={
                                            option
                                        }
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

                        <h3>
                            Correct Answer
                        </h3>


                        {options.map(
                            (
                                option,
                                index
                            ) => (

                                <div
                                    key={index}
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

                                        {" "}
                                        Option{" "}
                                        {
                                            String.fromCharCode(
                                                65 + index
                                            )
                                        }

                                    </label>

                                </div>

                            )
                        )}


                        {/* =================================================
                            EXPLANATION
                        ================================================= */}

                        <div>

                            <label>
                                Explanation
                            </label>

                            <textarea
                                placeholder="Explain why this answer is correct (optional)"
                                value={
                                    explanation
                                }
                                onChange={(e) =>
                                    setExplanation(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* =================================================
                            MARKS
                        ================================================= */}

                        <div>

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


                        {/* =================================================
                            DIFFICULTY
                        ================================================= */}

                        <div>

                            <label>
                                Difficulty
                            </label>

                            <select
                                value={
                                    difficulty
                                }
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


                        {/* Add Question */}

                        <button
                            type="submit"
                        >

                            Add Question

                        </button>

                    </form>


                    <hr />


                    {/* =================================================
                        QUESTIONS PREVIEW
                    ================================================= */}

                    <h2>

                        Questions Added:{" "}
                        {questions.length}

                    </h2>


                    {questions.map(
                        (
                            question,
                            index
                        ) => (

                            <div
                                key={index}
                                className="question-preview"
                            >

                                <h3>

                                    Question{" "}
                                    {index + 1}

                                </h3>


                                <p>

                                    <strong>
                                        {question.question}
                                    </strong>

                                </p>


                                <p>

                                    <strong>
                                        Difficulty:
                                    </strong>{" "}

                                    {question.difficulty}

                                    {" | "}

                                    <strong>
                                        Marks:
                                    </strong>{" "}

                                    {question.marks}

                                </p>


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

                                                        <strong>

                                                            {" "}
                                                            ✓ Correct

                                                        </strong>
                                                    )}

                                            </li>
                                        )
                                    )}

                                </ol>


                                {question.explanation && (

                                    <p>

                                        <strong>
                                            Explanation:
                                        </strong>{" "}

                                        {
                                            question.explanation
                                        }

                                    </p>

                                )}


                                {/* Remove */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveQuestion(
                                            index
                                        )
                                    }
                                >

                                    Remove Question

                                </button>

                            </div>

                        )
                    )}


                    <br />


                    {/* =================================================
                        SAVE QUIZ
                    ================================================= */}

                    <button
                        type="button"
                        onClick={
                            handleSaveQuiz
                        }
                    >

                        Save Quiz

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >

                        Cancel

                    </button>

                </div>
            )}

        </div>
    );
};


export default CreateQuiz;