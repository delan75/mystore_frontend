import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // Check if passwords match whenever either password changes
    useEffect(() => {
        if (confirmPassword) {
            setPasswordsMatch(newPassword === confirmPassword && newPassword !== '');
        }
    }, [newPassword, confirmPassword]);

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength += 1;

        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1; // Has uppercase
        if (/[a-z]/.test(password)) strength += 1; // Has lowercase
        if (/[0-9]/.test(password)) strength += 1; // Has number
        if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Has special char

        return strength;
    };

    // Get password strength text and color
    const getPasswordStrengthInfo = () => {
        switch(passwordStrength) {
            case 0:
                return { text: '', color: '', icon: '' };
            case 1:
                return { text: 'Weak', color: 'text-red-500', icon: 'fa fa-exclamation-circle' };
            case 2:
                return { text: 'Fair', color: 'text-orange-500', icon: 'fa fa-info-circle' };
            case 3:
                return { text: 'Good', color: 'text-yellow-500', icon: 'fa fa-shield' };
            case 4:
                return { text: 'Strong', color: 'text-blue-500', icon: 'fa fa-shield' };
            case 5:
                return { text: 'Very Strong', color: 'text-green-500', icon: 'fa fa-check-circle' };
            default:
                return { text: '', color: '', icon: '' };
        }
    };

    // Label animation logic 
    const handleInputChange = (e, setValue) => {
        setValue(e.target.value);
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (e.target.value === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        }
    };

    // Special handler for new password input to check strength
    const handleNewPasswordChange = (e) => {
        const newPasswordValue = e.target.value;
        setNewPassword(newPasswordValue);
        setPasswordStrength(checkPasswordStrength(newPasswordValue));

        // Find the label element
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (newPasswordValue === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        }
    };

    const handleInputBlur = (e) => {
        // Find the label element
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (e.target.value === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.remove('highlight');
            }
        }
    };

    const handleInputFocus = (e) => {
        // Find the label element
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label && e.target.value !== '') {
            label.classList.add('highlight');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate passwords before submission
        let hasErrors = false;

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            toast.error('New password and confirm password do not match.');
            hasErrors = true;
        }

        if (passwordStrength < 3) {
            setError('Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.');
            toast.error('Password is too weak. Please use a stronger password.');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/auth/reset-password/', {
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
                            <div className="password-input-wrapper">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    required
                                    autoComplete="off"
                                    value={oldPassword}
                                    onChange={(e) => handleInputChange(e, setOldPassword)}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                />
                                <div className="password-toggle" onClick={() => setShowOldPassword(!showOldPassword)}>
                                    <i className={`fa ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </div>
                            </div>
                        </div>
                        <div className="field-wrap">
                            <label>
                                New Password<span className="req">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    autoComplete="off"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    className="password-input"
                                />
                                <div className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </div>
                                {newPassword && passwordStrength > 0 && (
                                    <div className={`password-strength ${getPasswordStrengthInfo().color}`}>
                                        <i className={getPasswordStrengthInfo().icon}></i>
                                        <span>{getPasswordStrengthInfo().text}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="field-wrap">
                            <label>
                                Confirm New Password<span className="req">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    autoComplete="off"
                                    value={confirmPassword}
                                    onChange={(e) => handleInputChange(e, setConfirmPassword)}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    className="confirm-password-input"
                                />
                                <div className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </div>
                                {confirmPassword && (
                                    <div className="password-match-indicator">
                                        {passwordsMatch ? (
                                            <i className="fa fa-check text-green-500"></i>
                                        ) : (
                                            <i className="fa fa-times text-red-500"></i>
                                        )}
                                    </div>
                                )}
                            </div>
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
