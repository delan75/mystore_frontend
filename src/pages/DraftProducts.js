import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const DraftProducts = () => {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const { formatPriceSync, selectedCurrency } = useCurrency();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
    });

    const hasManagementAccess = user?.role === 'manager' || user?.role === 'admin';

    const fetchDrafts = async (page) => {
        if (!accessToken) return;

        try {
            setLoading(true);
            const response = await axios.get(`/store/products/draft/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    page: page,
                    page_size: 10
                }
            });

            setDrafts(response.data.results || []);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(response.data.count / 10),
                hasNext: !!response.data.next,
                hasPrevious: !!response.data.previous
            });
        } catch (error) {
            console.error('Failed to fetch drafts:', error);
            if (error.response?.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                navigate('/auth');
            } else {
                toast.error('Failed to fetch draft products');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchDrafts(pagination.currentPage);
        }
    }, [pagination.currentPage, accessToken]);

    const handleDeleteDraft = async (draftId) => {
        if (window.confirm('Are you sure you want to delete this draft?')) {
            try {
                await axios.delete(`/store/products/draft/${draftId}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                toast.success('Draft deleted successfully');
                fetchDrafts(pagination.currentPage);
            } catch (error) {
                toast.error('Failed to delete draft');
            }
        }
    };

    const handlePublishDraft = async (draftId) => {
        try {
            await axios.post(`/store/products/draft/${draftId}/publish/`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            toast.success('Draft published successfully');
            fetchDrafts(pagination.currentPage);
        } catch (error) {
            console.error('Error publishing draft:', error);
            if (error.response?.data?.error) {
                toast.error(`Failed to publish: ${error.response.data.error}`);
            } else {
                toast.error('Failed to publish draft. Please ensure all required fields are filled.');
            }
        }
    };

    const handleContinueEditing = (draftId) => {
        navigate(`/products/add?draft=${draftId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-800">Draft Products</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Your Draft Products</h2>
                        <Link 
                            to="/products/add" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Create New Product
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : drafts.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-5xl mb-4">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <p className="text-gray-500 mb-4">You don't have any draft products yet.</p>
                            <Link 
                                to="/products/add" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Create Your First Product
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Updated
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {drafts.map((draft) => (
                                            <tr key={draft.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {draft.name || 'Unnamed Draft'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {draft.price ? (selectedCurrency ? formatPriceSync(draft.price) : draft.price) : 'Not set'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {draft.category_name || 'Not set'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(draft.updated_at).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleContinueEditing(draft.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Continue Editing"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        
                                                        {hasManagementAccess && (
                                                            <button
                                                                onClick={() => handlePublishDraft(draft.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Publish Draft"
                                                            >
                                                                <i className="fas fa-upload"></i>
                                                            </button>
                                                        )}
                                                        
                                                        <button
                                                            onClick={() => handleDeleteDraft(draft.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete Draft"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-500">
                                        Showing page {pagination.currentPage} of {pagination.totalPages}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => fetchDrafts(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevious}
                                            className={`px-3 py-1 rounded ${
                                                pagination.hasPrevious
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => fetchDrafts(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNext}
                                            className={`px-3 py-1 rounded ${
                                                pagination.hasNext
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DraftProducts;
