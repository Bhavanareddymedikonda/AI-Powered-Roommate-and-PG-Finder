import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home as HomeIcon, Users, UserPlus } from 'lucide-react';
import api from '../api';

const ModeSelection = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (!user.id) navigate('/login');
        
        // Fetch recommendations if profile exists
        if (user.survey) {
            api.get('/pgs').then(res => {
                const scored = res.data.map(pg => {
                    let score = 0;
                    Object.keys(user.survey).forEach(key => {
                        const diff = Math.abs((pg.surveyResponses?.[key] || 3) - user.survey[key]);
                        score += (5 - diff);
                    });
                    return { ...pg, matchPercentage: Math.round((score / 20) * 100) };
                }).sort((a,b) => b.matchPercentage - a.matchPercentage);
                setRecommendations(scored.slice(0, 2));
            });
        }
    }, [user, navigate]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">
                    Welcome back, <span className="text-primary">{user.name?.split(' ')[0]}!</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                    Your profile is ready. Where should we look today?
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mb-20">
                {[
                    { id: 'pgs', title: 'Find a PG', desc: 'Browse all available PGs and find your home.', icon: HomeIcon, color: 'bg-blue-50 text-blue-600', path: '/pgs' },
                    { id: 'roommates', title: 'Find a Roommate', desc: 'Connect with people across all lifestyle types.', icon: Users, color: 'bg-emerald-50 text-emerald-600', path: '/roommates' },
                    { id: 'both', title: 'Match Both', desc: 'Step-by-step: PG → Room → Roommate matching.', icon: UserPlus, color: 'bg-purple-50 text-purple-600', path: '/both' },
                ].map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className="group p-10 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl hover:shadow-indigo-100 transition duration-500 transform hover:-translate-y-2 text-left flex flex-col items-start"
                    >
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition group-hover:scale-110 shadow-sm ${item.color}`}>
                            <item.icon className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">{item.desc}</p>
                        <div className="mt-auto text-primary font-black text-lg flex items-center gap-2">
                             Explore Now <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                ))}
            </div>

            {recommendations.length > 0 && (
                <div className="bg-gray-50 rounded-[4rem] p-12 border border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Recommended <span className="text-primary italic">for You</span></h2>
                        <Link to="/pgs" className="text-primary font-bold hover:underline">View All PGs</Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {recommendations.map(pg => (
                            <Link key={pg.id} to={`/pg/${pg.id}`} className="bg-white p-6 rounded-[2.5rem] flex items-center gap-6 shadow-xl hover:shadow-2xl transition group">
                                <img src={pg.images[0]} className="w-32 h-32 object-cover rounded-3xl group-hover:scale-105 transition" alt={pg.name}/>
                                <div className="flex-grow">
                                    <div className="bg-emerald-50 text-emerald-600 inline-block px-3 py-1 rounded-lg text-xs font-black mb-2 uppercase tracking-widest">{pg.matchPercentage}% Match</div>
                                    <h4 className="text-2xl font-bold text-gray-900">{pg.name}</h4>
                                    <p className="text-gray-500 text-sm">{pg.location}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ArrowRight = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export default ModeSelection;
