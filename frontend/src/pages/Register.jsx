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

    // Account role
    const [role, setRole] = useState("student");

    // Admin registration code
    const [adminCode, setAdminCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Password confirmation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Password length
        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        // Admin code validation
        if (role === "admin" && !adminCode.trim()) {
            setError(
                "Admin registration code is required."
            );
            return;
        }

        setLoading(true);

        try {

            console.log("Registering user...");
            console.log("Role:", role);

            const response = await api.post(
                "/auth/register",
                {
                    fullName,
                    email,
                    password,
                    role,
                    adminCode:
                        role === "admin"
                            ? adminCode
                            : undefined
                }
            );

            console.log(
                "Registration response:",
                response.data
            );

            setSuccess(
                response.data?.message ||
                "Registration successful."
            );

            // Clear form
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAdminCode("");
            setRole("student");

            // Go to login
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Registration failed."
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
        <div className="register-page">

            <div className="register-card">

                {/* Title */}
                <h1>
                    Quiz Management Platform
                </h1>

                {/* Subtitle */}
                <p>
                    {role === "admin"
                        ? "Create your administrator account"
                        : "Create your student account"}
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <div className="register-field">

                        <label>
                            Full Name
                        </label>

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


                    {/* Email */}
                    <div className="register-field">

                        <label>
                            Email
                        </label>

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


                    {/* Account Type */}
                    <div className="register-field">

                        <label>
                            Account Type
                        </label>

                        <div className="role-options">

                            {/* Student */}
                            <label className="role-option">

                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={
                                        role === "student"
                                    }
                                    onChange={() => {
                                        setRole("student");
                                        setAdminCode("");
                                        setError("");
                                    }}
                                />

                                <span>
                                    Student
                                </span>

                            </label>


                            {/* Admin */}
                            <label className="role-option">

                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={
                                        role === "admin"
                                    }
                                    onChange={() => {
                                        setRole("admin");
                                        setError("");
                                    }}
                                />

                                <span>
                                    Admin
                                </span>

                            </label>

                        </div>

                    </div>


                    {/* Admin Registration Code */}
                    {role === "admin" && (

                        <div className="register-field admin-code-field">

                            <label>
                                Admin Registration Code
                            </label>

                            <input
                                type="password"
                                placeholder="Enter admin registration code"
                                value={adminCode}
                                onChange={(e) =>
                                    setAdminCode(
                                        e.target.value
                                    )
                                }
                                required
                            />

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

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Confirm Password */}
                    <div className="register-field">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}


                    {/* Success */}
                    {success && (
                        <div className="register-success">
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
                            ? "Creating Account..."
                            : role === "admin"
                                ? "Create Admin Account"
                                : "Create Student Account"}
                    </button>

                </form>


                {/* Login */}
                <div className="register-login">

                    Already have an account?{" "}

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

export default Register;