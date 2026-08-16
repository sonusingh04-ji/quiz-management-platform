import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [role, setRole] = useState("student");
    const [adminCode, setAdminCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (role === "admin" && !adminCode.trim()) {
            setError("Admin registration code is required.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                fullName,
                email,
                password,
                role,
                adminCode: role === "admin" ? adminCode : undefined,
            });

            setSuccess(
                response.data?.message ||
                "Registration successful."
            );

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAdminCode("");
            setRole("student");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Registration failed."
                );
            } else {
                setError("Cannot connect to the server.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            {/* =====================================
                LEFT BRANDING PANEL
            ===================================== */}
            <section className="register-hero">

                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        <span>✦</span>
                        Smart Assessment Platform
                    </div>

                    <h2>
                        Learn.
                        <br />
                        Practice.
                        <br />
                        <span>Achieve.</span>
                    </h2>

                    <p className="hero-description">
                        Build your knowledge, test your skills,
                        and track your progress with intelligent
                        online assessments.
                    </p>

                    <div className="hero-stats">

                        <div className="hero-stat">
                            <strong>100+</strong>
                            <span>Questions</span>
                        </div>

                        <div className="hero-stat">
                            <strong>24/7</strong>
                            <span>Access</span>
                        </div>

                        <div className="hero-stat">
                            <strong>∞</strong>
                            <span>Learning</span>
                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="floating-card card-one">
                            <span>✓</span>
                            Practice
                        </div>

                        <div className="floating-card card-two">
                            <span>★</span>
                            Improve
                        </div>

                        <div className="quiz-stack">

                            <div className="quiz-layer layer-back"></div>

                            <div className="quiz-layer layer-middle"></div>

                            <div className="quiz-layer layer-front">
                                <div className="quiz-icon">Q</div>

                                <div className="quiz-lines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* =====================================
                RIGHT REGISTER PANEL
            ===================================== */}
            <section className="register-panel">

                <div className="register-content">

                    {/* Brand */}
                    <div className="register-brand">

                        <div className="brand-icon">
                            Q
                        </div>

                        <div>
                            <strong>Quiz Management</strong>
                            <span>Platform</span>
                        </div>

                    </div>


                    {/* Heading */}
                    <div className="register-heading">

                        <h1>
                            Create your account <span>✨</span>
                        </h1>

                        <p>
                            Start your learning journey today.
                        </p>

                    </div>


                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                    >

                        {/* Full Name */}
                        <div className="register-field">

                            <label>
                                Full name
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    👤
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* Email */}
                        <div className="register-field">

                            <label>
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* Account Type */}
                        <div className="register-field">

                            <label>
                                Account type
                            </label>

                            <div className="role-options">

                                <label
                                    className={`role-option ${
                                        role === "student"
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={role === "student"}
                                        onChange={() => {
                                            setRole("student");
                                            setAdminCode("");
                                            setError("");
                                        }}
                                    />

                                    <span className="role-icon">
                                        🎓
                                    </span>

                                    <span className="role-text">
                                        <strong>Student</strong>
                                        <small>
                                            Take quizzes & learn
                                        </small>
                                    </span>

                                </label>


                                <label
                                    className={`role-option ${
                                        role === "admin"
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === "admin"}
                                        onChange={() => {
                                            setRole("admin");
                                            setError("");
                                        }}
                                    />

                                    <span className="role-icon">
                                        🛡️
                                    </span>

                                    <span className="role-text">
                                        <strong>Admin</strong>
                                        <small>
                                            Manage the platform
                                        </small>
                                    </span>

                                </label>

                            </div>

                        </div>


                        {/* Admin Code */}
                        {role === "admin" && (

                            <div className="register-field admin-code-field">

                                <label>
                                    Admin registration code
                                </label>

                                <div className="input-wrapper">

                                    <span className="input-icon">
                                        🔐
                                    </span>

                                    <input
                                        type="password"
                                        placeholder="Enter admin code"
                                        value={adminCode}
                                        onChange={(e) =>
                                            setAdminCode(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <small>
                                    Admin access requires a valid
                                    registration code.
                                </small>

                            </div>

                        )}


                        {/* Password */}
                        <div className="register-field">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* Confirm Password */}
                        <div className="register-field">

                            <label>
                                Confirm password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* Error */}
                        {error && (
                            <div className="register-message error">
                                <span>!</span>
                                {error}
                            </div>
                        )}


                        {/* Success */}
                        {success && (
                            <div className="register-message success">
                                <span>✓</span>
                                {success}
                            </div>
                        )}


                        {/* Submit */}
                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : role === "admin"
                                    ? "Create Admin Account →"
                                    : "Create Student Account →"
                            }
                        </button>

                    </form>


                    {/* Login */}
                    <div className="register-login">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                        >
                            Sign in
                        </button>

                    </div>


                    <div className="register-footer">
                        Secure registration&nbsp; • &nbsp;
                        Quiz Management Platform
                    </div>

                </div>

            </section>

        </div>
    );
};

export default Register;