import { useEffect, useState, useCallback } from 'react';
import { useAuth, useNotification, useConfirm } from '../../hooks';
import { Card, Button, Input, Table, Pagination, ConfirmDialog, Modal, Badge } from '../../components/common';
import { getUsers, createUser, updateUser, deleteUser, updateUserRole } from '../../api/user';

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const { showSuccess, showError } = useNotification();
    const { confirm, confirmDialog } = useConfirm();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getUsers({ search, page, limit });
            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            showError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [search, page, limit, showError]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user',
            });
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'user',
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!editingUser && !formData.password) {
            errors.password = 'Password is required for new user';
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            if (editingUser) {
                const updateData = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                };
                await updateUser(editingUser.id, updateData);
                showSuccess('User updated successfully');
            } else {
                await createUser(formData);
                showSuccess('User created successfully');
            }
            handleCloseModal();
            loadUsers();
        } catch (error) {
            showError(error.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (userId === currentUser?.id) {
            showError('You cannot change your own role');
            return;
        }

        try {
            await updateUserRole(userId, newRole);
            showSuccess('User role updated successfully');
            loadUsers();
        } catch (error) {
            showError('Failed to update user role');
        }
    };

    const handleDeleteUser = async (user) => {
        if (user.id === currentUser?.id) {
            showError('You cannot delete your own account');
            return;
        }

        const confirmed = await confirm({
            title: 'Delete User',
            message: `Are you sure you want to delete user "${user.username}"?`,
            type: 'danger',
            confirmText: 'Delete',
        });

        if (confirmed) {
            try {
                await deleteUser(user.id);
                showSuccess('User deleted successfully');
                loadUsers();
            } catch (error) {
                showError('Failed to delete user');
            }
        }
    };

    const columns = [
        {
            header: 'User',
            accessor: 'username',
            cell: (row) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {row.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{row.username}</div>
                        <div className="text-sm text-gray-500">{row.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Role',
            accessor: 'role',
            cell: (row) => (
                <select
                    value={row.role}
                    onChange={(e) => handleRoleChange(row.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={row.id === currentUser?.id}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            ),
        },
        {
            header: 'Joined',
            accessor: 'created_at',
            cell: (row) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.created_at).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(row)}
                        disabled={row.id === currentUser?.id}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage all users and their roles</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    + Add New User
                </Button>
            </div>

            {/* Search */}
            <Card>
                <Card.Body>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Search by username or email..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="outline" onClick={() => handleSearch('')}>
                            Clear
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Users Table */}
            <Card>
                <Card.Body className="p-0">
                    <Table
                        columns={columns}
                        data={users}
                        loading={loading}
                        emptyMessage="No users found"
                    />
                    {pagination.totalPages > 1 && (
                        <div className="p-4">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* User Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? 'Edit User' : 'Add New User'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        error={formErrors.username}
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        error={formErrors.email}
                    />

                    <Input
                        label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        error={formErrors.password}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" type="button" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" isLoading={submitting}>
                            {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Dialog */}
            <ConfirmDialog {...confirmDialog} />
        </div>
    );
};

export default AdminUsers;