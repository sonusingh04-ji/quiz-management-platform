import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/forgot-password",
                {
                    email,
                }
            );

            const resetToken = response.data?.resetToken;

            setSuccess(
                response.data?.message ||
                "Password reset request successful."
            );

// Save token temporarily for the reset page
            if (resetToken) {
                localStorage.setItem("resetToken", resetToken);
            }

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Unable to process request."
                );
            } else {
                setError(
                    "Cannot connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">

            <div className="forgot-card">

                <h1>Quiz Management Platform</h1>

                <p className="forgot-subtitle">
                    Reset your password
                </p>

                <div className="forgot-info">
                    Enter the email address associated
                    with your account.
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="forgot-field">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {error && (
                        <div className="forgot-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="forgot-success">
                            <div>{success}</div>

                            <button
                                type="button"
                                className="go-reset-button"
                                onClick={() => navigate("/reset-password")}
                            >
                                Continue to Reset Password
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="forgot-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Request"}
                    </button>

                </form>

                <div className="forgot-login">

                    Remember your password?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ForgotPassword;