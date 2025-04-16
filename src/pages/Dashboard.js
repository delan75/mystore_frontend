import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderSummary, setOrderSummary] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user || !accessToken) {
            navigate('/auth');
        }
    }, [user, accessToken, navigate]);

    // Fetch orders and summary
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersResponse = await axios.get('http://127.0.0.1:8000/orders/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setOrders(ordersResponse.data.results || []);

                const summaryResponse = await axios.get('http://127.0.0.1:8000/orders/summary/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setOrderSummary(summaryResponse.data);
            } catch (err) {
                toast.error('Failed to fetch orders.');
            }
        };

        if (accessToken) {
            fetchOrders();
        }
    }, [accessToken]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await axios.post(`http://127.0.0.1:8000/orders/${orderId}/cancel/`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                toast.success('Order canceled successfully.');
                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);
            } catch (err) {
                toast.error('Failed to cancel order.');
            }
        }
    };

    const handleRequestReturn = async (orderId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/orders/${orderId}/issues/`, {
                description: 'Requesting return for this order.',
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success('Return request submitted.');
        } catch (err) {
            toast.error('Failed to request return.');
        }
    };

    return (

        <div className="container-fluid p-4">
            <div className="row g-4">
                {/* Stats Cards */}
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                    <i className="fas fa-shopping-bag text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Total Orders</h6>
                                    <h3 className="mb-0">{orderSummary?.status_counts?.total || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                    <i className="fas fa-clock text-warning"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Pending Orders</h6>
                                    <h3 className="mb-0">{orderSummary?.status_counts?.pending || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                    <i className="fas fa-dollar-sign text-success"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Total Spent</h6>
                                    <h3 className="mb-0">${(orderSummary?.total_spent || 0).toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Recent Orders</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
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
                                                <td>${Number(order.total_amount || 0).toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge bg-${
                                                        order.status === 'pending' ? 'warning' :
                                                        order.status === 'completed' ? 'success' :
                                                        order.status === 'shipped' ? 'info' : 'secondary'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="btn-group">
                                                        {order.status === 'pending' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleCancelOrder(order.id)}
                                                            >
                                                                <i className="fas fa-times me-1"></i>Cancel
                                                            </button>
                                                        )}
                                                        {(order.status === 'shipped' || order.status === 'completed') && (
                                                            <button
                                                                className="btn btn-sm btn-outline-warning"
                                                                onClick={() => handleRequestReturn(order.id)}
                                                            >
                                                                <i className="fas fa-undo me-1"></i>Return
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
