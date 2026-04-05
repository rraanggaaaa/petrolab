import { useState } from 'react';
import { useAuth, useNotification } from '../../hooks';
import { Card, Button, Input, Alert } from '../../components/common';
import api from '../../api/axios';

/**
 * User Profile Page
 * Menampilkan dan mengedit profil user
 */
const Profile = () => {
    const { user, updateUser } = useAuth();
    const { showSuccess, showError } = useNotification();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await api.put('/users/profile', formData);
            if (response.data.success) {
                updateUser(response.data.data.user);
                showSuccess('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
        });
        setErrors({});
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <Card>
                <Card.Header>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                        {!isEditing && (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </Card.Header>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <Card.Body className="space-y-4">
                            <Input
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                error={errors.username}
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={errors.email}
                            />

                            <Alert
                                type="info"
                                message="Changing your email will require you to login again with the new email address."
                            />
                        </Card.Body>

                        <Card.Footer className="flex justify-end space-x-3">
                            <Button variant="outline" type="button" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" isLoading={loading}>
                                Save Changes
                            </Button>
                        </Card.Footer>
                    </form>
                ) : (
                    <Card.Body>
                        <div className="space-y-4">
                            {/* Avatar */}
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 bg-petrolab-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                                    <p className="text-lg text-gray-900">{user?.username}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <p className="text-lg text-gray-900">{user?.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                    <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                                    <p className="text-lg text-gray-900">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Change Password Card */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                </Card.Header>

                <ChangePasswordForm />
            </Card>
        </div>
    );
};

// Change Password Form Component
const ChangePasswordForm = () => {
    const { showSuccess, showError } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await api.put('/users/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            if (response.data.success) {
                showSuccess('Password changed successfully');
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card.Body className="space-y-4">
                <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    required
                    error={errors.currentPassword}
                />

                <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    error={errors.newPassword}
                />

                <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                    error={errors.confirmPassword}
                />
            </Card.Body>

            <Card.Footer className="flex justify-end">
                <Button variant="primary" type="submit" isLoading={loading}>
                    Change Password
                </Button>
            </Card.Footer>
        </form>
    );
};

export default Profile;