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
            const response = await axiosInstance.post('/auth/token/refresh/', {
                refresh: refreshToken
            });

            const newAccessToken = response.data.access;
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
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
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch {
            return true;
        }
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (!storedAccessToken || !storedRefreshToken) {
                setLoading(false);
                return;
            }

            // Check if access token is expired
            if (isTokenExpired(storedAccessToken)) {
                // Try to refresh the token
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    setLoading(false);
                    return;
                }
            } else {
                // Token is still valid, use it
                setAccessToken(storedAccessToken);
            }

            try {
                const decoded = jwtDecode(accessToken || storedAccessToken);
                const userId = decoded.user_id;

                // First set the basic user info with ID
                setUser(prev => ({ ...prev, id: userId }));

                // Then fetch the full profile
                await fetchUserProfile(userId);
            } catch (error) {
                console.error('Invalid token:', error);
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
            const response = await axiosInstance.post('/auth/login/', {
                username,
                password,
            });
            const { access, refresh, user } = response.data;
            setAccessToken(access);
            setRefreshToken(refresh);
            setUser(user);
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
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
                // Don't add token to auth endpoints except for user profile
                if (config.url && config.url.includes('/auth/') &&
                    !config.url.includes('/auth/users/')) {
                    return config;
                }

                // If we have a token and it's expired, try to refresh it
                if (accessToken && isTokenExpired(accessToken)) {
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
                const originalRequest = error.config;

                // If we get a 401 error and we haven't already tried to refresh
                if (error.response?.status === 401 &&
                    !originalRequest._retry &&
                    refreshToken) {

                    originalRequest._retry = true;

                    try {
                        // Try to refresh the token
                        const refreshed = await refreshAccessToken();
                        if (refreshed) {
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