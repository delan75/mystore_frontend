import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import CreateOrderForm from '../components/CreateOrderForm';
import '../styles/Orders.css';

const Orders = () => {
    const { user, accessToken } = useAuth();
    const { formatPriceSync, selectedCurrency } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [orderItems, setOrderItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        pageSize: 10,
        totalItems: 0
    });
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const isAdmin = user?.role === 'admin';
    const isManager = user?.role === 'manager';
    const hasManagementAccess = isAdmin || isManager;

    // Fetch orders
    const fetchOrders = async (page) => {
        if (!accessToken) return;

        try {
            setLoading(true);
            const response = await axios.get('/orders/', {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    page: page,
                    page_size: itemsPerPage
                }
            });

            setOrders(response.data.results || []);

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
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to fetch orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch order details including items
    const fetchOrderDetails = async (orderId) => {
        if (!accessToken || orderItems[orderId]) return;

        try {
            const response = await axios.get(`/orders/${orderId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            setOrderItems(prev => ({
                ...prev,
                [orderId]: response.data.items || []
            }));
        } catch (error) {
            console.error(`Failed to fetch details for order ${orderId}:`, error);
            toast.error('Failed to load order details');
        }
    };

    // Toggle order expansion to show/hide items
    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newState = { ...prev };
            newState[orderId] = !prev[orderId];

            // Fetch order details if expanding and not already loaded
            if (newState[orderId] && !orderItems[orderId]) {
                fetchOrderDetails(orderId);
            }

            return newState;
        });
    };

    // Handle order cancellation
    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await axios.post(`/orders/${orderId}/cancel/`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                toast.success('Order canceled successfully');

                // Update the order status in the UI
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, status: 'cancelled' } : order
                    )
                );
            } catch (error) {
                console.error('Failed to cancel order:', error);
                toast.error(error.response?.data?.error || 'Failed to cancel order');
            }
        }
    };

    // Handle order checkout
    const handleCheckout = async (orderId) => {
        try {
            // Set processing state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, processing: true } : order
                )
            );

            await axios.post(`/orders/${orderId}/checkout/`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            toast.success('Order checkout successful!');

            // Update the order in the UI
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? {
                        ...order,
                        status: 'processing',
                        processing: false
                    } : order
                )
            );
        } catch (error) {
            console.error('Failed to checkout order:', error);

            // Remove processing state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, processing: false } : order
                )
            );

            toast.error(error.response?.data?.error || 'Failed to checkout order');
        }
    };

    // Handle order status update (admin/manager only)
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`/orders/${orderId}/update-status/`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            toast.success(`Order status updated to ${newStatus}`);

            // Update the order status in the UI
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error(error.response?.data?.error || 'Failed to update order status');
        }
    };

    // Handle request return
    const handleRequestReturn = async (orderId) => {
        try {
            await axios.post(`/orders/${orderId}/issues/`, {
                issue_type: 'return',
                description: 'Customer requested return'
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            toast.success('Return request submitted successfully');
        } catch (error) {
            console.error('Failed to request return:', error);
            toast.error('Failed to submit return request');
        }
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        const newSize = parseInt(e.target.value);
        setItemsPerPage(newSize);
        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            pageSize: newSize
        }));
    };

    // Handle page change
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

    // Handle new order creation
    const handleOrderCreated = (newOrder) => {
        setShowCreateForm(false);
        toast.success(`Order #${newOrder.order_number} created successfully`);
        fetchOrders(1); // Refresh the orders list and go to first page
    };

    // Fetch orders when component mounts or pagination changes
    useEffect(() => {
        if (accessToken) {
            fetchOrders(pagination.currentPage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage, accessToken, itemsPerPage]);

    // Get status badge class based on order status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'paid':
                return 'status-paid';
            case 'processing':
                return 'status-processing';
            case 'shipped':
                return 'status-shipped';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-default';
        }
    };

    // Render status options for admin/manager
    const renderStatusOptions = (order) => {
        if (!hasManagementAccess) return null;

        const availableStatuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];

        return (
            <div className="status-update-dropdown">
                <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="form-select form-select-sm"
                >
                    {availableStatuses.map(status => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    // Render action buttons based on order status and user role
    const renderActionButtons = (order) => {
        return (
            <div className="action-buttons">
                <button
                    className="btn-view"
                    onClick={() => toggleOrderExpansion(order.id)}
                    title={expandedOrders[order.id] ? "Hide Details" : "View Details"}
                >
                    <i className={`fas fa-${expandedOrders[order.id] ? 'chevron-up' : 'chevron-down'}`}></i>
                    {expandedOrders[order.id] ? 'Hide Details' : 'View Details'}
                </button>

                {order.status === 'pending' && (
                    <>
                        <button
                            className="btn-checkout"
                            onClick={() => handleCheckout(order.id)}
                            disabled={order.processing}
                            title="Checkout Order"
                        >
                            {order.processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-credit-card"></i> Checkout
                                </>
                            )}
                        </button>

                        <button
                            className="btn-cancel"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={order.processing}
                            title="Cancel Order"
                        >
                            <i className="fas fa-times"></i> Cancel
                        </button>
                    </>
                )}

                {(order.status === 'shipped' || order.status === 'completed') && (
                    <button
                        className="btn-return"
                        onClick={() => handleRequestReturn(order.id)}
                        title="Request Return"
                    >
                        <i className="fas fa-undo"></i> Return
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="orders-container p-4">
            <div className="orders-header mb-4">
                <h1 className="orders-title">Orders</h1>
                <div className="orders-actions">
                    <button
                        className="btn-create-order"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? (
                            <><i className="fas fa-times"></i> Cancel</>
                        ) : (
                            <><i className="fas fa-plus"></i> Create Order</>
                        )}
                    </button>
                </div>
            </div>

            {/* Create Order Form */}
            {showCreateForm && (
                <CreateOrderForm
                    onOrderCreated={handleOrderCreated}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Loading orders...</p>
                </div>
            ) : (
                <div className="orders-card">
                    <div className="orders-card-body">
                        {orders.length === 0 ? (
                            <div className="no-orders-message">
                                <i className="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                                <p>No orders found.</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Order Number</th>
                                                <th>Date</th>
                                                <th>Total Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <React.Fragment key={order.id}>
                                                    <tr>
                                                        <td>{order.order_number}</td>
                                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td>{selectedCurrency ? formatPriceSync(order.total_amount) : 'Loading...'}</td>
                                                        <td>
                                                            <div className="status-container">
                                                                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                                {hasManagementAccess && renderStatusOptions(order)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {renderActionButtons(order)}
                                                        </td>
                                                    </tr>

                                                    {/* Order Items (Expanded View) */}
                                                    {expandedOrders[order.id] && (
                                                        <tr className="order-details-row">
                                                            <td colSpan="5">
                                                                <div className="order-details">
                                                                    <h6 className="order-details-title">Order Items</h6>

                                                                    {!orderItems[order.id] ? (
                                                                        <div className="loading-items">
                                                                            <i className="fas fa-spinner fa-spin"></i> Loading items...
                                                                        </div>
                                                                    ) : orderItems[order.id].length === 0 ? (
                                                                        <p className="no-items-message">No items found for this order.</p>
                                                                    ) : (
                                                                        <table className="items-table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Product</th>
                                                                                    <th>Quantity</th>
                                                                                    <th>Price</th>
                                                                                    <th>Total</th>
                                                                                    {hasManagementAccess && <th>Backordered</th>}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {orderItems[order.id].map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item.product_name || `Product #${item.product}`}</td>
                                                                                        <td>{item.quantity}</td>
                                                                                        <td>{selectedCurrency ? formatPriceSync(item.price) : 'Loading...'}</td>
                                                                                        <td>{selectedCurrency ? formatPriceSync(item.price * item.quantity) : 'Loading...'}</td>
                                                                                        {hasManagementAccess && (
                                                                                            <td>
                                                                                                {item.backordered_quantity > 0 ? (
                                                                                                    <span className="backordered-badge">
                                                                                                        {item.backordered_quantity}
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="in-stock-badge">0</span>
                                                                                                )}
                                                                                            </td>
                                                                                        )}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
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
                                        Showing {orders.length > 0 ? (pagination.currentPage - 1) * pagination.pageSize + 1 : 0} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
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

export default Orders;
