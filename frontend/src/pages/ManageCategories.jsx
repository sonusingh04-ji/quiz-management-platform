import React, { useEffect, useState } from "react";
import "./ManageCategories.css";

const API_URL = "http://localhost:3001/api/categories";

const ManageCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const token = localStorage.getItem("token");

    // ==========================================
    // Get Categories
    // ==========================================

    const fetchCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch categories"
                );
            }

            setCategories(data.data || []);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);


    // ==========================================
    // Reset Form
    // ==========================================

    const resetForm = () => {

        setName("");
        setDescription("");
        setEditingId(null);
        setShowForm(false);

    };


    // ==========================================
    // Add / Update Category
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name.trim()) {
            alert("Category name is required.");
            return;
        }

        try {

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {

                method,

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim()
                })

            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to save category"
                );

            }

            alert(
                editingId
                    ? "Category updated successfully."
                    : "Category created successfully."
            );

            resetForm();

            await fetchCategories();

        } catch (err) {

            alert(err.message);

        }

    };


    // ==========================================
    // Edit Category
    // ==========================================

    const handleEdit = (category) => {

        setEditingId(category.id);
        setName(category.name || "");
        setDescription(category.description || "");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // Delete Category
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to delete category"
                );

            }

            alert("Category deleted successfully.");

            await fetchCategories();

        } catch (err) {

            alert(err.message);

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="manage-categories-page">

                <div className="categories-loading">

                    <div className="loading-spinner"></div>

                    <p>Loading categories...</p>

                </div>

            </div>

        );

    }


    // ==========================================
    // Page
    // ==========================================

    return (

        <div className="manage-categories-page">

            {/* =====================================
                Header
            ====================================== */}

            <div className="categories-header">

                <div>

                    <h1>
                        Manage Categories
                    </h1>

                    <p>
                        Create, update and manage quiz categories.
                    </p>

                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        window.location.href = "/dashboard"
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* =====================================
                Main Container
            ====================================== */}

            <div className="categories-container">

                <div className="categories-title">

                    <div>

                        <h2>
                            Categories
                        </h2>

                        <p>

                            {categories.length}{" "}

                            {categories.length === 1
                                ? "category"
                                : "categories"}

                        </p>

                    </div>


                    <div className="categories-actions">

                        <button
                            className="refresh-category-btn"
                            onClick={fetchCategories}
                        >
                            🔄 Refresh
                        </button>


                        <button
                            className="add-category-btn"
                            onClick={() => {

                                resetForm();
                                setShowForm(true);

                            }}
                        >
                            + Add Category
                        </button>

                    </div>

                </div>


                {/* =====================================
                    Form
                ====================================== */}

                {showForm && (

                    <form
                        className="category-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-header">

                            <h3>

                                {editingId
                                    ? "Edit Category"
                                    : "Add New Category"}

                            </h3>


                            <button
                                type="button"
                                className="close-form-btn"
                                onClick={resetForm}
                            >
                                ✕
                            </button>

                        </div>


                        <div className="form-group">

                            <label>
                                Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Enter category description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows="4"
                            />

                        </div>


                        <div className="form-buttons">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-category-btn"
                            >

                                {editingId
                                    ? "Update Category"
                                    : "Create Category"}

                            </button>

                        </div>

                    </form>

                )}


                {/* =====================================
                    Error
                ====================================== */}

                {error && (

                    <div className="categories-error">

                        <div>
                            ⚠️
                        </div>

                        <h3>
                            Unable to load categories
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={fetchCategories}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =====================================
                    Empty
                ====================================== */}

                {!error && categories.length === 0 && (

                    <div className="no-categories">

                        <div>
                            📂
                        </div>

                        <h3>
                            No Categories Found
                        </h3>

                        <p>
                            Create your first quiz category.
                        </p>

                        <button
                            onClick={() => setShowForm(true)}
                        >
                            + Add Category
                        </button>

                    </div>

                )}


                {/* =====================================
                    Category List
                ====================================== */}

                {!error && categories.length > 0 && (

                    <div className="categories-grid">

                        {categories.map((category) => (

                            <div
                                className="category-card"
                                key={category.id}
                            >

                                <div className="category-icon">
                                    📚
                                </div>


                                <div className="category-content">

                                    <h3>
                                        {category.name}
                                    </h3>

                                    <p>
                                        {category.description ||
                                            "No description provided."}
                                    </p>

                                    <small>
                                        Category ID: #{category.id}
                                    </small>

                                </div>


                                <div className="category-actions">

                                    <button
                                        className="edit-category-btn"
                                        onClick={() =>
                                            handleEdit(category)
                                        }
                                    >
                                        ✏️ Edit
                                    </button>


                                    <button
                                        className="delete-category-btn"
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                    >
                                        🗑️ Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};

export default ManageCategories;