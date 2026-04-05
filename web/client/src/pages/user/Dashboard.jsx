import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useItems, useNotification } from '../../hooks';
import { Card, Button, LoadingSpinner, Badge } from '../../components/common';

/**
 * User Dashboard Page
 * Menampilkan ringkasan items milik user yang login
 */
const Dashboard = () => {
    const { user } = useAuth();
    const { items, loading, fetchItems } = useItems();
    const { showError } = useNotification();

    const [stats, setStats] = useState({
        totalItems: 0,
        totalQuantity: 0,
        totalValue: 0,
        lowStockItems: 0,
        recentItems: [],
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Fetch items
            const response = await fetchItems({ limit: 100 });

            if (response?.success && response.data?.items) {
                const itemList = response.data.items;

                // Calculate stats
                const totalQuantity = itemList.reduce((sum, item) => sum + item.quantity, 0);
                const totalValue = itemList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const lowStock = itemList.filter(item => item.quantity < 5 && item.quantity > 0).length;

                // Get recent items (last 5)
                const recent = [...itemList].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                ).slice(0, 5);

                setStats({
                    totalItems: itemList.length,
                    totalQuantity: totalQuantity,
                    totalValue: totalValue,
                    lowStockItems: lowStock,
                    recentItems: recent,
                });
            }
        } catch (error) {
            showError('Failed to load dashboard data');
            console.error('Dashboard error:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // Stat cards data
    const statCards = [
        {
            title: 'My Items',
            value: stats.totalItems,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-blue-500',
            link: '/items',
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
            link: '/items',
        },
        {
            title: 'Total Value',
            value: `Rp ${stats.totalValue.toLocaleString()}`,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-yellow-500',
            link: '/items',
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
            link: '/items?filter=lowstock',
        },
    ];

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-600 mt-1">
                    Here's what's happening with your inventory
                </p>
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
                            <Link to="/items" className="text-sm text-petrolab-primary hover:text-blue-700">
                                View All →
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {stats.recentItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No items yet</p>
                                <Link to="/items">
                                    <Button variant="primary">Add Your First Item</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Stock: {item.quantity} | Price: Rp {item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <Link to={`/items/${item.id}`}>
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

                {/* Quick Tips */}
                <Card>
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-gray-900">Quick Tips</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Keep Stock Updated</p>
                                    <p className="text-sm text-gray-600">Regularly update your inventory quantities to avoid stockouts.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Use Categories</p>
                                    <p className="text-sm text-gray-600">Organize your items with categories for better management.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Set Low Stock Alerts</p>
                                    <p className="text-sm text-gray-600">Monitor items with quantity below 5 units.</p>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Link to="/items/new">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Item
                            </Button>
                        </Link>
                        <Link to="/items">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                View All Items
                            </Button>
                        </Link>
                        <Link to="/profile">
                            <Button variant="outline" fullWidth>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                My Profile
                            </Button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;