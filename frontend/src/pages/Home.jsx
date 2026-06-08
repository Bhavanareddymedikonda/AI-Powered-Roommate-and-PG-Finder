import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Heart } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return (
        <div className="relative overflow-hidden bg-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
                <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tighter">
                        Life is better with the <br/>
                        <span className="text-primary italic">Perfect Roommate</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-medium">
                        Stop settling for awkward living situations. Match with people and places that actually fit your vibe and lifestyle.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {token ? (
                            <Link 
                                to="/mode-selection" 
                                className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 hover:scale-105 transition shadow-2xl shadow-indigo-200"
                            >
                                Start Matching <ArrowRight className="group-hover:translate-x-1 transition" />
                            </Link>
                        ) : (
                            <>
                                <Link 
                                    to="/signup" 
                                    className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 hover:scale-105 transition shadow-2xl shadow-indigo-200"
                                >
                                    Get Started <ArrowRight className="group-hover:translate-x-1 transition" />
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Shield, title: 'Verified PGs', desc: 'Secure and verified properties for your peace of mind.' },
                        { icon: Heart, title: 'Compatibility First', desc: 'Matching based on cleanliness, social vibes, and sleep schedules.' },
                        { icon: Zap, title: 'Instant Booking', desc: 'Reserve your spot in minutes with our seamless digital checkout.' }
                    ].map((f, i) => (
                        <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:border-primary/20 transition">
                            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <f.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        </div>
    );
};

export default Home;
