import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-primary tracking-tighter">
                    RoomMatch
                </Link>
                <div className="flex items-center gap-8">
                    {token ? (
                        <>
                            <Link to="/mode-selection" className="font-bold text-gray-600 hover:text-primary transition">Dashboard</Link>
                            <Link to="/profile" className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition group">
                                <User className="w-6 h-6" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="font-bold text-gray-600 hover:text-primary transition">Login</Link>
                            <Link to="/signup" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition shadow-lg shadow-indigo-100">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
