import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from './Layout';
import '../styles/Loading.css';

// This is the v6 version of PrivateRoute
const PrivateRoute = () => {
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

    // If not authenticated, redirect to login page
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // If authenticated, render the component inside the Layout
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default PrivateRoute;
