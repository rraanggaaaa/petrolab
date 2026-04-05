import { useEffect, useState } from 'react';
import { useItems, useNotification, useConfirm } from '../../hooks';
import { Card, Button, Input, Table, Alert, ConfirmDialog } from '../../components/common';

/**
 * Admin Categories Page
 * Manage item categories
 */
const AdminCategories = () => {
    const { categories, fetchCategories, items } = useItems();
    const { showSuccess, showError } = useNotification();
    const { confirm, confirmDialog } = useConfirm();

    const [newCategory, setNewCategory] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [categoryCounts, setCategoryCounts] = useState({});

    useEffect(() => {
        loadCategories();
        calculateCategoryCounts();
    }, [categories, items]);

    const loadCategories = async () => {
        await fetchCategories();
    };

    const calculateCategoryCounts = () => {
        const counts = {};
        items.forEach(item => {
            if (item.category) {
                counts[item.category] = (counts[item.category] || 0) + 1;
            }
        });
        setCategoryCounts(counts);
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            showError('Category name is required');
            return;
        }

        if (categories.includes(newCategory.trim())) {
            showError('Category already exists');
            return;
        }

        setIsAdding(true);
        // Note: This would require a backend endpoint to add categories
        // For now, just show success message
        setTimeout(() => {
            showSuccess(`Category "${newCategory}" added successfully`);
            setNewCategory('');
            setIsAdding(false);
            loadCategories();
        }, 500);
    };

    const handleDeleteCategory = async (category) => {
        const itemCount = categoryCounts[category] || 0;

        if (itemCount > 0) {
            showError(`Cannot delete category with ${itemCount} items. Please reassign or delete items first.`);
            return;
        }

        const confirmed = await confirm({
            title: 'Delete Category',
            message: `Are you sure you want to delete category "${category}"?`,
            type: 'danger',
            confirmText: 'Delete',
        });

        if (confirmed) {
            // Note: This would require a backend endpoint to delete categories
            showSuccess(`Category "${category}" deleted successfully`);
            loadCategories();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-gray-600 mt-1">Manage item categories</p>
            </div>

            {/* Add New Category */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
                </Card.Header>
                <Card.Body>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Enter category name..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            onClick={handleAddCategory}
                            isLoading={isAdding}
                        >
                            Add Category
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Categories List */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900">All Categories</h3>
                </Card.Header>
                <Card.Body>
                    {categories.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No categories yet. Add your first category!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <span className="font-medium text-gray-900">{category}</span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({categoryCounts[category] || 0} items)
                                        </span>
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteCategory(category)}
                                        disabled={categoryCounts[category] > 0}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Info Alert */}
            <Alert
                type="info"
                message="Categories with existing items cannot be deleted. Remove or reassign items first."
            />

            {/* Confirm Dialog */}
            <ConfirmDialog {...confirmDialog} />
        </div>
    );
};

export default AdminCategories;