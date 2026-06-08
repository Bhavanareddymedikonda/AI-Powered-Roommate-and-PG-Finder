import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const token = localStorage.getItem('token');

    const noLayoutPaths = ['/', '/login', '/signup'];
    const isLanding = noLayoutPaths.includes(location.pathname);
    const isAdmin = location.pathname.startsWith('/admin');
    const isFullScreen = ['/profile-setup'].includes(location.pathname);

    // Landing pages: simplified with navbar only
    if (isLanding) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-grow">{children}</div>
                <Footer />
            </div>
        );
    }

    // Admin pages: clean full-width, NO sidebar, no regular nav
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 overflow-y-auto">
                {children}
            </div>
        );
    }

    // Full-screen pages (e.g. profile setup wizard): no sidebar, no footer
    if (isFullScreen) {
        return (
            <div className="min-h-screen bg-white">
                {children}
            </div>
        );
    }

    // Standard authenticated layout: sidebar + main content + footer
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {token && (
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            )}
            <div className="flex-grow flex flex-col h-full overflow-hidden">
                <main className="flex-grow overflow-y-auto custom-scrollbar">
                    <div className="p-12">{children}</div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
