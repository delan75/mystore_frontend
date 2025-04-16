// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [loading, setLoading] = useState(false);

    // Fetch full user profile when we have a token and user ID
    const fetchUserProfile = async (userId) => {
        if (!accessToken || !userId) return;

        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/auth/users/${userId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('User profile response:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const userId = decoded.user_id;

                // First set the basic user info with ID
                setUser(prev => ({ ...prev, id: userId }));

                // Then fetch the full profile
                fetchUserProfile(userId);
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
    }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

    const login = async (username, password) => {
        const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
            username,
            password,
        });
        const { access, refresh, user } = response.data;
        setAccessToken(access);
        setRefreshToken(refresh);
        setUser(user);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    };

    const register = async (userData) => {
        const response = await axios.post('http://127.0.0.1:8000/auth/register/', userData);
        return response.data; // Return the response data to get the generated username
    };

    const logout = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/auth/logout/', {
                refresh: refreshToken,
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};