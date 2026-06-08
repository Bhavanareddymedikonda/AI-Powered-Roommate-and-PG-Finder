import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Search, 
    Users, 
    Heart, 
    User, 
    LogOut, 
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/mode-selection' },
        { icon: Search, label: 'Find PG', path: '/pgs' },
        { icon: Users, label: 'Roommates', path: '/roommates' },
        { icon: Heart, label: 'Favorites', path: '/saved' },
        { icon: User, label: 'My Profile', path: '/profile' },
    ];

    if (user.role === 'admin') {
        menuItems.push({ icon: LayoutDashboard, label: 'Admin Panel', path: '/admin' });
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <Link to="/" className="text-2xl font-black text-primary tracking-tighter">
                        RoomMatch
                    </Link>
                )}
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400">
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>

            <nav className="flex-grow px-4 mt-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition duration-300 ${
                            location.pathname === item.path
                                ? 'bg-primary text-white shadow-xl shadow-indigo-100'
                                : 'text-gray-500 hover:bg-indigo-50 hover:text-primary'
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                        {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition"
                >
                    <LogOut className="w-6 h-6" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
