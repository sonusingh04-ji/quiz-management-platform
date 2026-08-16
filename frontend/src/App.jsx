import { Routes, Route } from "react-router-dom";

// =====================================================
// ADMIN DASHBOARD
// =====================================================
import AdminDashboard from "./pages/AdminDashboard.jsx";

// =====================================================
// AUTH
// =====================================================
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

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

// =====================================================
// ADMIN PAGES
// =====================================================
import ManageQuizzes from "./pages/ManageQuizzes.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import AdminResults from "./pages/AdminResults.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import ManageCategories from "./pages/ManageCategories.jsx";
import Reports from "./pages/Reports.jsx";


function App() {
    return (
        <Routes>

            {/* =================================================
                AUTHENTICATION
            ================================================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />


            {/* =================================================
                STUDENT DASHBOARD
                ================================================= */}

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />


            {/* =================================================
                ADMIN DASHBOARD
                ================================================= */}

            <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
            />


            {/* =================================================
                STUDENT - CREATE QUIZ
                ================================================= */}

            <Route
                path="/create-quiz"
                element={<CreateQuiz />}
            />


            {/* =================================================
                STUDENT - TAKE QUIZ
                ================================================= */}

            <Route
                path="/quiz/:id"
                element={<TakeQuiz />}
            />


            {/* =================================================
                STUDENT - HISTORY
                ================================================= */}

            <Route
                path="/history"
                element={<History />}
            />


            {/* =================================================
                STUDENT - ATTEMPT DETAILS
                ================================================= */}

            <Route
                path="/attempt-details/:attemptId"
                element={<AttemptDetails />}
            />


            {/* =================================================
                STUDENT - LEADERBOARD
                ================================================= */}

            <Route
                path="/leaderboard"
                element={<Leaderboard />}
            />


            {/* =================================================
                STUDENT - RESULTS
                ================================================= */}

            <Route
                path="/results"
                element={<Results />}
            />


            {/* =================================================
                STUDENT - PROFILE
                ================================================= */}

            <Route
                path="/profile"
                element={<Profile />}
            />


            {/* =================================================
                STUDENT - DISCOVER
                ================================================= */}

            <Route
                path="/discover"
                element={<Discover />}
            />


            {/* =================================================
                ADMIN - MANAGE QUIZZES
                ================================================= */}

            <Route
                path="/manage-quizzes"
                element={<ManageQuizzes />}
            />


            {/* =================================================
                ADMIN - MANAGE USERS
                ================================================= */}

            <Route
                path="/manage-users"
                element={<ManageUsers />}
            />


            {/* =================================================
                ADMIN - RESULTS
                ================================================= */}

            <Route
                path="/admin/results"
                element={<AdminResults />}
            />


            {/* =================================================
                ADMIN - ANALYTICS
                ================================================= */}

            <Route
                path="/admin/analytics"
                element={<AdminAnalytics />}
            />


            {/* =================================================
                ADMIN - CATEGORIES
                ================================================= */}

            <Route
                path="/admin/categories"
                element={<ManageCategories />}
            />


            {/* =================================================
                ADMIN - REPORTS
                ================================================= */}

            <Route
                path="/reports"
                element={<Reports />}
            />


        </Routes>
    );
}

export default App;