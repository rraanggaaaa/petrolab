import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useNotification } from '../../hooks';
import { Button, Input, Alert, Card } from '../../components/common';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, error, clearError } = useAuth();
    const { showSuccess, showError } = useNotification();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [localErrors, setLocalErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) clearError();
    };

    const validateForm = () => {
        const errors = {};

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

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const result = await login(formData.email, formData.password);

        setIsSubmitting(false);

        if (result.success) {
            showSuccess(`Welcome back, ${result.user.username}!`);
            navigate(from, { replace: true });
        } else {
            showError(result.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo dan Header */}
                <div className="text-center">
                    <img
                        src="/petrolab_icon.jpg"
                        alt="Petrolab Logo"
                        className="mx-auto h-16 w-16 object-contain mb-4"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <h2 className="text-3xl font-bold text-gray-900">
                        Petrolab Inventory
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                    {/* Error Alert */}
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={clearError}
                            className="mb-6"
                        />
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-petrolab-primary focus:border-transparent ${localErrors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="you@example.com"
                            />
                            {localErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{localErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-petrolab-primary focus:border-transparent ${localErrors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="••••••••"
                            />
                            {localErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{localErrors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-petrolab-primary focus:ring-petrolab-primary border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm text-petrolab-primary hover:text-blue-700"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-petrolab-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petrolab-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting || loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-medium text-petrolab-primary hover:text-blue-700"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;