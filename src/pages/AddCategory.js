import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AddCategory = () => {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
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
                const response = await axios.get('http://localhost:8000/store/categories/', {
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
            await axios.post('http://localhost:8000/store/categories/', 
                category,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            
            toast.success('Category created successfully');
            navigate('/categories');
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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add Category</h1>
            
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
                            placeholder="Enter slug (auto-generated if left empty)"
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
                            value={category.description}
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
                            value={category.parent}
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
                            onClick={() => navigate('/categories')}
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
                            Save Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
