import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from './Layout';
import '../styles/Loading.css';

// This is the v5 version of PrivateRoute
const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
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
                    return <Redirect to="/auth" />;
                }

                // If authenticated, render the component inside the Layout
                return (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                );
            }}
        />
    );
};

export default PrivateRoute;
