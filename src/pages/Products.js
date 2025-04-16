import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Products = () => {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
    });

    const hasManagementAccess = user?.role === 'manager' || user?.role === 'admin';

    const fetchCategories = async () => {
        if (!accessToken) return;

        try {
            // Try to fetch from categories/tree endpoint first
            const response = await axios.get('http://localhost:8000/store/categories/tree/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            // Create a map of category IDs to category names
            const categoryMap = {};
            const processCategories = (cats) => {
                cats.forEach(category => {
                    categoryMap[category.id] = category.name;
                    if (category.subcategories && category.subcategories.length > 0) {
                        processCategories(category.subcategories);
                    }
                });
            };

            processCategories(response.data);
            setCategories(categoryMap);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // If the tree endpoint fails, try the flat categories endpoint
            try {
                const response = await axios.get('http://localhost:8000/store/categories/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                const categoryMap = {};
                response.data.forEach(category => {
                    categoryMap[category.id] = category.name;
                });
                setCategories(categoryMap);
            } catch (fallbackError) {
                console.error('Failed to fetch categories (fallback):', fallbackError);
            }
        }
    };

    const fetchProducts = async (page) => {
        if (!accessToken) return;

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/store/products/?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            setProducts(response.data.results);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(response.data.count / 10),
                hasNext: !!response.data.next,
                hasPrevious: !!response.data.previous
            });
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('You do not have permission to view products');
                navigate('/dashboard');
            } else if (error.response?.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                navigate('/auth');
            } else {
                toast.error('Failed to fetch products');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch products if we have an access token
        if (accessToken) {
            fetchCategories();
            fetchProducts(pagination.currentPage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage, accessToken]);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8000/store/products/${productId}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                toast.success('Product deleted successfully');
                fetchProducts(pagination.currentPage);
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            await axios.patch(`http://localhost:8000/store/products/${productId}/`,
                { is_available: !currentStatus },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success('Product status updated');
            fetchProducts(pagination.currentPage);
        } catch (error) {
            toast.error('Failed to update product status');
        }
    };

    // Regular user view
    const RegularUserView = () => (
        <div className="container-fluid p-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Products List</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                                                <td>{categories[product.category] || `Category ${product.category}`}</td>
                                                <td>
                                                    <span className={`badge ${product.is_available ? 'bg-success' : 'bg-secondary'}`}>
                                                        {product.is_available ? 'Available' : 'Not Available'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <nav className="d-flex justify-content-between align-items-center mt-4">
                                <div className="text-muted">
                                    Showing page {pagination.currentPage} of {pagination.totalPages}
                                </div>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${!pagination.hasPrevious ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => fetchProducts(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevious}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => fetchProducts(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNext}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // Management view
    const ManagementView = () => (
        <div className="container-fluid p-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Products Management</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Date Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.id}</td>
                                                <td>{product.name}</td>
                                                <td>${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                                                <td>{categories[product.category] || `Category ${product.category}`}</td>
                                                <td>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={product.is_available}
                                                            onChange={() => handleToggleStatus(product.id, product.is_available)}
                                                        />
                                                        <label className="form-check-label">
                                                            {product.is_available ? 'Active' : 'Draft'}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>{product.date_created ? new Date(product.date_created).toLocaleDateString() : 'Invalid Date'}</td>
                                                <td>
                                                    <div className="btn-group">
                                                        <Link
                                                            to={`/products/edit/${product.id}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="btn btn-sm btn-outline-danger"
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

                            <nav className="d-flex justify-content-between align-items-center mt-4">
                                <div className="text-muted">
                                    Showing page {pagination.currentPage} of {pagination.totalPages}
                                </div>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${!pagination.hasPrevious ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => fetchProducts(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevious}
                                        >
                                            <i className="fas fa-chevron-left me-2"></i>
                                            Previous
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => fetchProducts(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNext}
                                        >
                                            Next
                                            <i className="fas fa-chevron-right ms-2"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="content-wrapper ms-0 ms-md-64 bg-light min-vh-100">
            <div className="p-4">
                {hasManagementAccess ? <ManagementView /> : <RegularUserView />}
            </div>
        </div>
    );
};

export default Products;


