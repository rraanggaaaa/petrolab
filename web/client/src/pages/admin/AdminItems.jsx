import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useItems, useNotification, useConfirm } from '../../hooks';
import { Card, Button, Input, Select, Table, Pagination, ConfirmDialog, Badge } from '../../components/common';

const AdminItems = () => {
    const { items, categories, loading, fetchItems, deleteItem, fetchCategories, pagination } = useItems();
    const { showSuccess, showError } = useNotification();
    const { confirm, confirmDialog } = useConfirm();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // Load items when search, category, or page changes
    useEffect(() => {
        const loadItems = async () => {
            console.log('Fetching items with params:', { search, category, page, limit });
            await fetchItems({ search, category, page, limit });
        };
        loadItems();
    }, [search, category, page, limit, fetchItems]);

    // Load categories once on mount
    useEffect(() => {
        const loadCategories = async () => {
            await fetchCategories();
        };
        loadCategories();
    }, [fetchCategories]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategoryFilter = (value) => {
        setCategory(value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = async (item) => {
        const confirmed = await confirm({
            title: 'Delete Item',
            message: `Are you sure you want to delete "${item.name}"?`,
            type: 'danger',
            confirmText: 'Delete',
        });

        if (confirmed) {
            try {
                const result = await deleteItem(item.id);
                if (result.success) {
                    showSuccess('Item deleted successfully');
                    // Refresh items
                    await fetchItems({ search, category, page, limit });
                } else {
                    showError(result.error || 'Failed to delete item');
                }
            } catch (error) {
                showError('Failed to delete item');
            }
        }
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setPage(1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStockBadge = (quantity) => {
        if (quantity === 0) {
            return <Badge variant="danger">Out of Stock</Badge>;
        } else if (quantity < 5) {
            return <Badge variant="warning">Low Stock ({quantity})</Badge>;
        }
        return <Badge variant="success">In Stock ({quantity})</Badge>;
    };

    const columns = [
        {
            header: 'Name',
            accessor: 'name',
            cell: (row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    {row.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{row.description}</div>
                    )}
                </div>
            ),
        },
        {
            header: 'Category',
            accessor: 'category',
            cell: (row) => (
                <Badge variant="info" rounded>
                    {row.category || 'Uncategorized'}
                </Badge>
            ),
        },
        {
            header: 'Stock',
            accessor: 'quantity',
            cell: (row) => getStockBadge(row.quantity),
        },
        {
            header: 'Price',
            accessor: 'price',
            cell: (row) => <span className="font-medium">{formatPrice(row.price)}</span>,
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Link to={`/admin/items/${row.id}`}>
                        <Button variant="outline" size="sm">
                            View
                        </Button>
                    </Link>
                    <Link to={`/admin/items/${row.id}/edit`}>
                        <Button variant="secondary" size="sm">
                            Edit
                        </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...(categories || []).map(cat => ({ value: cat, label: cat })),
    ];

    // Debug logging
    console.log('AdminItems render:', { items: items?.length, categories, loading, pagination });

    if (loading && (!items || items.length === 0)) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading items...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Items Management</h1>
                    <p className="text-gray-600 mt-1">Manage all inventory items</p>
                </div>
                <Link to="/admin/items/create">
                    <Button variant="primary">
                        + Add New Item
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Select
                            options={categoryOptions}
                            value={category}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Items Table */}
            <Card>
                <Card.Body className="p-0">
                    {(!items || items.length === 0) && !loading ? (
                        <div className="text-center py-8 text-gray-500">
                            No items found. Click "Add New Item" to create your first item.
                        </div>
                    ) : (
                        <>
                            <Table columns={columns} data={items || []} />
                            {pagination?.totalPages > 1 && (
                                <Pagination
                                    currentPage={pagination.page || page}
                                    totalPages={pagination.totalPages || 1}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Confirm Dialog */}
            <ConfirmDialog {...confirmDialog} />
        </div>
    );
};

export default AdminItems;