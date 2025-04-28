import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('signup');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneValid, setPhoneValid] = useState(true);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const { login, register } = useAuth();
    const history = useHistory();

    const handleResetPasswordClick = () => {
        history.push('/reset-password');
    };

    // Check if passwords match whenever either password changes
    useEffect(() => {
        if (confirmPassword) {
            setPasswordsMatch(password === confirmPassword && password !== '');
        }
    }, [password, confirmPassword]);

    // Validate email format
    const validateEmail = (email) => {
        // Check if email has all required parts (local part, @ symbol, and domain)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate phone number length
    const validatePhone = (phone) => {
        // Remove any non-digit characters for consistent length checking
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 6 && digitsOnly.length <= 15;
    };

    // Handle email input with validation
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // Only validate if there's input
        if (newEmail) {
            setEmailValid(validateEmail(newEmail));
        } else {
            setEmailValid(true); // Reset validation when empty
        }

        // Handle label animation
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (newEmail === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        }
    };

    // Handle phone input with validation
    const handlePhoneChange = (e) => {
        const newPhone = e.target.value;
        setPhoneNumber(newPhone);

        // Only validate if there's input
        if (newPhone) {
            setPhoneValid(validatePhone(newPhone));
        } else {
            setPhoneValid(true); // Reset validation when empty
        }

        // Handle label animation
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (newPhone === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        }
    };

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

    // Label animation logic (adapted from provided JS)
    const handleInputChange = (e, setValue) => {
        setValue(e.target.value);
        // Find the label element - it might be the previous sibling or a parent's child
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

    // Special handler for password input to check strength
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));

        // Find the label element - it might be the previous sibling or a parent's child
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (newPassword === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        }
    };

    const handleInputBlur = (e) => {
        // Find the label element - it might be the previous sibling or a parent's child
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
        // Find the label element - it might be the previous sibling or a parent's child
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label && e.target.value !== '') {
            label.classList.add('highlight');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError(null);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Please enter both username and password.');
            toast.error('Please enter both username and password.');
            return;
        }

        try {
            console.log('Attempting to login with username:', username);
            await login(username, password);
            console.log('Login successful, navigating to dashboard');
            toast.success('Logged in successfully!');
            history.push('/dashboard');
        } catch (err) {
            console.error('Login error details:', err);

            // Handle specific error responses
            if (err.response?.data) {
                const errorData = err.response.data;

                if (errorData.detail) {
                    setError(errorData.detail);
                    toast.error(errorData.detail);
                    return;
                }

                if (errorData.error) {
                    setError(errorData.error);
                    toast.error(errorData.error);
                    return;
                }
            }

            // Default error message
            setError('Login failed. Please check your credentials or try again later.');
            toast.error('Login failed. Please check your credentials or try again later.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        let hasErrors = false;

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
            hasErrors = true;
        }

        if (!emailValid) {
            setError('Please enter a valid email address.');
            toast.error('Please enter a valid email address.');
            hasErrors = true;
        }

        if (!phoneValid) {
            setError('Phone number must be between 6 and 15 digits.');
            toast.error('Phone number must be between 6 and 15 digits.');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }
        try {
            const userData = {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                gender,
                phone_number: phoneNumber,
            };

            const response = await register(userData);

            if (response.user && response.tokens) {
                setActiveTab('login');
                setError(null);

                const successMessage = `Registration successful! Your username is: ${response.user.username}
Please save this username as you'll need it to log in.`;

                toast.success(successMessage, {
                    autoClose: 10000,
                    position: "top-center",
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Clear the form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
                setGender('');
                setPhoneNumber('');
            }
        } catch (err) {
            // console.error('Registration error:', err.response?.data); // Debug error response

            if (err.response?.data) {
                const errorData = err.response?.data;

                // Handle the new error format
                if (errorData.fields) {
                    const errorMessages = Object.entries(errorData.fields)
                        .map(([field, message]) => `${field}: ${message}`)
                        .join('\n');
                    setError(errorMessages);
                    toast.error(errorMessages);
                    return;
                }

                // Handle general error message
                if (errorData.error) {
                    setError(errorData.error);
                    toast.error(errorData.error);
                    return;
                }

                // Fallback error handling
                const errorMessage = typeof errorData === 'string'
                    ? errorData
                    : 'Registration failed. Please check your information and try again.';
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="form">
            <ul className="tab-group">
                <li className={`tab ${activeTab === 'signup' ? 'active' : ''}`}>
                    <a href="#signup" onClick={() => handleTabChange('signup')}>
                        Sign Up
                    </a>
                </li>
                <li className={`tab ${activeTab === 'login' ? 'active' : ''}`}>
                    <a href="#login" onClick={() => handleTabChange('login')}>
                        Log In
                    </a>
                </li>
            </ul>

            <div className="tab-content">
                <div id="signup" style={{ display: activeTab === 'signup' ? 'block' : 'none' }}>
                    <h1>Sign Up for Free</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleRegister}>
                        <div className="top-row">
                            <div className="field-wrap">
                                <label>
                                    First Name<span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={firstName}
                                    onChange={(e) => handleInputChange(e, setFirstName)}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                            <div className="field-wrap">
                                <label>
                                    Last Name<span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={lastName}
                                    onChange={(e) => handleInputChange(e, setLastName)}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                        </div>
                        <div className="field-wrap">
                            <label>
                                Email Address<span className="req">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    required
                                    autoComplete="off"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    className={!emailValid ? 'invalid' : ''}
                                />
                                {email && !emailValid && (
                                    <div className="validation-error">
                                        <i className="fa fa-exclamation-circle text-red-500"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="field-wrap">
                            <label>
                                Set A Password<span className="req">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="off"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    className="password-input"
                                />
                                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </div>
                                {password && passwordStrength > 0 && (
                                    <div className={`password-strength ${getPasswordStrengthInfo().color}`}>
                                        <i className={getPasswordStrengthInfo().icon}></i>
                                        <span>{getPasswordStrengthInfo().text}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="field-wrap">
                            <label>
                                Confirm Password<span className="req">*</span>
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
                        <div className="field-wrap">
                            <label>
                                Gender<span className="req">*</span>
                            </label>
                            <select
                                required
                                value={gender}
                                onChange={(e) => handleInputChange(e, setGender)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                className="auth-select"
                            >
                                <option value=""></option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                        <div className="field-wrap">
                            <label>
                                Phone Number
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    autoComplete="off"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    className={!phoneValid ? 'invalid' : ''}
                                />
                                {phoneNumber && !phoneValid && (
                                    <div className="validation-error">
                                        <i className="fa fa-exclamation-circle text-red-500"></i>
                                        <span className="tooltip">Must be 6-15 digits</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="forgot">
                            <a href="/reset-password" onClick={handleResetPasswordClick}>Forgot Password?</a>

                        </p>
                        <button type="submit" className="button button-block">
                            Sign Up
                        </button>
                    </form>
                </div>

                <div id="login" style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
                    <h1>Welcome Back!</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="field-wrap">
                            <label>
                                Username or Email Address<span className="req">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                autoComplete="off"
                                value={username}
                                onChange={(e) => handleInputChange(e, setUsername)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Password<span className="req">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    required
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => handleInputChange(e, setPassword)}
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    className="login-password-input"
                                />
                                <div className="password-toggle" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                                    <i className={`fa ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </div>
                            </div>
                        </div>
                        <p className="forgot">
                            <a href="/reset-password" onClick={handleResetPasswordClick}>Forgot Password?</a>
                        </p>
                        <button className="button button-block">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
