import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-black text-gray-900 tracking-tighter">RoomMatch</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Making urban living easier by connecting people with the <span className="text-primary font-semibold">right spaces</span> and the <span className="text-primary font-semibold">right people</span>.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Contact'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-primary font-medium transition text-sm">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Privacy Policy', 'Terms of Service'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-primary font-medium transition text-sm">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-14 pt-8 text-center">
                    <p className="text-gray-400 text-sm">© 2026 RoomMatch Technologies. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
