// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Dashboard routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
                <ToastContainer />
            </Router>
        </AuthProvider>
    );
}

export default App;