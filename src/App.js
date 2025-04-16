// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
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

const ProtectedRoute = ({ children }) => {
    const { accessToken } = useAuth();
    // If we have an access token, the user is authenticated
    return accessToken ? children : <Navigate to="/auth" />;
};

const ManagerRoute = ({ children }) => {
    const { user, accessToken } = useAuth();
    // First check if user is authenticated
    if (!accessToken) return <Navigate to="/auth" />;

    // Then check if user has the right role
    return (user?.role === 'manager' || user?.role === 'admin') ?
        children :
        <Navigate to="/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/shop" element={<Shop />} />

                    {/* Protected routes with Layout */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout>
                                <Navigate to="/dashboard" replace />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/products" element={
                        <ProtectedRoute>
                            <Layout>
                                <Products />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/products/add" element={
                        <ManagerRoute>
                            <Layout>
                                <AddProduct />
                            </Layout>
                        </ManagerRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/chats" element={
                        <ProtectedRoute>
                            <Layout>
                                <Chats />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/support" element={
                        <ProtectedRoute>
                            <Layout>
                                <Support />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/account-settings" element={
                        <ProtectedRoute>
                            <Layout>
                                <AccountSettings />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/privacy" element={
                        <ProtectedRoute>
                            <Layout>
                                <PrivacyCenter />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/feedback" element={
                        <ProtectedRoute>
                            <Layout>
                                <Feedback />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/history" element={
                        <ProtectedRoute>
                            <Layout>
                                <History />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Layout>
                                <Settings />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    {/* Category Routes - Only accessible to managers and admins */}
                    <Route path="/categories" element={
                        <ManagerRoute>
                            <Layout>
                                <Categories />
                            </Layout>
                        </ManagerRoute>
                    } />

                    <Route path="/categories/add" element={
                        <ManagerRoute>
                            <Layout>
                                <AddCategory />
                            </Layout>
                        </ManagerRoute>
                    } />

                    <Route path="/categories/edit/:id" element={
                        <ManagerRoute>
                            <Layout>
                                <EditCategory />
                            </Layout>
                        </ManagerRoute>
                    } />
                </Routes>
                <ToastContainer />
            </Router>
        </AuthProvider>
    );
}

export default App;
