import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItems, useNotification, useConfirm } from '../../hooks';
import { Card, Button, LoadingSpinner, Badge, ConfirmDialog } from '../../components/common';

/**
 * Item Detail Page
 * Menampilkan detail item dan menyediakan aksi edit/delete
 */
const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchItemById, deleteItem } = useItems();
    const { showSuccess, showError } = useNotification();
    const { confirm, confirmDialog } = useConfirm();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        setLoading(true);
        try {
            const result = await fetchItemById(id);
            if (result.success) {
                setItem(result.item);
            } else {
                showError('Item not found');
                navigate('/items');
            }
        } catch (error) {
            showError('Failed to load item');
            navigate('/items');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Item',
            message: `Are you sure you want to delete "${item?.name}"?`,
            type: 'danger',
            confirmText: 'Delete',
        });

        if (confirmed) {
            try {
                await deleteItem(item.id);
                showSuccess('Item deleted successfully');
                navigate('/items');
            } catch (error) {
                showError('Failed to delete item');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStockBadge = (quantity) => {
        if (quantity === 0) {
            return <Badge variant="danger" className="text-lg px-4 py-2">Out of Stock</Badge>;
        } else if (quantity < 5) {
            return <Badge variant="warning" className="text-lg px-4 py-2">Low Stock ({quantity})</Badge>;
        }
        return <Badge variant="success" className="text-lg px-4 py-2">In Stock ({quantity})</Badge>;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!item) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Item not found</p>
                <Link to="/items" className="text-petrolab-primary hover:text-blue-700 mt-2 inline-block">
                    Back to Items
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <Link to="/items" className="text-petrolab-primary hover:text-blue-700 mb-2 inline-block">
                        ← Back to Items
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                </div>
                <div className="flex space-x-3">
                    <Link to={`/items/${item.id}/edit`}>
                        <Button variant="secondary">
                            Edit Item
                        </Button>
                    </Link>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete Item
                    </Button>
                </div>
            </div>

            {/* Item Details Card */}
            <Card>
                <Card.Body className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Item Name</h3>
                                <p className="text-lg text-gray-900">{item.name}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                                <p className="text-lg text-gray-900">{item.category || 'Uncategorized'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {item.description || 'No description provided'}
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Stock Status</h3>
                                <div className="mt-1">{getStockBadge(item.quantity)}</div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Quantity</h3>
                                <p className="text-2xl font-bold text-gray-900">{item.quantity}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                                <p className="text-2xl font-bold text-petrolab-primary">
                                    {formatPrice(item.price)}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Value</h3>
                                <p className="text-xl font-semibold text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Meta Information */}
            <Card>
                <Card.Body className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                            <span className="font-medium">Created:</span> {formatDate(item.created_at)}
                        </div>
                        <div>
                            <span className="font-medium">Last Updated:</span> {formatDate(item.updated_at)}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Confirm Dialog */}
            <ConfirmDialog {...confirmDialog} />
        </div>
    );
};

export default ItemDetail;