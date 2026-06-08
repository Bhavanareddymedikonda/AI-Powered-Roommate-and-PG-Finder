import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Percent, Heart } from 'lucide-react';
import api from '../api';

const PGListing = () => {
    const [matches, setMatches] = useState([]);
    
    const [savedPgs, setSavedPgs] = useState([]);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedPgs') || '[]');
        setSavedPgs(saved);

        api.get('/pgs').then(res => {
            let data = res.data;
            
            // If user has a profile, calculate match percentages locally
            if (user.survey) {
                data = data.map(pg => {
                    let score = 0;
                    const keys = Object.keys(user.survey);
                    keys.forEach(key => {
                        const diff = Math.abs((pg.surveyResponses?.[key] || 3) - user.survey[key]);
                        score += (5 - diff);
                    });
                    const matchPercentage = Math.round((score / (keys.length * 5)) * 100);
                    return { ...pg, matchPercentage };
                }).sort((a,b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
            }
            
            setMatches(data);
        });
    }, [user.id]);

    const toggleSave = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        let saved = JSON.parse(localStorage.getItem('savedPgs') || '[]');
        if (saved.includes(id)) {
            saved = saved.filter(s => s !== id);
        } else {
            saved.push(id);
        }
        localStorage.setItem('savedPgs', JSON.stringify(saved));
        setSavedPgs(saved);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Top Matches for You</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {matches.map((pg) => (
                    <Link
                        key={pg.id}
                        to={`/pg/${pg.id}`}
                        className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={pg.images[0]}
                                alt={pg.name}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                            />
                            {pg.matchPercentage && (
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 font-bold text-primary shadow-lg">
                                    <Percent className="w-4 h-4" /> {pg.matchPercentage}%
                                </div>
                            )}
                            <button 
                                onClick={(e) => toggleSave(e, pg.id)}
                                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                                    savedPgs.includes(pg.id) 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white/90 text-gray-400 hover:text-red-500'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${savedPgs.includes(pg.id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{pg.name}</h3>
                            <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                                <MapPin className="w-4 h-4" /> {pg.location}
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-primary text-lg">₹{pg.rooms[0]?.price}<span className="text-gray-400 font-normal text-xs">/mo</span></span>
                                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-3 py-1.5 rounded-xl">
                                    <Star className="w-3.5 h-3.5 fill-current" /> 4.8
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {matches.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl shadow-inner border border-dashed">
                    <p className="text-gray-500">No matches found. Try taking the survey again!</p>
                </div>
            )}
        </div>
    );
};

export default PGListing;
