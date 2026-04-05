import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useNotification } from '../../hooks';
import { Button, Input, Alert, Card } from '../../components/common';

/**
 * Register Page
 * Halaman pendaftaran untuk user baru
 */
const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error, clearError } = useAuth();
    const { showSuccess, showError } = useNotification();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const [localErrors, setLocalErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
    });

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    // Check password strength
    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = '';

        if (password.length >= 8) score++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;

        if (score === 0) message = 'Very Weak';
        else if (score === 1) message = 'Weak';
        else if (score === 2) message = 'Fair';
        else if (score === 3) message = 'Good';
        else if (score === 4) message = 'Strong';

        return { score, message };
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));

        // Clear error for this field when user starts typing
        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) clearError();

        // Check password strength
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }

        // Clear confirm password error when password changes
        if (name === 'password' && formData.confirmPassword) {
            if (value !== formData.confirmPassword) {
                setLocalErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else {
                setLocalErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (formData.username.length > 50) {
            errors.username = 'Username must be less than 50 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            errors.agreeTerms = 'You must agree to the terms and conditions';
        }

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const result = await register(
            formData.username,
            formData.email,
            formData.password
        );

        setIsSubmitting(false);

        if (result.success) {
            showSuccess(`Welcome to Petrolab Inventory, ${result.user.username}!`);
            navigate('/dashboard');
        } else {
            showError(result.error || 'Registration failed. Please try again.');
        }
    };

    // Get password strength color
    const getPasswordStrengthColor = () => {
        const colors = {
            0: 'bg-red-500',
            1: 'bg-red-400',
            2: 'bg-yellow-500',
            3: 'bg-green-400',
            4: 'bg-green-600',
        };
        return colors[passwordStrength.score] || 'bg-gray-300';
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <Card.Body className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Account
                    </h2>
                    <p className="text-gray-600">
                        Join Petrolab Inventory to manage your items
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={clearError}
                        className="mb-6"
                    />
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johndoe"
                        required
                        error={localErrors.username}
                    />

                    {/* Email */}
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        error={localErrors.email}
                    />

                    {/* Password */}
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            error={localErrors.password}
                        />

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {passwordStrength.message}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Use 8+ characters with a mix of letters, numbers & symbols
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        error={localErrors.confirmPassword}
                    />

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 text-petrolab-primary border-gray-300 rounded focus:ring-petrolab-primary"
                        />
                        <label className="text-sm text-gray-600">
                            I agree to the{' '}
                            <Link to="/terms" className="text-petrolab-primary hover:text-blue-700">
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-petrolab-primary hover:text-blue-700">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    {localErrors.agreeTerms && (
                        <p className="text-sm text-red-600 -mt-2">{localErrors.agreeTerms}</p>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isSubmitting || loading}
                        disabled={isSubmitting || loading}
                        className="mt-6"
                    >
                        Create Account
                    </Button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-petrolab-primary hover:text-blue-700 transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Register;