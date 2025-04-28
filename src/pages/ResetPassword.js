import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    requestPasswordReset,
    verifyCodeAndResetPassword,
    validateEmail,
    validatePhone,
    checkPasswordStrength
} from '../services/passwordService';

const ResetPassword = () => {
    // Form fields
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [detectedMethod, setDetectedMethod] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [step, setStep] = useState(1); // 1: Request code, 2: Verify code and set new password
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState([]);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Countdown timer states
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef(null);

    const history = useHistory();

    // Check if passwords match whenever either password changes
    useEffect(() => {
        if (confirmPassword) {
            setPasswordsMatch(newPassword === confirmPassword && newPassword !== '');
        }
    }, [newPassword, confirmPassword]);

    // Handle countdown timer
    useEffect(() => {
        if (timerActive && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setTimerActive(false);
            toast.info('Your verification code has expired. Please request a new one.');
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timerActive, timeRemaining]);

    // Format time remaining as MM:SS
    const formatTimeRemaining = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Get password strength info from the service
    const getPasswordStrengthInfo = () => {
        if (!newPassword) return { text: '', color: '', icon: '' };

        const result = checkPasswordStrength(newPassword);
        return result.strengthInfo;
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

        // Check password strength
        const strengthResult = checkPasswordStrength(newPasswordValue);
        setPasswordStrength(strengthResult.score);
        setPasswordFeedback(strengthResult.feedback);

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

    // Handle email/phone input with auto-detection
    const handleEmailOrPhoneChange = (e) => {
        const value = e.target.value;
        setEmailOrPhone(value);

        // Auto-detect if input is email or phone
        if (validateEmail(value)) {
            setDetectedMethod('email');
        } else if (validatePhone(value)) {
            setDetectedMethod('phone');
        } else {
            setDetectedMethod('');
        }

        // Handle label animation
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (value === '') {
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

    // Handle step 1: Request reset code
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validate input
        if (!emailOrPhone) {
            setError('Please enter your email or phone number.');
            toast.error('Please enter your email or phone number.');
            return;
        }

        if (!detectedMethod) {
            setError('Please enter a valid email address or phone number.');
            toast.error('Please enter a valid email address or phone number.');
            return;
        }

        setLoading(true);

        try {
            const result = await requestPasswordReset(emailOrPhone);

            if (result.success) {
                setSuccessMessage(result.message);
                toast.success('Reset code sent successfully!');
                setStep(2); // Move to step 2

                // Start the countdown timer
                setTimeRemaining(300); // 5 minutes
                setTimerActive(true);
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        setError(null);
        setResendLoading(true);

        try {
            const result = await requestPasswordReset(emailOrPhone);

            if (result.success) {
                setSuccessMessage(result.message);
                toast.success('New reset code sent successfully!');

                // Reset the countdown timer
                setTimeRemaining(300); // 5 minutes
                setTimerActive(true);
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err) {
            setError('Failed to resend code. Please try again.');
            toast.error('Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    // Handle step 2: Verify code and set new password
    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate inputs
        let hasErrors = false;

        if (!resetCode || resetCode.length !== 4 || !/^\d+$/.test(resetCode)) {
            setError('Please enter a valid 4-digit reset code.');
            toast.error('Please enter a valid 4-digit reset code.');
            hasErrors = true;
        }

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

        setLoading(true);

        try {
            const result = await verifyCodeAndResetPassword(
                emailOrPhone,
                resetCode,
                newPassword,
                confirmPassword
            );

            if (result.success) {
                toast.success('Password reset successful! Please log in with your new password.');
                setError(null);
                history.push('/auth');
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form" style={{ marginTop: '50px' }}>
            <div className="tab-content">
                <div id="reset-password" className="active">
                    <h1 style={{ color: '#ffffff' }}>Reset Your Password</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

                    {step === 1 ? (
                        // Step 1: Request reset code
                        <form onSubmit={handleRequestCode}>
                            <div className="field-wrap">
                                <label>
                                    Email or Phone Number<span className="req">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        required
                                        autoComplete="off"
                                        value={emailOrPhone}
                                        onChange={handleEmailOrPhoneChange}
                                        onBlur={handleInputBlur}
                                        onFocus={handleInputFocus}
                                        className={emailOrPhone && !detectedMethod ? 'invalid' : ''}
                                        style={{ color: '#ffffff', opacity: 1 }}
                                        placeholder=""
                                    />
                                    {detectedMethod && (
                                        <div className="validation-success" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                                            <i className="fa fa-check text-green-500"></i>
                                            <span style={{ marginLeft: '5px', fontSize: '12px', color: '#10b981' }}>
                                                {detectedMethod === 'email' ? 'Valid Email' : 'Valid Phone'}
                                            </span>
                                        </div>
                                    )}
                                    {emailOrPhone && !detectedMethod && (
                                        <div className="validation-error">
                                            <i className="fa fa-exclamation-circle text-red-500"></i>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="button button-block"
                                style={{
                                    fontSize: '1.5rem',
                                    padding: '10px 0'
                                }}
                                disabled={loading || !detectedMethod}
                            >
                                {loading ? (
                                    <span><i className="fa fa-spinner fa-spin"></i> Sending...</span>
                                ) : (
                                    'Send Reset Code'
                                )}
                            </button>

                            <p className="forgot" style={{ textAlign: 'center', marginTop: '15px' }}>
                                <a href="/auth" style={{ fontSize: '16px', color: '#1ab188', fontWeight: 'bold' }}>Back to Login</a>
                            </p>
                        </form>
                    ) : (
                        // Step 2: Verify code and set new password
                        <form onSubmit={handleVerifyAndReset}>
                            {/* Timer and Resend Code */}
                            <div className="mb-4 text-center" style={{ marginBottom: '20px' }}>
                                <div className="timer" style={{ color: timeRemaining < 60 ? '#ef4444' : '#ffffff', fontWeight: 'bold', marginBottom: '10px' }}>
                                    Code expires in: {formatTimeRemaining()}
                                </div>
                                <button
                                    type="button"
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                    onClick={handleResendCode}
                                    disabled={resendLoading || timeRemaining > 0}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: timeRemaining > 0 ? 'not-allowed' : 'pointer',
                                        opacity: timeRemaining > 0 ? 0.5 : 1
                                    }}
                                >
                                    {resendLoading ? (
                                        <span><i className="fa fa-spinner fa-spin"></i> Resending...</span>
                                    ) : timeRemaining > 0 ? (
                                        "Wait before resending"
                                    ) : (
                                        "Resend Code"
                                    )}
                                </button>
                            </div>

                            <div className="field-wrap">
                                <label>
                                    4-Digit Reset Code<span className="req">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        required
                                        autoComplete="off"
                                        value={resetCode}
                                        onChange={(e) => {
                                            // Only allow numbers and limit to 4 digits
                                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                            setResetCode(value);

                                            // Handle label animation
                                            const fieldWrap = e.target.closest('.field-wrap');
                                            const label = fieldWrap ? fieldWrap.querySelector('label') : null;

                                            if (label) {
                                                if (value === '') {
                                                    label.classList.remove('active', 'highlight');
                                                } else {
                                                    label.classList.add('active', 'highlight');
                                                }
                                            }
                                        }}
                                        onBlur={handleInputBlur}
                                        onFocus={handleInputFocus}
                                        placeholder=""
                                        maxLength="4"
                                        pattern="[0-9]{4}"
                                        style={{ color: '#ffffff', opacity: 1 }}
                                    />
                                    {resetCode && resetCode.length === 4 && (
                                        <div className="validation-success" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                                            <i className="fa fa-check text-green-500"></i>
                                        </div>
                                    )}
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
                                        style={{ color: '#ffffff', opacity: 1 }}
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

                                {/* Password strength feedback */}
                                {newPassword && passwordFeedback.length > 0 && (
                                    <div className="password-feedback" style={{ marginTop: '5px', fontSize: '12px' }}>
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {passwordFeedback.map((feedback, index) => (
                                                <li key={index} className={passwordStrength >= 3 ? 'text-green-500' : 'text-yellow-500'}>
                                                    <i className={`fa ${passwordStrength >= 3 ? 'fa-check' : 'fa-info-circle'} mr-1`}></i> {feedback}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);

                                            // Handle label animation
                                            const fieldWrap = e.target.closest('.field-wrap');
                                            const label = fieldWrap ? fieldWrap.querySelector('label') : null;

                                            if (label) {
                                                if (e.target.value === '') {
                                                    label.classList.remove('active', 'highlight');
                                                } else {
                                                    label.classList.add('active', 'highlight');
                                                }
                                            }
                                        }}
                                        onBlur={handleInputBlur}
                                        onFocus={handleInputFocus}
                                        className="confirm-password-input"
                                        style={{ color: '#ffffff', opacity: 1 }}
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

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="button button-block mb-2"
                                    style={{
                                        backgroundColor: '#6c757d',
                                        marginBottom: '10px',
                                        width: '48%',
                                        fontSize: '1.5rem',
                                        padding: '10px 0'
                                    }}
                                    onClick={() => {
                                        setStep(1);
                                        setError(null);
                                        setSuccessMessage('');
                                        setTimerActive(false);
                                        if (timerRef.current) {
                                            clearInterval(timerRef.current);
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    Back
                                </button>

                                <button
                                    type="submit"
                                    className="button button-block mb-2"
                                    style={{
                                        width: '48%',
                                        marginBottom: '10px',
                                        fontSize: '1.5rem',
                                        padding: '10px 0'
                                    }}
                                    disabled={loading || timeRemaining === 0}
                                >
                                    {loading ? (
                                        <span><i className="fa fa-spinner fa-spin"></i> Resetting...</span>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>

                            <p className="forgot" style={{ textAlign: 'center', marginTop: '15px' }}>
                                <a href="/auth" style={{ fontSize: '16px', color: '#1ab188', fontWeight: 'bold' }}>Back to Login</a>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
