import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import '../styles/CategoryForm.css';

const AddCategory = () => {
    const { user, accessToken } = useAuth();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [category, setCategory] = useState({
        name: '',
        slug: '',
        description: '',
        parent: ''
    });

    const hasManagementAccess = user?.role === 'manager' || user?.role === 'admin';

    // Fetch parent categories for dropdown
    useEffect(() => {
        const fetchParentCategories = async () => {
            if (!accessToken) return;

            try {
                const response = await axios.get('/store/categories/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                setParentCategories(response.data.results || response.data);
            } catch (error) {
                console.error('Failed to fetch parent categories:', error);
                toast.error('Failed to load parent categories');
            }
        };

        if (accessToken) {
            fetchParentCategories();
        }
    }, [accessToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name if slug field is empty
        if (name === 'name' && !category.slug) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setCategory(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category.name) {
            toast.error('Category name is required');
            return;
        }

        try {
            setLoading(true);
            await axios.post('/store/categories/',
                category,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            toast.success('Category created successfully');
            history.push('/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error(error.response?.data?.detail || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    if (!hasManagementAccess) {
        return (
            <div className="p-4">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Access Restricted</p>
                    <p>You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-form-container p-4">
            <div className="category-form-header mb-4">
                <h1 className="category-form-title">Add Category</h1>
                <Link to="/categories" className="btn-back">
                    <i className="fas fa-arrow-left"></i>
                    Back to Categories
                </Link>
            </div>

            <div className="category-form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">
                            Category Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={category.name}
                            onChange={handleInputChange}
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="slug">
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={category.slug}
                            onChange={handleInputChange}
                            placeholder="Enter slug (auto-generated if left empty)"
                        />
                        <div className="form-help-text">
                            The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={category.description}
                            onChange={handleInputChange}
                            placeholder="Enter category description"
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="parent">
                            Parent Category
                        </label>
                        <select
                            id="parent"
                            name="parent"
                            value={category.parent}
                            onChange={handleInputChange}
                        >
                            <option value="">None (Top Level Category)</option>
                            {parentCategories.map(parent => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => history.push('/categories')}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-save"
                        >
                            {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
                            Save Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
