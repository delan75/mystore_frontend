// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
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

// Protected route component
const RequireAuth = ({ children }) => {
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

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return <Layout>{children}</Layout>;
};

// Manager/Admin route component
const RequireManagerRole = ({ children }) => {
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

    if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Layout>{children}</Layout>;
};

// Order management route component
const RequireOrderManagementRole = ({ children }) => {
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

    if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'cashier')) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Layout>{children}</Layout>;
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

                    {/* Default route redirects to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Regular user routes */}
                    <Route path="/dashboard" element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    } />
                    <Route path="/products" element={
                        <RequireAuth>
                            <Products />
                        </RequireAuth>
                    } />
                    <Route path="/orders" element={<Navigate to="/orders/my" replace />} />
                    <Route path="/orders/create" element={
                        <RequireAuth>
                            <Orders mode="create" />
                        </RequireAuth>
                    } />
                    <Route path="/orders/my" element={
                        <RequireAuth>
                            <Orders mode="my" />
                        </RequireAuth>
                    } />
                    <Route path="/orders/manage" element={
                        <RequireOrderManagementRole>
                            <Orders mode="manage" />
                        </RequireOrderManagementRole>
                    } />
                    <Route path="/profile" element={
                        <RequireAuth>
                            <Profile />
                        </RequireAuth>
                    } />

                    {/* Chat routes */}
                    <Route path="/chats" element={
                        <RequireAuth>
                            <Chats />
                        </RequireAuth>
                    } />
                    <Route path="/chats/new" element={
                        <RequireAuth>
                            <Chats mode="new" />
                        </RequireAuth>
                    } />
                    <Route path="/chats/blocked" element={
                        <RequireAuth>
                            <Chats mode="blocked" />
                        </RequireAuth>
                    } />
                    <Route path="/chats/manage" element={
                        <RequireManagerRole>
                            <Chats mode="manage" />
                        </RequireManagerRole>
                    } />

                    <Route path="/support" element={
                        <RequireAuth>
                            <Support />
                        </RequireAuth>
                    } />
                    <Route path="/account-settings" element={
                        <RequireAuth>
                            <AccountSettings />
                        </RequireAuth>
                    } />
                    <Route path="/privacy" element={
                        <RequireAuth>
                            <PrivacyCenter />
                        </RequireAuth>
                    } />
                    <Route path="/feedback" element={
                        <RequireAuth>
                            <Feedback />
                        </RequireAuth>
                    } />
                    <Route path="/history" element={
                        <RequireAuth>
                            <History />
                        </RequireAuth>
                    } />
                    <Route path="/settings" element={
                        <RequireAuth>
                            <Settings />
                        </RequireAuth>
                    } />

                    {/* Manager/Admin only routes */}
                    <Route path="/products/add" element={
                        <RequireManagerRole>
                            <AddProduct />
                        </RequireManagerRole>
                    } />
                    <Route path="/categories" element={
                        <RequireManagerRole>
                            <Categories />
                        </RequireManagerRole>
                    } />
                    <Route path="/categories/add" element={
                        <RequireManagerRole>
                            <AddCategory />
                        </RequireManagerRole>
                    } />
                    <Route path="/categories/edit/:id" element={
                        <RequireManagerRole>
                            <EditCategory />
                        </RequireManagerRole>
                    } />
                </Routes>
                <ToastContainer />
                </Router>
            </CurrencyProvider>
        </AuthProvider>
    );
}

export default App;
