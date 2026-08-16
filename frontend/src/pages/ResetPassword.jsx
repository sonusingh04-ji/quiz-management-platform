import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ResetPassword.css";

const ResetPassword = () => {

    const navigate = useNavigate();

    const [token, setToken] = useState(
        localStorage.getItem("resetToken") || ""
    );

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError("Reset token is missing.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/reset-password",
                {
                    token,
                    newPassword
                }
            );

            setSuccess(
                response.data?.message ||
                "Password reset successful."
            );

            // Remove used token
            localStorage.removeItem("resetToken");

            setToken("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Password reset failed."
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
        <div className="reset-page">

            <div className="reset-card">

                <h1>
                    Quiz Management Platform
                </h1>

                <p>
                    Create a new password
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="reset-field">

                        <label>
                            Reset Token
                        </label>

                        <input
                            type="text"
                            value={token}
                            onChange={(e) =>
                                setToken(e.target.value)
                            }
                            placeholder="Enter reset token"
                            required
                        />

                    </div>

                    <div className="reset-field">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            required
                        />

                    </div>

                    <div className="reset-field">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm new password"
                            required
                        />

                    </div>

                    {error && (
                        <div className="reset-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="reset-success">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="reset-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"}
                    </button>

                </form>

                <div className="reset-login">

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

export default ResetPassword;