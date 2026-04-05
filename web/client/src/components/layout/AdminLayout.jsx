import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <div className="flex flex-1">

                <main className="flex-1 overflow-x-hidden">
                    <button
                        onClick={toggleSidebar}
                        className="fixed bottom-4 right-4 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="container mx-auto px-4 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default AdminLayout;