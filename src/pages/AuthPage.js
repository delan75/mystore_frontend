import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('signup');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's a hash in the URL
        const hash = window.location.hash.replace('#', '');
        if (hash === 'login' || hash === 'signup') {
            setActiveTab(hash);
        }
    }, []);

    const handleResetPasswordClick = () => {
        navigate('/reset-password');
    };

    // Label animation logic (adapted from provided JS)
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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError(null);
        window.location.hash = tab;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
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
                                Set A Password<span className="req">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                autoComplete="off"
                                value={password}
                                onChange={(e) => handleInputChange(e, setPassword)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Confirm Password<span className="req">*</span>
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
                        <div className="field-wrap select-wrap">
                            <label className={gender ? 'active' : ''}>
                                Gender<span className="req">*</span>
                            </label>
                            <select
                                required
                                value={gender}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    const label = e.target.previousElementSibling;
                                    if (e.target.value === '') {
                                        label.classList.remove('active', 'highlight');
                                    } else {
                                        label.classList.add('active', 'highlight');
                                    }
                                }}
                                onFocus={(e) => {
                                    const label = e.target.previousElementSibling;
                                    label.classList.add('active', 'highlight');
                                }}
                                onBlur={(e) => {
                                    const label = e.target.previousElementSibling;
                                    if (e.target.value === '') {
                                        label.classList.remove('active', 'highlight');
                                    } else {
                                        label.classList.remove('highlight');
                                    }
                                }}
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                        <div className="field-wrap">
                            <label>
                                Phone Number
                            </label>
                            <input
                                type="text"
                                autoComplete="off"
                                value={phoneNumber}
                                onChange={(e) => handleInputChange(e, setPhoneNumber)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
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
                            <input
                                type="password"
                                required
                                autoComplete="off"
                                value={password}
                                onChange={(e) => handleInputChange(e, setPassword)}
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <p className="forgot">
                            <a href="/reset-password">Forgot Password?</a>
                        </p>
                        <button className="button button-block">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
