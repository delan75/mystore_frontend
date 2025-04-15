import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Label animation logic (same as AuthPage)
    const handleInputChange = (e, setValue) => {
        setValue(e.target.value);
        const label = e.target.previousElementSibling;
        if (e.target.value === '') {
            label.classList.remove('active', 'highlight');
        } else {
            label.classList.add('active', 'highlight');
        }
    };

    const handleInputBlur = (e) => {
        const label = e.target.previousElementSibling;
        if (e.target.value === '') {
            label.classList.remove('active', 'highlight');
        } else {
            label.classList.remove('highlight');
        }
    };

    const handleInputFocus = (e) => {
        const label = e.target.previousElementSibling;
        if (e.target.value !== '') {
            label.classList.add('highlight');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            toast.error('New password and confirm password do not match.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/reset-password/', {
                email,
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            toast.success('Password reset successful! Please log in with your new password.');
            setError(null);
            navigate('/auth');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Password reset failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="form" style={{ marginTop: '50px' }}>
            <div className="tab-content">
                <div id="reset-password" className="active">
                    <h1 style={{ color: '#ffffff' }}>Reset Your Password</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleResetPassword}>
                        <div className="field-wrap">
                            <label>
                                Email Address<span className="req">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                autoComplete="off"
                                value={email}
                                onChange={(e) => handleInputChange(e, setEmail)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Old Password<span className="req">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                autoComplete="off"
                                value={oldPassword}
                                onChange={(e) => handleInputChange(e, setOldPassword)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>
                                New Password<span className="req">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                autoComplete="off"
                                value={newPassword}
                                onChange={(e) => handleInputChange(e, setNewPassword)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Confirm New Password<span className="req">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                autoComplete="off"
                                value={confirmPassword}
                                onChange={(e) => handleInputChange(e, setConfirmPassword)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <button type="submit" className="button button-block">
                            Reset Password
                        </button>
                        <p className="forgot">
                            <a href="/auth">Back to Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
