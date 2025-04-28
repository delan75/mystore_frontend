import axiosInstance from '../utils/axios';

/**
 * Request a password reset code
 * @param {string} emailOrPhone - User's email or phone number
 * @returns {Promise} - API response with message
 */
export const requestPasswordReset = async (emailOrPhone) => {
  try {
    // Determine if input is email or phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
    const contactMethod = isEmail ? 'email' : 'phone';
    
    const response = await axiosInstance.post('/auth/reset-password/', {
      email_or_phone: emailOrPhone,
      contact_method: contactMethod
    });
    
    return {
      success: true,
      message: response.data.message || 'A password reset code has been sent.',
      contactMethod
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to send reset code. Please try again.',
      error
    };
  }
};

/**
 * Verify reset code and set new password
 * @param {string} emailOrPhone - User's email or phone number
 * @param {string} code - 4-digit verification code
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {Promise} - API response
 */
export const verifyCodeAndResetPassword = async (emailOrPhone, code, newPassword, confirmPassword) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password/verify/', {
      email_or_phone: emailOrPhone,
      code,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    
    return {
      success: true,
      message: response.data.message || 'Password has been reset successfully.'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to verify code or reset password. Please try again.',
      error
    };
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
  return phone.length >= 6 && phone.length <= 15 && /^\d+$/.test(phone);
};

/**
 * Check password strength and return detailed feedback
 * @param {string} password - Password to check
 * @returns {Object} - Strength score and detailed feedback
 */
export const checkPasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    strength += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters');
  } else {
    strength += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters');
  } else {
    strength += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers');
  } else {
    strength += 1;
  }
  
  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Add special characters');
  } else {
    strength += 1;
  }
  
  // Get strength text and color
  let strengthInfo = { text: '', color: '', icon: '' };
  
  switch(strength) {
    case 0:
      strengthInfo = { text: '', color: '', icon: '' };
      break;
    case 1:
      strengthInfo = { text: 'Weak', color: 'text-red-500', icon: 'fa fa-exclamation-circle' };
      break;
    case 2:
      strengthInfo = { text: 'Fair', color: 'text-orange-500', icon: 'fa fa-info-circle' };
      break;
    case 3:
      strengthInfo = { text: 'Good', color: 'text-yellow-500', icon: 'fa fa-shield' };
      break;
    case 4:
      strengthInfo = { text: 'Strong', color: 'text-blue-500', icon: 'fa fa-shield' };
      break;
    case 5:
      strengthInfo = { text: 'Very Strong', color: 'text-green-500', icon: 'fa fa-check-circle' };
      break;
    default:
      strengthInfo = { text: '', color: '', icon: '' };
  }
  
  return {
    score: strength,
    feedback: feedback.length > 0 ? feedback : ['Password is strong'],
    strengthInfo
  };
};
