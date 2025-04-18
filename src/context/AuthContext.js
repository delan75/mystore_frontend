// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [loading, setLoading] = useState(false);

    // Refresh token function
    const refreshAccessToken = async () => {
        if (!refreshToken) return false;

        try {
            // Use axios directly to avoid interceptors that might cause infinite loops
            const response = await axiosInstance.post('/auth/token/refresh/', {
                refresh: refreshToken
            }, {
                // Skip the request interceptor for this call
                headers: {
                    'Content-Type': 'application/json',
                    // Don't include Authorization header
                }
            });

            const newAccessToken = response.data.access;
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            // Only logout if it's not a network error
            if (error.response) {
                logout();
            }
            return false;
        }
    };

    // Fetch full user profile when we have a token and user ID
    const fetchUserProfile = async (userId) => {
        if (!accessToken || !userId) return;

        try {
            setLoading(true);
            const response = await axiosInstance.get(`/auth/users/${userId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);

            // If we get a 401 error, try to refresh the token
            if (error.response && error.response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // Retry the request with the new token
                    try {
                        const retryResponse = await axiosInstance.get(`/auth/users/${userId}/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                        setUser(retryResponse.data);
                    } catch (retryError) {
                        console.error('Failed to fetch user profile after token refresh:', retryError);
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Check token expiration
    const isTokenExpired = (token) => {
        if (!token) {
            console.log('No token provided to isTokenExpired');
            return true;
        }

        try {
            const decoded = jwtDecode(token);
            if (!decoded.exp) {
                console.log('Token does not contain expiration claim');
                return true;
            }

            const currentTime = Date.now() / 1000;
            const isExpired = decoded.exp < currentTime;

            if (isExpired) {
                console.log(`Token expired at ${new Date(decoded.exp * 1000).toISOString()}, current time is ${new Date().toISOString()}`);
            } else {
                const timeLeft = decoded.exp - currentTime;
                console.log(`Token valid for ${Math.round(timeLeft)} more seconds`);
            }

            return isExpired;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('Initializing auth state...');
                const storedAccessToken = localStorage.getItem('accessToken');
                const storedRefreshToken = localStorage.getItem('refreshToken');

                if (!storedAccessToken || !storedRefreshToken) {
                    console.log('No stored tokens found');
                    setLoading(false);
                    return;
                }

                // Check if access token is expired
                if (isTokenExpired(storedAccessToken)) {
                    console.log('Stored access token is expired, attempting to refresh...');
                    // Try to refresh the token
                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        console.log('Token refresh failed during initialization');
                        setLoading(false);
                        return;
                    }
                    console.log('Token refreshed successfully during initialization');
                } else {
                    // Token is still valid, use it
                    console.log('Stored access token is still valid');
                    setAccessToken(storedAccessToken);
                }

                try {
                    const tokenToUse = accessToken || storedAccessToken;
                    console.log('Decoding token to get user ID...');
                    const decoded = jwtDecode(tokenToUse);
                    const userId = decoded.user_id;

                    // First set the basic user info with ID
                    setUser(prev => ({ ...prev, id: userId }));

                    // Then fetch the full profile
                    console.log('Fetching user profile...');
                    await fetchUserProfile(userId);
                } catch (error) {
                    console.error('Invalid token or failed to fetch profile:', error);
                    logout();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                // Clear any invalid state
                logout();
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        initAuth();
    }, []); // Run only on mount

    const login = async (username, password) => {
        try {
            console.log('Attempting login...');
            const response = await axiosInstance.post('/auth/login/', {
                username,
                password,
            });
            console.log('Login successful, setting tokens...');
            const { access, refresh, user } = response.data;
            setAccessToken(access);
            setRefreshToken(refresh);
            setUser(user);
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            // Clear any existing tokens on login failure
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register/', userData);
            return response.data; // Return the response data to get the generated username
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        if (refreshToken) {
            try {
                await axiosInstance.post('/auth/logout/', {
                    refresh: refreshToken,
                });
            } catch (error) {
                console.error('Logout failed:', error);
                // Continue with logout even if the API call fails
            }
        }
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // Setup axios interceptor for automatic token refresh
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            async (config) => {
                // Skip token handling for refresh token requests to avoid loops
                if (config.url && config.url.includes('/auth/token/refresh/')) {
                    return config;
                }

                // Don't add token to auth endpoints except for user profile
                if (config.url && config.url.includes('/auth/') &&
                    !config.url.includes('/auth/users/')) {
                    return config;
                }

                // If we have a token and it's expired, try to refresh it
                if (accessToken && isTokenExpired(accessToken)) {
                    console.log('Token expired, attempting to refresh...');
                    const refreshed = await refreshAccessToken();
                    if (refreshed) {
                        // Update the Authorization header with the new token
                        config.headers.Authorization = `Bearer ${accessToken}`;
                    }
                } else if (accessToken) {
                    // Add the current token to the request
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                // If there's no response (network error), just reject
                if (!error.response) {
                    return Promise.reject(error);
                }

                const originalRequest = error.config;

                // If we get a 401 error and we haven't already tried to refresh
                if (error.response?.status === 401 &&
                    !originalRequest._retry &&
                    refreshToken) {

                    originalRequest._retry = true;
                    console.log('Received 401, attempting to refresh token...');

                    try {
                        // Try to refresh the token
                        const refreshed = await refreshAccessToken();
                        if (refreshed) {
                            console.log('Token refreshed successfully, retrying request');
                            // Update the request with the new token
                            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            // Retry the original request
                            return axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // If refresh fails, logout and redirect to login
                        logout();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        // Clean up interceptors when component unmounts
        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, refreshToken]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            login,
            register,
            logout,
            loading,
            refreshAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};