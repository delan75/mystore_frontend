import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const EditCategory = () => {
    const { id } = useParams();
    const { user, accessToken } = useAuth();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [parentCategories, setParentCategories] = useState([]);
    const [category, setCategory] = useState({
        name: '',
        slug: '',
        description: '',
        parent: ''
    });

    const hasManagementAccess = user?.role === 'manager' || user?.role === 'admin';

    // Fetch category data and parent categories
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;

            try {
                setFetchingData(true);

                // Fetch the category to edit
                const categoryResponse = await axios.get(`http://localhost:8000/store/categories/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                // Fetch all categories for parent dropdown
                const categoriesResponse = await axios.get('http://localhost:8000/store/categories/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                setCategory(categoryResponse.data);

                // Filter out the current category from parent options to prevent circular reference
                const filteredParents = (categoriesResponse.data.results || categoriesResponse.data)
                    .filter(cat => cat.id !== parseInt(id));

                setParentCategories(filteredParents);
            } catch (error) {
                console.error('Failed to fetch category data:', error);
                toast.error('Failed to load category data');
                history.push('/categories');
            } finally {
                setFetchingData(false);
            }
        };

        if (accessToken && id) {
            fetchData();
        }
    }, [accessToken, id, history]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category.name) {
            toast.error('Category name is required');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`http://localhost:8000/store/categories/${id}/`,
                category,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            toast.success('Category updated successfully');
            history.push('/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(error.response?.data?.detail || 'Failed to update category');
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

    if (fetchingData) {
        return (
            <div className="p-4 text-center">
                <i className="fas fa-spinner fa-spin text-[#1ab188] text-2xl"></i>
                <p className="mt-2">Loading category data...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={category.name}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={category.slug}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter slug"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={category.description || ''}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter category description"
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
                            Parent Category
                        </label>
                        <select
                            id="parent"
                            name="parent"
                            value={category.parent || ''}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">None (Top Level Category)</option>
                            {parentCategories.map(parent => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => history.push('/categories')}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#1ab188] hover:bg-[#179b77] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                        >
                            {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
                            Update Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;
