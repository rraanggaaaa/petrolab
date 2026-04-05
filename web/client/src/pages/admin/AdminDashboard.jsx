import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useItems, useNotification } from '../../hooks';
import { Card, Button, LoadingSpinner } from '../../components/common';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { items, loading, fetchItems } = useItems();
    const { showError } = useNotification();

    const [stats, setStats] = useState({
        totalItems: 0,
        totalQuantity: 0,
        totalValue: 0,
        lowStockItems: 0,
        categories: [],
        recentItems: [],
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Fetch all items (limit 100 to get all)
            const result = await fetchItems({ limit: 100 });
            console.log('Dashboard fetch result:', result);

            if (result?.success && result.data?.items) {
                const allItems = result.data.items;

                // Calculate stats
                const totalQuantity = allItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                const totalValue = allItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
                const lowStock = allItems.filter(item => (item.quantity || 0) < 5 && (item.quantity || 0) > 0).length;
                const categories = [...new Set(allItems.map(item => item.category).filter(c => c))];

                // Get recent items (last 5)
                const recent = [...allItems]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);

                setStats({
                    totalItems: allItems.length,
                    totalQuantity: totalQuantity,
                    totalValue: totalValue,
                    lowStockItems: lowStock,
                    categories: categories,
                    recentItems: recent,
                });

                console.log('Stats calculated:', { totalItems: allItems.length, recentItems: recent.length });
            } else {
                console.warn('No items data received:', result);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            showError('Failed to load dashboard data');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Stat cards data
    const statCards = [
        {
            title: 'Total Items',
            value: stats.totalItems,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-blue-500',
            link: '/admin/items',
        },
        {
            title: 'Total Stock',
            value: stats.totalQuantity,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            ),
            color: 'bg-green-500',
            link: '/admin/items',
        },
        {
            title: 'Total Value',
            value: formatPrice(stats.totalValue),
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-yellow-500',
            link: '/admin/items',
        },
        {
            title: 'Low Stock',
            value: stats.lowStockItems,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            color: 'bg-red-500',
            link: '/admin/items?filter=lowstock',
        },
    ];

    if (loading && stats.totalItems === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back, {user?.username}!
                    </p>
                </div>
                <Link to="/admin/items/create">
                    <Button variant="primary">
                        + Add New Item
                    </Button>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <Link to={card.link} key={index} className="block">
                        <Card hoverable>
                            <Card.Body className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                    </div>
                                    <div className={`${card.color} p-3 rounded-full text-white`}>
                                        {card.icon}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Items */}
                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Items</h3>
                            <Link to="/admin/items" className="text-sm text-blue-600 hover:text-blue-700">
                                View All →
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {stats.recentItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No items yet</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Stock: {item.quantity} | Price: {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <Link to={`/admin/items/${item.id}`}>
                                            <Button variant="outline" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Categories Overview */}
                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                            <Link to="/admin/categories" className="text-sm text-blue-600 hover:text-blue-700">
                                Manage →
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {stats.categories.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No categories yet</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {stats.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/admin/items/create">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Item
                            </Button>
                        </Link>
                        <Link to="/admin/users">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Manage Users
                            </Button>
                        </Link>
                        <Link to="/admin/categories">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                </svg>
                                Categories
                            </Button>
                        </Link>
                        // Ubah link reports yang benar
                        <Link to="/admin/reports">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Reports
                            </Button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminDashboard;