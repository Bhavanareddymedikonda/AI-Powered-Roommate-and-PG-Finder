import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, ChevronRight, Filter, Search, X } from 'lucide-react';
import api from '../api';

const INTEREST_TAGS = ['Coding', 'Gaming', 'Cooking', 'Music', 'Fitness', 'Reading', 'Travel', 'Yoga', 'Photography', 'Art'];

const RoommateMatching = () => {
    const [allRoommates, setAllRoommates] = useState([]);
    const [filteredRoommates, setFilteredRoommates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        gender: '',
        cleanliness: '',
        social: '',
        sleep: '',
        interest: '',
    });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        api.get(`/pgs/roommates/${user.id || 'guest'}`)
            .then(res => {
                let data = res.data;

                // Recalculate based on stored profile if available
                if (user.survey) {
                    data = data.map(rm => {
                        let score = 0;
                        const keys = Object.keys(user.survey);
                        keys.forEach(key => {
                            const diff = Math.abs((rm.survey[key] || 3) - user.survey[key]);
                            score += (5 - diff);
                        });
                        const matchPercentage = Math.round((score / (keys.length * 5)) * 100);
                        return { ...rm, matchPercentage };
                    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
                }

                setAllRoommates(data);
                setFilteredRoommates(data);
            })
            .finally(() => setLoading(false));
    }, [user.id]);

    useEffect(() => {
        let result = [...allRoommates];

        // Text search — checked independently across name, occupation, bio
        if (search.trim()) {
            const q = search.toLowerCase().trim();
            result = result.filter(r =>
                r.name?.toLowerCase().includes(q) ||
                r.occupation?.toLowerCase().includes(q) ||
                r.bio?.toLowerCase().includes(q) ||
                r.interests?.some(tag => tag.toLowerCase().includes(q))
            );
        }

        // Dropdown filters — AND logic
        if (filters.gender) result = result.filter(r => r.gender === filters.gender);
        if (filters.cleanliness) result = result.filter(r => r.survey?.cleanliness >= parseInt(filters.cleanliness));
        if (filters.social) result = result.filter(r => r.survey?.social >= parseInt(filters.social));
        if (filters.sleep) result = result.filter(r => r.survey?.sleep >= parseInt(filters.sleep));
        if (filters.interest) result = result.filter(r => r.interests?.includes(filters.interest));

        setFilteredRoommates(result);
    }, [filters, search, allRoommates]);

    const clearFilters = () => {
        setFilters({ gender: '', cleanliness: '', social: '', sleep: '', interest: '' });
        setSearch('');
    };

    const isFiltered = search || Object.values(filters).some(Boolean);

    const getMatchColor = (pct) => {
        if (pct >= 85) return 'bg-emerald-500';
        if (pct >= 70) return 'bg-blue-500';
        if (pct >= 55) return 'bg-amber-500';
        return 'bg-gray-400';
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-12">
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
                    Discover <span className="text-primary italic">Roommates</span>
                </h2>
                <p className="text-xl text-gray-500 font-medium">Browse everyone. Your profile is used to rank matches automatically.</p>
            </div>

            {/* Search + Filters Panel */}
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-gray-100 mb-12">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, occupation, or bio..."
                        className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Gender</label>
                        <select
                            value={filters.gender}
                            onChange={e => setFilters({ ...filters, gender: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                        >
                            <option value="">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Cleanliness</label>
                        <select
                            value={filters.cleanliness}
                            onChange={e => setFilters({ ...filters, cleanliness: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                        >
                            <option value="">Any</option>
                            <option value="5">OCD Level (5)</option>
                            <option value="4">Neat+ (4+)</option>
                            <option value="3">Decent+ (3+)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Social Vibe</label>
                        <select
                            value={filters.social}
                            onChange={e => setFilters({ ...filters, social: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                        >
                            <option value="">Any</option>
                            <option value="4">Extrovert+ (4+)</option>
                            <option value="3">Balanced+ (3+)</option>
                            <option value="1">Introvert</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Sleep Routine</label>
                        <select
                            value={filters.sleep}
                            onChange={e => setFilters({ ...filters, sleep: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                        >
                            <option value="">Any</option>
                            <option value="4">Night Owl+ (4+)</option>
                            <option value="2">Early Bird (1-2)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Interest</label>
                        <select
                            value={filters.interest}
                            onChange={e => setFilters({ ...filters, interest: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                        >
                            <option value="">Any</option>
                            {INTEREST_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {isFiltered && (
                    <button
                        onClick={clearFilters}
                        className="mt-6 flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                        <X className="w-4 h-4" /> Clear all filters ({filteredRoommates.length} results)
                    </button>
                )}
            </div>

            {/* Results Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {filteredRoommates.map(rm => (
                    <div
                        key={rm.id}
                        className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                    >
                        {/* Avatar + Match Badge */}
                        <div className="relative flex-shrink-0">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-indigo-50 flex items-center justify-center overflow-hidden">
                                <User className="w-16 h-16 text-indigo-200" />
                            </div>
                            <div className={`absolute -top-3 -right-3 ${getMatchColor(rm.matchPercentage)} text-white w-14 h-14 rounded-full flex flex-col items-center justify-center border-4 border-white font-black text-sm shadow-xl`}>
                                {rm.matchPercentage}%
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-2xl font-bold text-gray-900 truncate">{rm.name}</h3>
                                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-lg font-bold whitespace-nowrap">{rm.gender}, {rm.age}</span>
                            </div>
                            <p className="text-sm font-semibold text-primary mb-2">{rm.occupation}</p>
                            <p className="text-gray-500 text-sm mb-5 italic">"{rm.bio}"</p>

                            {/* Interests */}
                            {rm.interests && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {rm.interests.map(tag => (
                                        <span key={tag} className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-xl">{tag}</span>
                                    ))}
                                </div>
                            )}

                            {/* PG Info */}
                            {rm.pg && (
                                <div className="bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between mb-5 border border-gray-100">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Living in</p>
                                        <p className="font-bold text-gray-800">{rm.pg.name}</p>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                                            <MapPin className="w-3 h-3" /> {rm.pg.location}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/pg/${rm.pg.id}`}
                                        className="text-xs font-black text-primary hover:underline flex items-center gap-1"
                                    >
                                        View PG <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-indigo-100">
                                    Connect
                                </button>
                                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRoommates.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                    <p className="text-2xl font-bold text-gray-300 mb-4">No roommates match these filters.</p>
                    <button onClick={clearFilters} className="text-primary font-bold hover:underline">Clear filters</button>
                </div>
            )}
        </div>
    );
};

export default RoommateMatching;
