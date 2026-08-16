import { Routes, Route } from "react-router-dom";

// =====================================================
// AUTH
// =====================================================
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// =====================================================
// STUDENT PAGES
// =====================================================
import Dashboard from "./pages/Dashboard.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";
import TakeQuiz from "./pages/TakeQuiz.jsx";
import History from "./pages/History.jsx";
import AttemptDetails from "./pages/AttemptDetails.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Results from "./pages/Results.jsx";
import Profile from "./pages/Profile.jsx";
import Discover from "./pages/Discover.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// =====================================================
// ADMIN PAGES
// =====================================================
import ManageQuizzes from "./pages/ManageQuizzes.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import AdminResults from "./pages/AdminResults.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import Reports from "./pages/Reports";
import ManageCategories from "./pages/ManageCategories.jsx";
function App() {
    return (
        <Routes>

            {/* =================================================
                LOGIN
            ================================================= */}
            <Route
                path="/"
                element={<Login />}
            />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
            <Route
                path="/register"
                element={<Register />}
            />

            {/* =================================================
                DASHBOARD
                Admin and Student dashboard are currently handled
                by Dashboard.jsx
            ================================================= */}
            <Route
                path="/dashboard"
                element={<Dashboard />}
            />


            {/* =================================================
                CREATE QUIZ
            ================================================= */}
            <Route
                path="/create-quiz"
                element={<CreateQuiz />}
            />


            {/* =================================================
                MANAGE QUIZZES
                ADMIN
            ================================================= */}
            <Route
                path="/manage-quizzes"
                element={<ManageQuizzes />}
            />


            {/* =================================================
                MANAGE USERS
                ADMIN
            ================================================= */}
            <Route
                path="/manage-users"
                element={<ManageUsers />}
            />


            {/* =================================================
                TAKE QUIZ
                STUDENT
            ================================================= */}
            <Route
                path="/quiz/:id"
                element={<TakeQuiz />}
            />


            {/* =================================================
                HISTORY
                STUDENT
            ================================================= */}
            <Route
                path="/history"
                element={<History />}
            />


            {/* =================================================
                ATTEMPT DETAILS
                STUDENT
            ================================================= */}
            <Route
                path="/attempt-details/:attemptId"
                element={<AttemptDetails />}
            />


            {/* =================================================
                LEADERBOARD
                STUDENT
            ================================================= */}
            <Route
                path="/leaderboard"
                element={<Leaderboard />}
            />


            {/* =================================================
                STUDENT RESULTS
            ================================================= */}
            <Route
                path="/results"
                element={<Results />}
            />


            {/* =================================================
                ADMIN RESULTS
            ================================================= */}
            <Route
                path="/admin/results"
                element={<AdminResults />}
            />


            {/* =================================================
                PROFILE
            ================================================= */}
            <Route
                path="/profile"
                element={<Profile />}
            />


            {/* =================================================
                DISCOVER
                STUDENT
            ================================================= */}
            <Route
                path="/discover"
                element={<Discover />}
            />


            {/* =================================================
                ADMIN ANALYTICS
            ================================================= */}
            <Route
                path="/admin/analytics"
                element={<AdminAnalytics />}
            />
                <Route
                    path="/admin/categories"
                    element={<ManageCategories />}
                />
                <Route
                    path="/reports"
                    element={<Reports />}
                />
        </Routes>
    );
}

export default App;