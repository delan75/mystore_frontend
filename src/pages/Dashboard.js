import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user, accessToken } = useAuth();
    const history = useHistory();
    const { formatPriceSync, selectedCurrency } = useCurrency();
    const [orders, setOrders] = useState([]);
    const [orderSummary, setOrderSummary] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user || !accessToken) {
            history.push('/auth');
        }
    }, [user, accessToken, history]);

    // Fetch orders and summary
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersResponse = await axios.get('/orders/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setOrders(ordersResponse.data.results || []);

                const summaryResponse = await axios.get('/orders/summary/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setOrderSummary(summaryResponse.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                toast.error('Failed to fetch orders. Please try again later.');
            }
        };

        if (accessToken) {
            fetchOrders();
        }
    }, [accessToken]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await axios.post(`/orders/${orderId}/cancel/`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                toast.success('Order canceled successfully.');
                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);
            } catch (err) {
                console.error('Error canceling order:', err);
                toast.error('Failed to cancel order. Please try again later.');
            }
        }
    };

    const handleRequestReturn = async (orderId) => {
        try {
            await axios.post(`/orders/${orderId}/issues/`, {
                description: 'Requesting return for this order.',
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success('Return request submitted.');
        } catch (err) {
            console.error('Error requesting return:', err);
            toast.error('Failed to request return. Please try again later.');
        }
    };

    const handleCheckout = async (orderId) => {
        try {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, processing: true } : order
                )
            );

            const response = await axios.post(`/orders/${orderId}/checkout/`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            toast.success('Order checkout successful!');

            // Update the order in the local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'processing', processing: false } : order
                )
            );

            // If there's additional data in the response that needs to be handled
            console.log('Checkout response:', response.data);

        } catch (err) {
            console.error('Error checking out order:', err);

            // Remove processing state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, processing: false } : order
                )
            );

            // Show appropriate error message
            if (err.response?.status === 400) {
                toast.error(err.response.data.error || 'Invalid order state for checkout.');
            } else {
                toast.error('Failed to checkout. Please try again later.');
            }
        }
    };

    return (
        <div className="dashboard-container p-4">
            <div className="dashboard-header mb-4">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back, {user?.first_name || user?.username || 'User'}!</p>
            </div>

            <div className="stats-grid">
                {/* Stats Cards */}
                <div className="stats-card">
                    <div className="stats-card-icon bg-primary-light">
                        <i className="fas fa-shopping-bag text-primary"></i>
                    </div>
                    <div className="stats-card-content">
                        <h6 className="stats-card-label">Total Orders</h6>
                        <h3 className="stats-card-value">{orderSummary?.status_counts?.total || 0}</h3>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-icon bg-warning-light">
                        <i className="fas fa-clock text-warning"></i>
                    </div>
                    <div className="stats-card-content">
                        <h6 className="stats-card-label">Pending Orders</h6>
                        <h3 className="stats-card-value">{orderSummary?.status_counts?.pending || 0}</h3>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-icon bg-success-light">
                        <i className="fas fa-dollar-sign text-success"></i>
                    </div>
                    <div className="stats-card-content">
                        <h6 className="stats-card-label">Total Spent</h6>
                        <h3 className="stats-card-value">{selectedCurrency ? formatPriceSync(orderSummary?.total_spent || 0) : 'Loading...'}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="orders-card mt-4">
                <div className="orders-card-header">
                    <h5 className="orders-card-title">Recent Orders</h5>
                </div>
                <div className="orders-card-body">
                    {orders.length === 0 ? (
                        <div className="no-orders-message">
                            <i className="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                            <p>You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Date Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.order_number}</td>
                                            <td>{selectedCurrency ? formatPriceSync(order.total_amount || 0) : 'Loading...'}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    {order.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="btn-checkout"
                                                                onClick={() => handleCheckout(order.id)}
                                                                title="Checkout Order"
                                                                disabled={order.processing}
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
                                                                title="Cancel Order"
                                                                disabled={order.processing}
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
