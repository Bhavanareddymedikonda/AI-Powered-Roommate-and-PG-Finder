import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const Saved = () => {
    const [savedPgs, setSavedPgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedIds = JSON.parse(localStorage.getItem('savedPgs') || '[]');
        if (savedIds.length > 0) {
            api.get('/pgs').then(res => {
                const filtered = res.data.filter(pg => savedIds.includes(pg.id));
                setSavedPgs(filtered);
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div className="p-20 text-center text-primary font-bold">Loading Your Favorites...</div>;

    if (savedPgs.length === 0) {
        return (
            <div className="max-w-7xl mx-auto h-full flex flex-col items-center justify-center text-center px-4">
                <div className="bg-indigo-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8">
                    <Heart className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Your Favorite Spaces</h2>
                <p className="text-xl text-gray-500 max-w-lg mb-12 font-medium">You haven't saved any PGs yet. Start exploring and click the heart icon to save listings.</p>
                <Link 
                    to="/pgs" 
                    className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 hover:scale-105 transition shadow-2xl shadow-indigo-200"
                >
                    Explore Properties <ArrowRight />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter">Your Favorites</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedPgs.map(pg => (
                    <Link key={pg.id} to={`/pg/${pg.id}`} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 transform hover:-translate-y-2">
                        <img src={pg.images[0]} className="h-56 w-full object-cover" alt={pg.name}/>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-2">{pg.name}</h3>
                            <div className="flex items-center gap-2 text-gray-400 mb-6 font-medium">
                                <MapPin className="w-4 h-4" /> {pg.location}
                            </div>
                            <button className="text-primary font-black border-b-2 border-primary/20 pb-1">View Details</button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Saved;

