import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from './Layout';
import '../styles/Loading.css';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    // Show loading indicator while checking authentication
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

    // If not authenticated, redirect to login page
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // If authenticated, render the child routes inside the Layout
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default PrivateRoute;
