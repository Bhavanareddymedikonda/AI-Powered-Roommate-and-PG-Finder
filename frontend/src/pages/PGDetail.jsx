import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Wifi, Wind, Shield, Coffee, Percent, Bed, Heart, ArrowRight } from 'lucide-react';
import api from '../api';

const amenityIcons = {
    WiFi: Wifi,
    AC: Wind,
    Laundry: Shield,
    Gym: Coffee,
    Security: Shield,
};

const PGDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pg, setPg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedPgs') || '[]');
        setIsSaved(saved.includes(id));
    }, [id]);

    const toggleSave = () => {
        let saved = JSON.parse(localStorage.getItem('savedPgs') || '[]');
        if (isSaved) {
            saved = saved.filter(s => s !== id);
        } else {
            saved.push(id);
        }
        localStorage.setItem('savedPgs', JSON.stringify(saved));
        setIsSaved(!isSaved);
    };

    useEffect(() => {
        api.get(`/pgs/${id}`)
            .then(res => setPg(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-20 text-center text-primary font-bold">Loading Amazing Living Spaces...</div>;
    if (!pg) return <div className="p-20 text-center">PG Not Found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                <div>
                    <img src={pg.images[0]} alt={pg.name} className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl" />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">Premium PG</span>
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl font-bold">
                            <Percent className="w-4 h-4" /> High Match
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">{pg.name}</h1>
                        <button 
                            onClick={toggleSave}
                            className={`p-4 rounded-2xl border transition-all ${isSaved ? 'bg-red-50 border-red-100 text-red-500 shadow-lg shadow-red-100' : 'bg-white border-gray-100 text-gray-400 hover:text-red-400'}`}
                        >
                            <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-lg mb-6">
                        <MapPin className="w-5 h-5 text-primary" /> {pg.location}
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">{pg.description}</p>

                    {/* Prominent Book Room Button */}
                    <button
                        onClick={() => navigate(`/booking/${pg.id || pg._id}`)}
                        className="w-full flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-2xl font-black text-xl hover:bg-opacity-90 transition shadow-xl shadow-indigo-100 mb-10"
                    >
                        Book Room <ArrowRight className="w-6 h-6" />
                    </button>
                    
                    <h3 className="font-bold text-xl mb-6">Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {pg.amenities.map(amenity => {
                            const Icon = amenityIcons[amenity] || Coffee;
                            return (
                                <div key={amenity} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <Icon className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-8">Available Rooms</h2>
            {pg.rooms && pg.rooms.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                    {pg.rooms.map(room => (
                        <div key={room.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group">
                            {!room.available && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center font-bold text-gray-400 text-2xl rotate-12 border-2 border-dashed border-gray-200">
                                    FULL
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-indigo-50 p-4 rounded-2xl">
                                    <Bed className="w-8 h-8 text-primary" />
                                </div>
                                <span className="text-3xl font-black text-gray-900">₹{room.price}<span className="text-sm font-normal text-gray-400">/mo</span></span>
                            </div>
                            <h4 className="text-2xl font-bold mb-2">{room.type} Sharing</h4>
                            <p className="text-gray-500 mb-8">{room.beds} Beds • Private Desk • Furnished</p>
                            <Link 
                                to={`/booking/${pg.id || pg._id}/${room.id}`}
                                className={`block text-center py-4 rounded-2xl font-bold transition shadow-lg ${
                                    room.available !== false 
                                    ? 'bg-primary text-white hover:bg-opacity-90 shadow-indigo-100' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {room.available !== false ? 'Book Now' : 'Join Waitlist'}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                    <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">No rooms listed yet</p>
                </div>
            )}
        </div>
    );
};

export default PGDetail;
