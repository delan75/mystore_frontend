import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user, accessToken, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderSummary, setOrderSummary] = useState(null);
    const [profile, setProfile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/auth/users/${user.id}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setProfile(response.data);
            } catch (err) {
                toast.error('Failed to fetch profile.');
            }
        };

        if (user && accessToken) {
            fetchProfile();
        } else {
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

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully.');
        navigate('/auth');
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside
                className={`form fixed inset-y-0 left-0 w-64 transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
            >
                <div className="p-4">
                    <h2 className="text-2xl text-white font-weight-600 mb-6">My Dashboard</h2>
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <a href="#orders" className="text-white hover:text-[#1ab188]">
                                    Orders
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="/profile" className="text-white hover:text-[#1ab188]" onClick={() => navigate('/profile')}>
                                    Profile
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="/chats" className="text-white hover:text-[#1ab188]" onClick={() => navigate('/chats')}>
                                    Chats
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="/products" className="text-white hover:text-[#1ab188]" onClick={() => navigate('/products')}>
                                    Products
                                </a>
                            </li>
                            <li className="mb-4">
                                <button onClick={handleLogout} className="text-white hover:text-[#1ab188]">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Sidebar Toggle Button */}
                <button
                    className="md:hidden p-4 text-white bg-[#13232f]"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                <div className="p-8">
                    {/* Profile Summary */}
                    <div className="form mb-8">
                        <h1>Profile Summary</h1>
                        {profile ? (
                            <div className="field-wrap">
                                <p className="text-white"><strong>Username:</strong> {profile.username}</p>
                                <p className="text-white"><strong>Email:</strong> {profile.email}</p>
                                <p className="text-white"><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                                <p className="text-white"><strong>Role:</strong> {profile.role}</p>
                                <button
                                    className="button button-block mt-4"
                                    onClick={() => navigate('/profile')}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <p className="text-white">Loading profile...</p>
                        )}
                    </div>

                    {/* Orders Overview */}
                    <div className="form">
                        <h1>Your Orders</h1>
                        {orderSummary ? (
                            <div className="field-wrap">
                                <p className="text-white">
                                    <strong>Total Orders:</strong> {orderSummary.status_counts?.total || 0}
                                </p>
                                <p className="text-white">
                                    <strong>Pending Orders:</strong> {orderSummary.status_counts?.pending || 0}
                                </p>
                                <p className="text-white">
                                    <strong>Total Spent:</strong> ${(orderSummary.total_spent ? Number(orderSummary.total_spent) : 0).toFixed(2)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-white">Loading order summary...</p>
                        )}

                        <h2 className="text-white font-weight-300 mt-6 mb-4">Recent Orders</h2>
                        {orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-white">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-left">Order Number</th>
                                            <th className="p-2 text-left">Total Amount</th>
                                            <th className="p-2 text-left">Status</th>
                                            <th className="p-2 text-left">Created At</th>
                                            <th className="p-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => {
                                            // Convert total_amount to number and handle null/undefined cases
                                            const totalAmount = order.total_amount ? Number(order.total_amount) : 0;
                                            
                                            return (
                                                <tr key={order.id} className="border-t border-[#a0b3b0]">
                                                    <td className="p-2">{order.order_number}</td>
                                                    <td className="p-2">${totalAmount.toFixed(2)}</td>
                                                    <td className="p-2">{order.status}</td>
                                                    <td className="p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                                                    <td className="p-2">
                                                        {order.status === 'pending' && (
                                                            <button
                                                                className="button mr-2"
                                                                onClick={() => handleCancelOrder(order.id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                        {(order.status === 'shipped' || order.status === 'completed') && (
                                                            <button
                                                                className="button"
                                                                onClick={() => handleRequestReturn(order.id)}
                                                            >
                                                                Request Return
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-white">No orders found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
