import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useItems, useNotification } from '../../hooks';
import { Card, Button, Input, LoadingSpinner } from '../../components/common';

/**
 * Item Form Page
 * Form untuk create dan edit item
 * Kategori adalah input teks biasa (bukan dari database)
 */
const ItemForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { createItem, updateItem, fetchItemById } = useItems();
    const { showSuccess, showError } = useNotification();

    // Check if this is admin route
    const isAdminRoute = location.pathname.startsWith('/admin');
    const redirectPath = isAdminRoute ? '/admin/items' : '/items';

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        price: '',
        category: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            loadItem();
        }
    }, [id]);

    const loadItem = async () => {
        setLoading(true);
        try {
            const result = await fetchItemById(id);
            if (result.success) {
                setFormData({
                    name: result.item.name,
                    description: result.item.description || '',
                    quantity: result.item.quantity,
                    price: result.item.price,
                    category: result.item.category || '',
                });
            } else {
                showError('Item not found');
                navigate(redirectPath);
            }
        } catch (error) {
            showError('Failed to load item');
            navigate(redirectPath);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;

        if (type === 'number') {
            newValue = parseFloat(value) || 0;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }

        if (formData.quantity < 0) {
            newErrors.quantity = 'Quantity cannot be negative';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            if (isEditMode) {
                await updateItem(id, formData);
                showSuccess('Item updated successfully');
            } else {
                await createItem(formData);
                showSuccess('Item created successfully');
            }
            navigate(redirectPath);
        } catch (error) {
            showError(isEditMode ? 'Failed to update item' : 'Failed to create item');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <Card.Header>
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Item' : 'Add New Item'}
                        </h1>
                        <Link to={redirectPath} className="text-blue-600 hover:text-blue-700">
                            Cancel
                        </Link>
                    </div>
                </Card.Header>

                <form onSubmit={handleSubmit}>
                    <Card.Body className="space-y-4">
                        {/* Item Name */}
                        <Input
                            label="Item Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter item name"
                            required
                            error={errors.name}
                        />

                        {/* Category - Input teks biasa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Electronics, Furniture, Accessories, etc."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                You can enter any category name (e.g., Electronics, Furniture, Office Supplies)
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter item description (optional)"
                            />
                        </div>

                        {/* Quantity and Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                error={errors.quantity}
                            />

                            <Input
                                label="Price (Rp)"
                                name="price"
                                type="number"
                                step="1000"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                error={errors.price}
                            />
                        </div>
                    </Card.Body>

                    <Card.Footer className="flex justify-end space-x-3">
                        <Link to={redirectPath}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button variant="primary" type="submit" isLoading={submitting}>
                            {isEditMode ? 'Update Item' : 'Create Item'}
                        </Button>
                    </Card.Footer>
                </form>
            </Card>
        </div>
    );
};

export default ItemForm;