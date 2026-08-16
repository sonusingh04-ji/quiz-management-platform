import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ManageUsers.css";

const ManageUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    // ==========================================
    // Fetch All Users
    // ==========================================
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            const data = response.data;

            if (Array.isArray(data)) {
                setUsers(data);
            } else if (Array.isArray(data.data)) {
                setUsers(data.data);
            } else {
                setUsers([]);
            }

        } catch (error) {
            console.error("Failed to fetch users:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load users."
            );

            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Helpers
    // ==========================================
    const getUserId = (user) => {
        return user.id || user.user_id;
    };

    const getUserName = (user) => {
        return (
            user.full_name ||
            user.fullName ||
            user.name ||
            "Unknown User"
        );
    };

    const getUserEmail = (user) => {
        return user.email || "No email";
    };

    const getUserRole = (user) => {
        return user.role || "student";
    };

    const getUserStatus = (user) => {
        if (typeof user.is_active === "boolean") {
            return user.is_active;
        }

        if (typeof user.isActive === "boolean") {
            return user.isActive;
        }

        if (typeof user.active === "boolean") {
            return user.active;
        }

        return true;
    };

    // ==========================================
    // Search
    // ==========================================
    const filteredUsers = useMemo(() => {

        const value = search.trim().toLowerCase();

        if (!value) {
            return users;
        }

        return users.filter((user) => {

            const name = getUserName(user).toLowerCase();
            const email = getUserEmail(user).toLowerCase();
            const role = getUserRole(user).toLowerCase();
            const id = String(getUserId(user));

            return (
                name.includes(value) ||
                email.includes(value) ||
                role.includes(value) ||
                id.includes(value)
            );
        });

    }, [users, search]);

    // ==========================================
    // Activate / Deactivate
    // ==========================================
    const handleStatusChange = async (user) => {

        const userId = getUserId(user);
        const currentStatus = getUserStatus(user);
        const newStatus = !currentStatus;

        if (!userId) {
            alert("User ID not found.");
            return;
        }

        try {

            setUpdatingId(userId);

            await api.put(
                `/admin/users/${userId}/status`,
                {
                    isActive: newStatus,
                }
            );

            setUsers((previousUsers) =>
                previousUsers.map((item) => {

                    if (getUserId(item) === userId) {

                        return {
                            ...item,
                            is_active: newStatus,
                            isActive: newStatus,
                        };
                    }

                    return item;
                })
            );

        } catch (error) {

            console.error(
                "Failed to update user status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update user status."
            );

        } finally {
            setUpdatingId(null);
        }
    };

    // ==========================================
    // View User
    // ==========================================
    const handleViewUser = async (user) => {

        const userId = getUserId(user);

        if (!userId) {
            alert("User ID not found.");
            return;
        }

        try {

            setViewLoading(true);

            const response =
                await api.get(`/admin/users/${userId}`);

            const data = response.data?.data;

            setSelectedUser(data || user);

        } catch (error) {

            console.error(
                "Failed to fetch user:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load user details."
            );

        } finally {
            setViewLoading(false);
        }
    };

    // ==========================================
    // Delete User
    // ==========================================
    const handleDeleteUser = async (user) => {

        const userId = getUserId(user);

        if (!userId) {
            alert("User ID not found.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${getUserName(user)}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(userId);

            await api.delete(
                `/admin/users/${userId}`
            );

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (item) =>
                        getUserId(item) !== userId
                )
            );

            if (
                selectedUser &&
                getUserId(selectedUser) === userId
            ) {
                setSelectedUser(null);
            }

            alert("User deleted successfully.");

        } catch (error) {

            console.error(
                "Failed to delete user:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete user."
            );

        } finally {
            setDeletingId(null);
        }
    };

    // ==========================================
    // Statistics
    // ==========================================
    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => getUserStatus(user)
    ).length;

    const inactiveUsers =
        totalUsers - activeUsers;

    const students = users.filter(
        (user) =>
            getUserRole(user)
                .toLowerCase() === "student"
    ).length;

    // ==========================================
    // UI
    // ==========================================
    return (
        <div className="manage-users-page">

            {/* Header */}
            <header className="manage-users-header">

                <div>
                    <h1>👥 Manage Users</h1>

                    <p>
                        View and manage users registered
                        on the platform.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* Statistics */}
            <section className="user-statistics">

                <div className="user-stat-card">
                    <div className="stat-icon">👥</div>

                    <div>
                        <span>Total Users</span>
                        <strong>{totalUsers}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="stat-icon active-icon">
                        🟢
                    </div>

                    <div>
                        <span>Active Users</span>
                        <strong>{activeUsers}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="stat-icon inactive-icon">
                        🔴
                    </div>

                    <div>
                        <span>Inactive Users</span>
                        <strong>{inactiveUsers}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="stat-icon student-icon">
                        🎓
                    </div>

                    <div>
                        <span>Students</span>
                        <strong>{students}</strong>
                    </div>
                </div>

            </section>


            {/* Users Container */}
            <section className="users-container">

                <div className="users-title">

                    <div>
                        <h2>All Users</h2>

                        <p>
                            {filteredUsers.length} of{" "}
                            {totalUsers} users shown
                        </p>
                    </div>

                    <button
                        className="refresh-users-btn"
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>

                </div>


                {/* Search */}
                <div className="users-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by name, email, role or ID..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            className="clear-search-btn"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ✕
                        </button>
                    )}

                </div>


                {/* Loading */}
                {loading && (
                    <div className="users-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="users-error">

                        <div>⚠️</div>

                        <h3>
                            Unable to load users
                        </h3>

                        <p>{error}</p>

                        <button onClick={fetchUsers}>
                            Try Again
                        </button>

                    </div>
                )}


                {/* Empty */}
                {!loading &&
                    !error &&
                    users.length === 0 && (

                        <div className="no-users">

                            <div>👥</div>

                            <h3>
                                No users found
                            </h3>

                            <p>
                                There are currently no
                                users registered.
                            </p>

                        </div>
                    )}


                {/* Search Empty */}
                {!loading &&
                    !error &&
                    users.length > 0 &&
                    filteredUsers.length === 0 && (

                        <div className="no-users">

                            <div>🔍</div>

                            <h3>
                                No matching users
                            </h3>

                            <p>
                                Try a different search.
                            </p>

                        </div>
                    )}


                {/* Table */}
                {!loading &&
                    !error &&
                    filteredUsers.length > 0 && (

                        <div className="users-table-wrapper">

                            <table className="users-table">

                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>

                                <tbody>

                                {filteredUsers.map(
                                    (user) => {

                                        const userId =
                                            getUserId(user);

                                        const active =
                                            getUserStatus(user);

                                        return (
                                            <tr key={userId}>

                                                <td>
                                                    <div className="user-info">

                                                        <div className="user-avatar">
                                                            {getUserName(
                                                                user
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {getUserName(
                                                                    user
                                                                )}
                                                            </strong>

                                                            <small>
                                                                ID:{" "}
                                                                {userId}
                                                            </small>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="user-email">
                                                        {getUserEmail(
                                                            user
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`role-badge ${getUserRole(
                                                            user
                                                        ).toLowerCase()}`}
                                                    >
                                                        {getUserRole(
                                                            user
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`status-badge ${
                                                            active
                                                                ? "active"
                                                                : "inactive"
                                                        }`}
                                                    >
                                                        {active
                                                            ? "● Active"
                                                            : "● Inactive"}
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="user-actions">

                                                        <button
                                                            className="view-user-btn"
                                                            onClick={() =>
                                                                handleViewUser(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            👁 View
                                                        </button>

                                                        <button
                                                            className={`status-action-btn ${
                                                                active
                                                                    ? "deactivate"
                                                                    : "activate"
                                                            }`}
                                                            disabled={
                                                                updatingId ===
                                                                userId
                                                            }
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            {updatingId ===
                                                            userId
                                                                ? "Updating..."
                                                                : active
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                        </button>

                                                        <button
                                                            className="delete-user-btn"
                                                            disabled={
                                                                deletingId ===
                                                                userId
                                                            }
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            {deletingId ===
                                                            userId
                                                                ? "Deleting..."
                                                                : "🗑 Delete"}
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                                </tbody>

                            </table>

                        </div>
                    )}


                {/* User Details */}
                {selectedUser && (
                    <div className="user-details-overlay">

                        <div className="user-details-modal">

                            <div className="user-details-header">

                                <div>
                                    <h2>
                                        👤 User Details
                                    </h2>

                                    <p>
                                        Account information
                                    </p>
                                </div>

                                <button
                                    className="close-user-details"
                                    onClick={() =>
                                        setSelectedUser(null)
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                            {viewLoading ? (
                                <div className="user-details-loading">
                                    Loading...
                                </div>
                            ) : (
                                <div className="user-details-content">

                                    <div className="detail-avatar">
                                        {getUserName(
                                            selectedUser
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="detail-row">
                                        <span>Name</span>
                                        <strong>
                                            {getUserName(
                                                selectedUser
                                            )}
                                        </strong>
                                    </div>

                                    <div className="detail-row">
                                        <span>Email</span>
                                        <strong>
                                            {getUserEmail(
                                                selectedUser
                                            )}
                                        </strong>
                                    </div>

                                    <div className="detail-row">
                                        <span>Role</span>
                                        <strong>
                                            {getUserRole(
                                                selectedUser
                                            )}
                                        </strong>
                                    </div>

                                    <div className="detail-row">
                                        <span>Status</span>
                                        <strong>
                                            {getUserStatus(
                                                selectedUser
                                            )
                                                ? "Active"
                                                : "Inactive"}
                                        </strong>
                                    </div>

                                    <div className="detail-row">
                                        <span>User ID</span>
                                        <strong>
                                            {getUserId(
                                                selectedUser
                                            )}
                                        </strong>
                                    </div>

                                    <div className="detail-row">
                                        <span>Created At</span>
                                        <strong>
                                            {selectedUser.created_at
                                                ? new Date(
                                                    selectedUser.created_at
                                                ).toLocaleString()
                                                : "Not available"}
                                        </strong>
                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                )}

            </section>

        </div>
    );
};

export default ManageUsers;