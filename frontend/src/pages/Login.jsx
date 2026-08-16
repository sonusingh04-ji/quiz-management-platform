import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Invalid email or password."
                );
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* =========================================
                LEFT BRANDING PANEL
            ========================================= */}

            <div className="login-visual">

                <div className="visual-overlay"></div>

                <div className="visual-content">

                    <div className="brand-badge">
                        ✦ Smart Assessment Platform
                    </div>

                    <h1>
                        Learn.
                        <br />
                        Practice.
                        <br />
                        <span>Achieve.</span>
                    </h1>

                    <p>
                        Test your knowledge, track your progress,
                        and improve your skills with intelligent
                        online assessments.
                    </p>

                    <div className="visual-stats">

                        <div>
                            <strong>100+</strong>
                            <span>Questions</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Access</span>
                        </div>

                        <div>
                            <strong>∞</strong>
                            <span>Learning</span>
                        </div>

                    </div>

                </div>

                <img
                    src="/src/assets/hero.png"
                    alt="Online learning illustration"
                    className="login-hero-image"
                />

            </div>


            {/* =========================================
                RIGHT LOGIN PANEL
            ========================================= */}

            <div className="login-panel">

                <div className="login-card">

                    {/* Brand */}

                    <div className="login-brand">

                        <div className="brand-icon">
                            Q
                        </div>

                        <div>
                            <strong>
                                Quiz Management
                            </strong>

                            <span>
                                Platform
                            </span>
                        </div>

                    </div>


                    {/* Heading */}

                    <div className="login-heading">

                        <h2>
                            Welcome back 👋
                        </h2>

                        <p>
                            Sign in to continue your learning journey.
                        </p>

                    </div>


                    {/* Form */}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-button"
                                    onClick={() =>
                                        navigate("/forgot-password")
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="login-error">

                                <span>!</span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Register */}

                    <div className="login-register">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                        >
                            Create account
                        </button>

                    </div>


                    {/* Footer */}

                    <div className="login-footer">
                        Secure login • Quiz Management Platform
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;