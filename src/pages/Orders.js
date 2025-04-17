import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import CreateOrderForm from '../components/CreateOrderForm';
import '../styles/Orders.css';

const Orders = ({ mode = 'my' }) => {
    const { user, accessToken } = useAuth();
    const { formatPriceSync, selectedCurrency } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [orderItems, setOrderItems] = useState({});
    const [userNames, setUserNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [bulkActionStatus, setBulkActionStatus] = useState('pending');
    const [processingBulkAction, setProcessingBulkAction] = useState(false);
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
    const isCashier = user?.role === 'cashier';
    const hasManagementAccess = isAdmin || isManager;
    const hasOrderManagementAccess = isAdmin || isManager || isCashier;
    const canModifyOrders = isAdmin || isManager;

    const navigate = useNavigate();

    // Define fetchOrders function outside useEffect so it can be called from elsewhere
    const fetchOrders = async (pageNumber) => {
        if (!accessToken) return;

        try {
            setLoading(true);

            // Determine the endpoint based on the mode
            let endpoint = '/orders/';
            let params = {
                page: pageNumber || pagination.currentPage,
                page_size: itemsPerPage
            };

            // For 'my' mode, we only want the user's orders
            if (mode === 'my') {
                params.user = user?.id;
            }
            // For 'manage' mode, we want all orders using the all orders endpoint
            else if (mode === 'manage' && hasOrderManagementAccess) {
                endpoint = '/orders/all/';
            }

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: params
            });

            const ordersData = response.data.results || [];
            setOrders(ordersData);

            // If in manage mode, fetch user names for all orders
            if (mode === 'manage' && hasOrderManagementAccess) {
                // Get unique user IDs from orders
                const userIds = [...new Set(ordersData.map(order => order.user))];

                // Fetch user names for each user ID that we don't already have
                userIds.forEach(async (userId) => {
                    if (!userNames[userId] && userId) {
                        try {
                            const userResponse = await axios.get(`/auth/users/${userId}/`, {
                                headers: { Authorization: `Bearer ${accessToken}` }
                            });
                            // Get the first available name (first name, last name, or username)
                            let displayName = userResponse.data.first_name || userResponse.data.last_name || userResponse.data.username || '';

                            // Truncate to max 6 characters
                            if (displayName.length > 6) {
                                displayName = displayName.substring(0, 6) + '...';
                            }

                            setUserNames(prev => ({
                                ...prev,
                                [userId]: displayName
                            }));
                        } catch (error) {
                            console.error(`Failed to fetch user details for ID ${userId}:`, error);
                            // Set a fallback name if we can't fetch the user details
                            setUserNames(prev => ({
                                ...prev,
                                [userId]: 'User'
                            }));
                        }
                    }
                });
            }

            // Handle pagination if the API supports it
            if (response.data.count !== undefined) {
                setPagination({
                    currentPage: pageNumber || pagination.currentPage,
                    totalPages: Math.ceil(response.data.count / itemsPerPage),
                    hasNext: !!response.data.next,
                    hasPrevious: !!response.data.previous,
                    pageSize: itemsPerPage,
                    totalItems: response.data.count
                });
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders from API when component mounts or dependencies change
    useEffect(() => {
        if (accessToken) {
            fetchOrders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, pagination.currentPage, itemsPerPage, mode, user?.id]);

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
        // Confirm checkout with the user
        if (window.confirm('Are you sure you want to checkout this order? This will process payment for the order.')) {
            try {
                // Set processing state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, processing: true } : order
                    )
                );

                // Call the checkout API
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

                // Navigate to dashboard after successful checkout
                navigate('/dashboard');
            } catch (error) {
                console.error('Failed to checkout order:', error);

                // Remove processing state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, processing: false } : order
                    )
                );

                // Show error message
                toast.error(error.response?.data?.error || 'Failed to checkout order');
            }
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

    // Handle marking an order as delivered (customer only)
    const handleMarkDelivered = async (orderId) => {
        if (window.confirm('Has this order been delivered to you? Marking as delivered will complete the order.')) {
            try {
                // Set processing state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, processing: true } : order
                    )
                );

                // Call the mark-delivered API
                await axios.post(`/orders/${orderId}/mark-delivered/`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                toast.success('Order marked as delivered!');

                // Update the order in the UI
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? {
                            ...order,
                            status: 'completed',
                            processing: false
                        } : order
                    )
                );
            } catch (error) {
                console.error('Failed to mark order as delivered:', error);

                // Remove processing state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, processing: false } : order
                    )
                );

                toast.error(error.response?.data?.error || 'Failed to mark order as delivered');
            }
        }
    };

    // Handle deleting an order (admin/manager only)
    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                // Set processing state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, processing: true } : order
                    )
                );

                // Call the delete API
                await axios.delete(`/orders/${orderId}/delete/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                toast.success('Order deleted successfully!');

                // Remove the order from the UI
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            } catch (error) {
                console.error('Failed to delete order:', error);

                // Remove processing state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, processing: false } : order
                    )
                );

                toast.error(error.response?.data?.error || 'Failed to delete order');
            }
        }
    };



    // Handle bulk operations
    const handleBulkOperation = async () => {
        if (selectedOrders.length === 0) {
            toast.error('Please select at least one order');
            return;
        }

        if (!bulkAction) {
            toast.error('Please select an action');
            return;
        }

        // For update_status operation, we need a status
        if (bulkAction === 'update_status' && !bulkActionStatus) {
            toast.error('Please select a status');
            return;
        }

        // Confirm with the user
        let confirmMessage = '';
        switch (bulkAction) {
            case 'cancel':
                confirmMessage = `Are you sure you want to cancel ${selectedOrders.length} orders?`;
                break;
            case 'update_status':
                confirmMessage = `Are you sure you want to update the status of ${selectedOrders.length} orders to ${bulkActionStatus}?`;
                break;
            case 'delete':
                confirmMessage = `Are you sure you want to delete ${selectedOrders.length} orders? This action cannot be undone.`;
                break;
            case 'checkout':
                confirmMessage = `Are you sure you want to checkout ${selectedOrders.length} orders?`;
                break;
            default:
                toast.error('Invalid action');
                return;
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            setProcessingBulkAction(true);

            // Prepare the request payload
            const payload = {
                operation: bulkAction,
                order_ids: selectedOrders
            };

            // Add status for update_status operation
            if (bulkAction === 'update_status') {
                payload.status = bulkActionStatus;
            }

            // Call the bulk operations API
            const response = await axios.post('/orders/bulk/', payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            // Handle the response
            if (response.status === 200 || response.status === 207) {
                toast.success(response.data.message);

                // If there are failed orders, show a warning
                if (response.data.failed_orders && response.data.failed_orders.length > 0) {
                    const failedOrderNumbers = response.data.failed_orders.map(order => order.order_number).join(', ');
                    toast.warning(`Some orders could not be processed: ${failedOrderNumbers}`);
                }

                // Refresh the orders list
                fetchOrders(pagination.currentPage);

                // Clear selections
                setSelectedOrders([]);
                setBulkAction('');
            }
        } catch (error) {
            console.error('Failed to perform bulk operation:', error);
            toast.error(error.response?.data?.error || 'Failed to perform bulk operation');
        } finally {
            setProcessingBulkAction(false);
        }
    };

    // Handle selecting/deselecting all orders
    const handleSelectAllOrders = (e) => {
        if (e.target.checked) {
            setSelectedOrders(orders.map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    // Handle selecting/deselecting a single order
    const handleSelectOrder = (orderId, isChecked) => {
        if (isChecked) {
            setSelectedOrders(prev => [...prev, orderId]);
        } else {
            setSelectedOrders(prev => prev.filter(id => id !== orderId));
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
        toast.success(`Order #${newOrder.order_number} created successfully`);
        fetchOrders(1); // Refresh the orders list and go to first page
    };

    // We already have a useEffect for fetching orders above, so this one is redundant
    // and can be removed

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
        // Base view button that's always available
        const viewButton = (
            <button
                className="btn-view"
                onClick={() => toggleOrderExpansion(order.id)}
                title={expandedOrders[order.id] ? "Hide Details" : "View Details"}
            >
                <i className={`fas fa-${expandedOrders[order.id] ? 'chevron-up' : 'chevron-down'}`}></i>
                {expandedOrders[order.id] ? 'Hide Details' : 'View Details'}
            </button>
        );

        // For 'my' mode or if user can modify orders
        if (mode === 'my' || canModifyOrders) {
            return (
                <div className="action-buttons">
                    {viewButton}

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

                    {/* Mark as Delivered button for customers (only for shipped orders) */}
                    {mode === 'my' && order.status === 'shipped' && (
                        <button
                            className="btn-delivered"
                            onClick={() => handleMarkDelivered(order.id)}
                            disabled={order.processing}
                            title="Mark as Delivered"
                        >
                            {order.processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle"></i> Mark Delivered
                                </>
                            )}
                        </button>
                    )}

                    {/* Delete Order button for admins and managers */}
                    {canModifyOrders && (
                        <button
                            className="btn-delete"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={order.processing}
                            title="Delete Order"
                        >
                            {order.processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-trash"></i>
                                </>
                            )}
                        </button>
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
        }

        // For cashiers in manage mode, only show view details and status change
        if (mode === 'manage' && isCashier) {
            return (
                <div className="action-buttons">
                    {viewButton}

                    {/* Status change dropdown for cashiers */}
                    <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={order.processing}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                    </select>
                </div>
            );
        }

        // Default case - just view button
        return (
            <div className="action-buttons">
                {viewButton}
            </div>
        );
    };

    // Handle status change (for cashiers)
    const handleStatusChange = async (orderId, newStatus) => {
        if (!accessToken) return;

        try {
            // Mark the order as processing
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, processing: true } : order
                )
            );

            // Call the backend API to update the status
            await axios.patch(`/orders/${orderId}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            // Update the local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus, processing: false } : order
                )
            );

            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error('Failed to update order status');

            // Reset processing state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, processing: false } : order
                )
            );
        }
    };

    // Get the page title based on mode
    const getPageTitle = () => {
        switch (mode) {
            case 'create':
                return 'Create Order';
            case 'my':
                return 'My Orders';
            case 'manage':
                return 'Manage Orders';
            default:
                return 'Orders';
        }
    };

    return (
        <div className="orders-container p-4">
            <div className="orders-header mb-4">
                <h1 className="orders-title">{getPageTitle()}</h1>
                <div className="orders-actions">
                    {mode === 'create' ? null : (
                        <Link to="/orders/create" className="btn-create-order">
                            <i className="fas fa-plus"></i> Create Order
                        </Link>
                    )}
                </div>
            </div>

            {/* Create Order Form - only show in create mode */}
            {mode === 'create' && (
                <CreateOrderForm
                    onOrderCreated={(newOrder) => {
                        handleOrderCreated(newOrder);
                        // Redirect to My Orders after creation
                        navigate('/orders/my');
                    }}
                    onCancel={() => navigate('/orders/my')}
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
                                {/* Bulk Actions UI - Only show for admins in manage mode */}
                                {mode === 'manage' && isAdmin && (
                                    <div className="bulk-actions-container mb-3">
                                        <div className="bulk-actions-controls">
                                            <select
                                                className="bulk-action-select"
                                                value={bulkAction}
                                                onChange={(e) => setBulkAction(e.target.value)}
                                                disabled={processingBulkAction || selectedOrders.length === 0}
                                            >
                                                <option value="">Select Action</option>
                                                <option value="cancel">Cancel Orders</option>
                                                <option value="update_status">Update Status</option>
                                                <option value="delete">Delete Orders</option>
                                                <option value="checkout">Checkout Orders</option>
                                            </select>

                                            {bulkAction === 'update_status' && (
                                                <select
                                                    className="bulk-status-select"
                                                    value={bulkActionStatus}
                                                    onChange={(e) => setBulkActionStatus(e.target.value)}
                                                    disabled={processingBulkAction}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            )}

                                            <button
                                                className="btn-apply-bulk-action"
                                                onClick={handleBulkOperation}
                                                disabled={processingBulkAction || !bulkAction || selectedOrders.length === 0}
                                            >
                                                {processingBulkAction ? (
                                                    <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                                                ) : (
                                                    <>Apply</>
                                                )}
                                            </button>
                                        </div>

                                        <div className="selected-count">
                                            {selectedOrders.length} {selectedOrders.length === 1 ? 'order' : 'orders'} selected
                                        </div>
                                    </div>
                                )}

                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                {/* Checkbox column - Only show for admins in manage mode */}
                                                {mode === 'manage' && isAdmin && (
                                                    <th className="checkbox-column">
                                                        <input
                                                            type="checkbox"
                                                            onChange={handleSelectAllOrders}
                                                            checked={selectedOrders.length > 0 && selectedOrders.length === orders.length}
                                                            disabled={processingBulkAction}
                                                        />
                                                    </th>
                                                )}
                                                <th>Order Number</th>
                                                <th>Date</th>
                                                <th>Total Amount</th>
                                                <th>Status</th>
                                                {mode === 'manage' && <th>Customer</th>}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <React.Fragment key={order.id}>
                                                    <tr>
                                                        {/* Checkbox column - Only show for admins in manage mode */}
                                                        {mode === 'manage' && isAdmin && (
                                                            <td className="checkbox-column">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedOrders.includes(order.id)}
                                                                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                                                                    disabled={processingBulkAction}
                                                                />
                                                            </td>
                                                        )}
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
                                                        {mode === 'manage' && (
                                                            <td className="customer-name">
                                                                {userNames[order.user] || 'Loading...'}
                                                            </td>
                                                        )}
                                                        <td>
                                                            {renderActionButtons(order)}
                                                        </td>
                                                    </tr>

                                                    {/* Order Items (Expanded View) */}
                                                    {expandedOrders[order.id] && (
                                                        <tr className="order-details-row">
                                                            <td colSpan={mode === 'manage' ? (isAdmin ? "7" : "6") : "5"}>
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
