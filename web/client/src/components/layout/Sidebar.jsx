import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Sidebar Component
 * Sidebar navigation untuk Admin (tampil di samping kiri)
 * @param {boolean} isOpen - Status sidebar terbuka/tutup
 * @param {function} onClose - Fungsi untuk menutup sidebar (mobile)
 */
const Sidebar = ({ isOpen = true, onClose }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Menu items untuk Admin
    const adminMenuItems = [
        {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            label: 'Items Management',
            path: '/admin/items',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            label: 'Users',
            path: '/admin/users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            label: 'Categories',
            path: '/admin/categories',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
            ),
        },
        {
            label: 'Reports',
            path: '/admin/reports',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
    ];

    // Menu items untuk User biasa
    const userMenuItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            label: 'My Items',
            path: '/items',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
    ];

    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full bg-petrolab-secondary text-white z-30
          transform transition-transform duration-300 ease-in-out
          w-64 md:translate-x-0 md:static md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-blue-800">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/petrolab_icon.jpg"
                            alt="Petrolab Logo"
                            className="h-8 w-8 object-contain bg-white rounded-full p-1"
                        />
                        <span className="font-bold text-lg">Petrolab</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden text-white hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-blue-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-200
                    ${isActive
                                            ? 'bg-blue-700 text-white'
                                            : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                                        }
                  `}
                                    onClick={onClose}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
                    <div className="text-xs text-blue-300 text-center">
                        <p>© 2024 Petrolab</p>
                        <p>Version 1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;