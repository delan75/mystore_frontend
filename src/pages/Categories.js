import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import '../styles/Categories.css';

const Categories = () => {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        pageSize: 10,
        totalItems: 0
    });
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const hasManagementAccess = user?.role === 'manager' || user?.role === 'admin';

    // Create a map of category IDs to names for parent category display
    useEffect(() => {
        if (categories.length > 0) {
            const map = {};
            categories.forEach(category => {
                map[category.id] = category.name;
            });
            setCategoryMap(map);
        }
    }, [categories]);

    const fetchCategories = async (page) => {
        if (!accessToken) return;

        try {
            setLoading(true);
            const response = await axios.get(`/store/categories/?page=${page}&page_size=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            setCategories(response.data.results || response.data);

            // Handle pagination if the API supports it
            if (response.data.count !== undefined) {
                setPagination({
                    currentPage: page,
                    totalPages: Math.ceil(response.data.count / itemsPerPage),
                    hasNext: !!response.data.next,
                    hasPrevious: !!response.data.previous,
                    pageSize: itemsPerPage,
                    totalItems: response.data.count
                });
            }
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('You do not have permission to view categories');
                navigate('/dashboard');
            } else if (error.response?.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                navigate('/auth');
            } else {
                toast.error('Failed to fetch categories');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch categories if we have an access token
        if (accessToken) {
            fetchCategories(pagination.currentPage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage, accessToken, itemsPerPage]);

    const handleItemsPerPageChange = (e) => {
        const newSize = parseInt(e.target.value);
        setItemsPerPage(newSize);
        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            pageSize: newSize
        }));
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`/store/categories/${categoryId}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                toast.success('Category deleted successfully');
                fetchCategories(pagination.currentPage);
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const totalPages = pagination.totalPages;
        const currentPage = pagination.currentPage;
        const pageNumbers = [];

        // Always show first page
        pageNumbers.push(1);

        // Calculate range of pages to show around current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pageNumbers.push('...');
        }

        // Add pages in range
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
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
        <div className="categories-container p-4">
            <div className="categories-header mb-4">
                <h1 className="categories-title">Categories</h1>
                <Link
                    to="/categories/add"
                    className="btn-add-category"
                >
                    <i className="fas fa-plus"></i>
                    Add Category
                </Link>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Loading categories...</p>
                </div>
            ) : (
                <div className="categories-card">
                    <div className="categories-card-body">
                        {categories.length === 0 ? (
                            <div className="no-categories-message">
                                <i className="fas fa-tags fa-3x mb-3 text-muted"></i>
                                <p>No categories found. Create your first category!</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Slug</th>
                                                <th>Parent</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((category) => (
                                                <tr key={category.id}>
                                                    <td>{category.id}</td>
                                                    <td>{category.name}</td>
                                                    <td>{category.slug}</td>
                                                    <td>
                                                        {category.parent
                                                            ? categoryMap[category.parent] || 'Loading...'
                                                            : 'None'}
                                                    </td>
                                                    <td>
                                                        {category.date_created
                                                            ? new Date(category.date_created).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Link
                                                                to={`/categories/edit/${category.id}`}
                                                                className="btn-edit"
                                                                title="Edit Category"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                                className="btn-delete"
                                                                title="Delete Category"
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

                                <div className="pagination-controls">
                                    <div className="items-per-page">
                                        <label>Show</label>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </select>
                                        <span>entries</span>
                                    </div>

                                    <div className="pagination-info">
                                        Showing {categories.length > 0 ? (pagination.currentPage - 1) * pagination.pageSize + 1 : 0} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
                                    </div>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="pagination-wrapper">
                                        <ul className="pagination">
                                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(1)}
                                                    aria-label="First"
                                                >
                                                    <i className="fas fa-angle-double-left"></i>
                                                </button>
                                            </li>
                                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                    aria-label="Previous"
                                                >
                                                    <i className="fas fa-angle-left"></i>
                                                </button>
                                            </li>

                                            {getPageNumbers().map((page, index) => (
                                                page === '...' ? (
                                                    <li key={`ellipsis-${index}`} className="page-item disabled">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                ) : (
                                                    <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </button>
                                                    </li>
                                                )
                                            ))}

                                            <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                    aria-label="Next"
                                                >
                                                    <i className="fas fa-angle-right"></i>
                                                </button>
                                            </li>
                                            <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(pagination.totalPages)}
                                                    aria-label="Last"
                                                >
                                                    <i className="fas fa-angle-double-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
