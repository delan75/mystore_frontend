// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Support from './pages/Support';
import AccountSettings from './pages/AccountSettings';
import PrivacyCenter from './pages/PrivacyCenter';
import Feedback from './pages/Feedback';
import History from './pages/History';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Loading.css';

// Check if user has manager or admin role
const ManagerRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    // Check if user has the right role
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Check if user has order management access (admin, manager, or cashier)
const OrderManagementRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    // Check if user has the right role
    if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'cashier')) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <CurrencyProvider>
                <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/shop" element={<Shop />} />

                    {/* Protected routes using PrivateRoute component */}
                    <Route element={<PrivateRoute />}>
                        {/* Default route redirects to dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* Regular user routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Navigate to="/orders/my" replace />} />
                        <Route path="/orders/create" element={<Orders mode="create" />} />
                        <Route path="/orders/my" element={<Orders mode="my" />} />
                        <Route path="/orders/manage" element={
                            <OrderManagementRoute>
                                <Orders mode="manage" />
                            </OrderManagementRoute>
                        } />
                        <Route path="/profile" element={<Profile />} />

                        {/* Chat routes */}
                        <Route path="/chats" element={<Chats />} />
                        <Route path="/chats/new" element={<Chats mode="new" />} />
                        <Route path="/chats/blocked" element={<Chats mode="blocked" />} />
                        <Route path="/chats/manage" element={
                            <ManagerRoute>
                                <Chats mode="manage" />
                            </ManagerRoute>
                        } />

                        <Route path="/support" element={<Support />} />
                        <Route path="/account-settings" element={<AccountSettings />} />
                        <Route path="/privacy" element={<PrivacyCenter />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/settings" element={<Settings />} />

                        {/* Manager/Admin only routes */}
                        <Route path="/products/add" element={
                            <ManagerRoute>
                                <AddProduct />
                            </ManagerRoute>
                        } />

                        <Route path="/categories" element={
                            <ManagerRoute>
                                <Categories />
                            </ManagerRoute>
                        } />

                        <Route path="/categories/add" element={
                            <ManagerRoute>
                                <AddCategory />
                            </ManagerRoute>
                        } />

                        <Route path="/categories/edit/:id" element={
                            <ManagerRoute>
                                <EditCategory />
                            </ManagerRoute>
                        } />
                    </Route>
                </Routes>
                <ToastContainer />
                </Router>
            </CurrencyProvider>
        </AuthProvider>
    );
}

export default App;
