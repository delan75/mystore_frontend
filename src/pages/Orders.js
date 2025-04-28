import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHistory, Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import CreateOrderForm from '../components/CreateOrderForm';
import '../styles/OrdersBootstrap.css';

const Orders = ({ mode = 'my' }) => {
    const { user, accessToken } = useAuth();
    const { formatPriceSync, selectedCurrency } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [orderItems, setOrderItems] = useState({});
    const [userNames, setUserNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchFilters, setSearchFilters] = useState({
        status: '',
        date_from: '',
        date_to: '',
        min_amount: '',
        max_amount: '',
        sort_by: 'created_at',
        sort_order: 'desc'
    });
    const [filtersExpanded, setFiltersExpanded] = useState(false);
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

    const history = useHistory();

    // Define fetchOrders function outside useEffect so it can be called from elsewhere
    const fetchOrders = async (pageNumber) => {
        if (!accessToken) return;

        try {
            setLoading(true);

            // Use the search endpoint for all order queries
            let endpoint = '/orders/search/';
            let params = {
                page: pageNumber || pagination.currentPage,
                page_size: itemsPerPage,
                sort_by: searchFilters.sort_by,
                sort_order: searchFilters.sort_order
            };

            // Add search query if search term exists
            if (debouncedSearchTerm) {
                params.q = debouncedSearchTerm;
            }

            // Add filters if they exist
            if (searchFilters.status) {
                params.status = searchFilters.status;
            }

            if (searchFilters.date_from) {
                params.date_from = searchFilters.date_from;
            }

            if (searchFilters.date_to) {
                params.date_to = searchFilters.date_to;
            }

            if (searchFilters.min_amount) {
                params.min_amount = searchFilters.min_amount;
            }

            if (searchFilters.max_amount) {
                params.max_amount = searchFilters.max_amount;
            }

            // For 'my' mode, the backend will automatically filter to the user's orders
            // For 'manage' mode, staff can see all orders by default

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
    }, [accessToken, pagination.currentPage, itemsPerPage, mode, user?.id, debouncedSearchTerm, searchFilters]);

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            // Reset to first page when searching
            if (pagination.currentPage !== 1) {
                setPagination(prev => ({ ...prev, currentPage: 1 }));
            }
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm, pagination.currentPage]);

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
                history.push('/dashboard');
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

    // Check if any filters are active
    const hasActiveFilters = () => {
        return (
            searchFilters.status !== '' ||
            searchFilters.date_from !== '' ||
            searchFilters.date_to !== '' ||
            searchFilters.min_amount !== '' ||
            searchFilters.max_amount !== '' ||
            searchFilters.sort_by !== 'created_at' ||
            searchFilters.sort_order !== 'desc'
        );
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

    // Get Bootstrap status badge class based on order status
    const getBootstrapStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning text-dark';
            case 'paid':
                return 'bg-primary';
            case 'processing':
                return 'bg-info';
            case 'shipped':
                return 'bg-info text-dark';
            case 'completed':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    // Get status button class for dropdowns
    const getStatusButtonClass = (status) => {
        switch (status) {
            case 'pending': return 'btn-outline-warning';
            case 'paid': return 'btn-outline-primary';
            case 'processing': return 'btn-outline-info';
            case 'shipped': return 'btn-outline-info';
            case 'completed': return 'btn-outline-success';
            case 'cancelled': return 'btn-outline-danger';
            case 'returned': return 'btn-outline-secondary';
            default: return 'btn-outline-secondary';
        }
    };

    // Render status options for admin/manager
    const renderStatusOptions = (order) => {
        if (!hasManagementAccess) return null;

        const availableStatuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];

        return (
            <div className="dropdown d-inline-block ms-1">
                <button
                    className={`btn btn-sm ${getStatusButtonClass(order.status)} dropdown-toggle`}
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    disabled={order.processing}
                >
                    <span className="btn-text">Change</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                    {availableStatuses.map(status => (
                        <li key={status}>
                            <button
                                className={`dropdown-item ${status === order.status ? 'active' : ''}`}
                                onClick={() => handleUpdateStatus(order.id, status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Render action buttons based on order status and user role
    const renderActionButtons = (order) => {
        // Base view button that's always available
        const viewButton = (
            <button
                className="btn btn-sm btn-outline-info me-1"
                onClick={() => toggleOrderExpansion(order.id)}
                title={expandedOrders[order.id] ? "Hide Details" : "View Details"}
            >
                <i className={`fas fa-${expandedOrders[order.id] ? 'chevron-up' : 'chevron-down'} me-1`}></i>
                <span className="btn-text">{expandedOrders[order.id] ? 'Hide' : 'View'}</span>
            </button>
        );

        // For 'my' mode or if user can modify orders
        if (mode === 'my' || canModifyOrders) {
            return (
                <div className="d-flex flex-wrap gap-1">
                    {viewButton}

                    {order.status === 'pending' && (
                        <>
                            <button
                                className="btn btn-sm btn-success me-1"
                                onClick={() => handleCheckout(order.id)}
                                disabled={order.processing}
                                title="Checkout Order"
                            >
                                {order.processing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin me-1"></i> Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-credit-card me-1"></i> <span className="btn-text">Checkout</span>
                                    </>
                                )}
                            </button>

                            <button
                                className="btn btn-sm btn-warning me-1"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={order.processing}
                                title="Cancel Order"
                            >
                                <i className="fas fa-times me-1"></i> <span className="btn-text">Cancel</span>
                            </button>
                        </>
                    )}

                    {/* Mark as Delivered button for customers (only for shipped orders) */}
                    {mode === 'my' && order.status === 'shipped' && (
                        <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleMarkDelivered(order.id)}
                            disabled={order.processing}
                            title="Mark as Delivered"
                        >
                            {order.processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin me-1"></i> Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle me-1"></i> <span className="btn-text">Delivered</span>
                                </>
                            )}
                        </button>
                    )}

                    {/* Delete Order button for admins and managers */}
                    {canModifyOrders && (
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={order.processing}
                            title="Delete Order"
                        >
                            {order.processing ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fas fa-trash"></i>
                            )}
                        </button>
                    )}

                    {(order.status === 'shipped' || order.status === 'completed') && (
                        <button
                            className="btn btn-sm btn-secondary me-1"
                            onClick={() => handleRequestReturn(order.id)}
                            title="Request Return"
                        >
                            <i className="fas fa-undo me-1"></i> <span className="btn-text">Return</span>
                        </button>
                    )}
                </div>
            );
        }

        // For cashiers in manage mode, only show view details and status change
        if (mode === 'manage' && isCashier) {
            return (
                <div className="d-flex flex-wrap gap-1 align-items-center">
                    {viewButton}

                    {/* Status change dropdown for cashiers */}
                    <div className="dropdown d-inline-block ms-1">
                        <button
                            className={`btn btn-sm ${getStatusButtonClass(order.status)} dropdown-toggle`}
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={order.processing}
                        >
                            <span className="btn-text">Change Status</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className={`dropdown-item ${order.status === 'pending' ? 'active' : ''}`} onClick={() => handleStatusChange(order.id, 'pending')}>Pending</button></li>
                            <li><button className={`dropdown-item ${order.status === 'processing' ? 'active' : ''}`} onClick={() => handleStatusChange(order.id, 'processing')}>Processing</button></li>
                            <li><button className={`dropdown-item ${order.status === 'shipped' ? 'active' : ''}`} onClick={() => handleStatusChange(order.id, 'shipped')}>Shipped</button></li>
                            <li><button className={`dropdown-item ${order.status === 'completed' ? 'active' : ''}`} onClick={() => handleStatusChange(order.id, 'completed')}>Completed</button></li>
                            <li><button className={`dropdown-item ${order.status === 'cancelled' ? 'active' : ''}`} onClick={() => handleStatusChange(order.id, 'cancelled')}>Cancelled</button></li>
                            <li><button className={`dropdown-item ${order.status === 'returned' ? 'active' : ''}`} onClick={() => handleStatusChange(order.id, 'returned')}>Returned</button></li>
                        </ul>
                    </div>
                </div>
            );
        }

        // Default case - just view button
        return (
            <div className="d-flex">
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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h1 className="h3 mb-0">{getPageTitle()}</h1>
                <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
                    {mode === 'create' ? null : (
                        <>
                            <div className="d-flex flex-column gap-2" style={{width: '300px'}}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="form-control"
                                        aria-label="Search orders"
                                    />
                                    <span className="input-group-text bg-white">
                                        <i className="fas fa-search text-muted"></i>
                                    </span>
                                </div>

                                <button
                                    className={`btn ${filtersExpanded ? 'btn-outline-secondary active' : 'btn-outline-primary'}`}
                                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                                >
                                    <i className={`fas ${filtersExpanded ? 'fa-chevron-up' : 'fa-filter'} me-1`}></i>
                                    {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>
                            <Link to="/orders/create" className="btn btn-primary">
                                <i className="fas fa-plus me-1"></i> Create Order
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Create Order Form - only show in create mode */}
            {mode === 'create' && (
                <CreateOrderForm
                    onOrderCreated={(newOrder) => {
                        handleOrderCreated(newOrder);
                        // Redirect to My Orders after creation
                        history.push('/orders/my');
                    }}
                    onCancel={() => history.push('/orders/my')}
                />
            )}

            {loading ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                    <div className="mb-3 text-primary">
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                    </div>
                    <p className="text-muted">Loading orders...</p>
                </div>
            ) : (
                <>
                    {filtersExpanded && (
                        <div className="card mb-4 border-light filter-panel" style={{position: 'relative', zIndex: 1}}>
                            <div className="card-body bg-light" style={{position: 'static'}}>
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label">Status:</label>
                                        <select
                                            value={searchFilters.status}
                                            onChange={(e) => setSearchFilters({...searchFilters, status: e.target.value})}
                                            className="form-select"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Sort By:</label>
                                        <select
                                            value={`${searchFilters.sort_by}-${searchFilters.sort_order}`}
                                            onChange={(e) => {
                                                const [sort_by, sort_order] = e.target.value.split('-');
                                                setSearchFilters({...searchFilters, sort_by, sort_order});
                                            }}
                                            className="form-select"
                                        >
                                            <option value="created_at-desc">Date (Newest)</option>
                                            <option value="created_at-asc">Date (Oldest)</option>
                                            <option value="total_amount-desc">Amount (High to Low)</option>
                                            <option value="total_amount-asc">Amount (Low to High)</option>
                                            <option value="order_number-asc">Order Number</option>
                                            <option value="status-asc">Status</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label">Date From:</label>
                                        <input
                                            type="date"
                                            value={searchFilters.date_from}
                                            onChange={(e) => setSearchFilters({...searchFilters, date_from: e.target.value})}
                                            className="form-control orders-filter-input"
                                            style={{zIndex: 5, position: 'relative'}}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Date To:</label>
                                        <input
                                            type="date"
                                            value={searchFilters.date_to}
                                            onChange={(e) => setSearchFilters({...searchFilters, date_to: e.target.value})}
                                            className="form-control orders-filter-input"
                                            style={{zIndex: 5, position: 'relative'}}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label">Min Amount:</label>
                                        <input
                                            type="number"
                                            value={searchFilters.min_amount}
                                            onChange={(e) => setSearchFilters({...searchFilters, min_amount: e.target.value})}
                                            className="form-control orders-filter-input"
                                            placeholder="Min"
                                            min="0"
                                            style={{zIndex: 5, position: 'relative'}}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Max Amount:</label>
                                        <input
                                            type="number"
                                            value={searchFilters.max_amount}
                                            onChange={(e) => setSearchFilters({...searchFilters, max_amount: e.target.value})}
                                            className="form-control orders-filter-input"
                                            placeholder="Max"
                                            min="0"
                                            style={{zIndex: 5, position: 'relative'}}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSearchFilters({
                                                status: '',
                                                date_from: '',
                                                date_to: '',
                                                min_amount: '',
                                                max_amount: '',
                                                sort_by: 'created_at',
                                                sort_order: 'desc'
                                            });
                                        }}
                                    >
                                        <i className="fas fa-times-circle me-1"></i> Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="card shadow-sm">
                    <div className="card-body p-0">
                        {orders.length === 0 ? (
                            <div className="text-center py-5 px-3">
                                <i className="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                                <p className="h5 mb-3">
                                    {debouncedSearchTerm || hasActiveFilters() ?
                                        'No orders found matching your search criteria.' :
                                        'No orders found.'}
                                </p>
                                {(debouncedSearchTerm || hasActiveFilters()) && (
                                    <button
                                        className="btn btn-outline-secondary mt-3"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSearchFilters({
                                                status: '',
                                                date_from: '',
                                                date_to: '',
                                                min_amount: '',
                                                max_amount: '',
                                                sort_by: 'created_at',
                                                sort_order: 'desc'
                                            });
                                        }}
                                    >
                                        <i className="fas fa-times-circle me-1"></i> Clear All Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Bulk Actions UI - Only show for admins in manage mode */}
                                {mode === 'manage' && isAdmin && (
                                    <div className="card mb-3 border-light">
                                        <div className="card-body bg-light d-flex flex-wrap justify-content-between align-items-center gap-3">
                                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                                <select
                                                    className="form-select"
                                                    style={{width: '180px'}}
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
                                                        className="form-select"
                                                        style={{width: '150px'}}
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
                                                    className="btn btn-primary"
                                                    onClick={handleBulkOperation}
                                                    disabled={processingBulkAction || !bulkAction || selectedOrders.length === 0}
                                                >
                                                    {processingBulkAction ? (
                                                        <><i className="fas fa-spinner fa-spin me-1"></i> Processing...</>
                                                    ) : (
                                                        <>Apply</>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="badge bg-primary rounded-pill fs-6">
                                                {selectedOrders.length} {selectedOrders.length === 1 ? 'order' : 'orders'} selected
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                {/* Checkbox column - Only show for admins in manage mode */}
                                                {mode === 'manage' && isAdmin && (
                                                    <th className="text-center" style={{width: '40px'}}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={handleSelectAllOrders}
                                                            checked={selectedOrders.length > 0 && selectedOrders.length === orders.length}
                                                            disabled={processingBulkAction}
                                                        />
                                                    </th>
                                                )}
                                                <th style={{width: '120px'}}>Order #</th>
                                                <th style={{width: '100px'}}>Date</th>
                                                <th style={{width: '120px'}}>Amount</th>
                                                <th style={{width: '150px'}}>Status</th>
                                                {mode === 'manage' && <th style={{width: '100px'}}>Customer</th>}
                                                <th style={{width: '200px'}}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <React.Fragment key={order.id}>
                                                    <tr>
                                                        {/* Checkbox column - Only show for admins in manage mode */}
                                                        {mode === 'manage' && isAdmin && (
                                                            <td className="text-center align-middle">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={selectedOrders.includes(order.id)}
                                                                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                                                                    disabled={processingBulkAction}
                                                                />
                                                            </td>
                                                        )}
                                                        <td className="align-middle fw-bold">{order.order_number}</td>
                                                        <td className="align-middle">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="align-middle fw-bold">{selectedCurrency ? formatPriceSync(order.total_amount) : 'Loading...'}</td>
                                                        <td className="align-middle">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className={`badge ${getBootstrapStatusBadgeClass(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                                {hasManagementAccess && renderStatusOptions(order)}
                                                            </div>
                                                        </td>
                                                        {mode === 'manage' && (
                                                            <td className="text-center align-middle" style={{maxWidth: '80px'}}>
                                                                <span className="d-inline-block text-truncate" style={{maxWidth: '80px'}} title={userNames[order.user] || 'Loading...'}>
                                                                    {userNames[order.user] || 'Loading...'}
                                                                </span>
                                                            </td>
                                                        )}
                                                        <td className="align-middle">
                                                            {renderActionButtons(order)}
                                                        </td>
                                                    </tr>

                                                    {/* Order Items (Expanded View) */}
                                                    {expandedOrders[order.id] && (
                                                        <tr className="table-light">
                                                            <td colSpan={mode === 'manage' ? (isAdmin ? "7" : "6") : "5"}>
                                                                <div className="p-3 bg-light border-top">
                                                                    <h6 className="fw-bold mb-3">Order Items</h6>

                                                                    {!orderItems[order.id] ? (
                                                                        <div className="text-center py-3">
                                                                            <i className="fas fa-spinner fa-spin me-2"></i> Loading items...
                                                                        </div>
                                                                    ) : orderItems[order.id].length === 0 ? (
                                                                        <p className="text-center text-muted py-3">No items found for this order.</p>
                                                                    ) : (
                                                                        <div className="table-responsive">
                                                                        <table className="table table-sm table-bordered table-striped">
                                                                            <thead className="table-secondary">
                                                                                <tr>
                                                                                    <th>Product</th>
                                                                                    <th style={{width: '80px'}} className="text-center">Quantity</th>
                                                                                    <th style={{width: '100px'}} className="text-end">Price</th>
                                                                                    <th style={{width: '100px'}} className="text-end">Total</th>
                                                                                    {hasManagementAccess && <th style={{width: '100px'}} className="text-center">Backordered</th>}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {orderItems[order.id].map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td className="align-middle">{item.product_name || `Product #${item.product}`}</td>
                                                                                        <td className="align-middle text-center">{item.quantity}</td>
                                                                                        <td className="align-middle text-end">{selectedCurrency ? formatPriceSync(item.price) : 'Loading...'}</td>
                                                                                        <td className="align-middle text-end fw-bold">{selectedCurrency ? formatPriceSync(item.price * item.quantity) : 'Loading...'}</td>
                                                                                        {hasManagementAccess && (
                                                                                            <td className="text-center">
                                                                                                {item.backordered_quantity > 0 ? (
                                                                                                    <span className="badge bg-danger">
                                                                                                        {item.backordered_quantity}
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="badge bg-success">0</span>
                                                                                                )}
                                                                                            </td>
                                                                                        )}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                        </div>
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
                                <div className="d-flex justify-content-between align-items-center flex-wrap mt-4 gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <label className="me-2">Show</label>
                                        <select
                                            className="form-select form-select-sm"
                                            style={{width: '70px'}}
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

                                    <div className="text-muted small">
                                        Showing {orders.length > 0 ? (pagination.currentPage - 1) * pagination.pageSize + 1 : 0} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
                                    </div>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-4">
                                        <nav aria-label="Orders pagination">
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
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default Orders;
