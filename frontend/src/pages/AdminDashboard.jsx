import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus, Trash2, Edit3, CheckCircle, XCircle, Home,
    Users, TrendingUp, Eye, X, Bed, MapPin, IndianRupee,
    ChevronRight, LogOut, Settings, ToggleLeft, ToggleRight,
    UserCheck, UserX, ShieldCheck
} from 'lucide-react';
import api from '../api';

/* ─────────── MINI COMPONENTS ─────────── */

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex items-center gap-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-8 h-8" />
        </div>
        <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

const AMENITY_OPTIONS = ['WiFi', 'AC', 'Gym', 'Laundry', 'Security', 'Parking', 'CCTV', 'Hot Water'];
const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Quad'];

/* ─────────── MAIN DASHBOARD ─────────── */

const AdminDashboard = () => {
    const [pgs, setPgs] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPG, setShowAddPG] = useState(false);
    const [expandedPg, setExpandedPg] = useState(null);
    const [addingRoom, setAddingRoom] = useState(null);  // pgId
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // PG form state
    const [pgForm, setPgForm] = useState({
        name: '', location: '', description: '',
        amenities: [], imageUrl: '',
        rooms: []
    });
    const [roomForm, setRoomForm] = useState({ type: 'Single', beds: 1, price: '' });

    useEffect(() => {
        if (user.role !== 'admin') navigate('/');
        Promise.all([
            api.get('/pgs'),
            api.get('/auth/users')
        ]).then(([pgsRes, usersRes]) => {
            setPgs(pgsRes.data);
            setAllUsers(usersRes.data);
        }).finally(() => setLoading(false));
    }, []);

    const totalRooms = pgs.reduce((acc, pg) => acc + pg.rooms.length, 0);
    const availableRooms = pgs.reduce((acc, pg) => acc + pg.rooms.filter(r => r.available).length, 0);

    /* ── Add PG ── */
    const handleAddPG = async () => {
        if (!pgForm.name || !pgForm.location) return alert('Name and location are required!');
        setSaving(true);
        try {
            const payload = {
                name: pgForm.name,
                location: pgForm.location,
                description: pgForm.description,
                amenities: pgForm.amenities,
                images: [pgForm.imageUrl || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400'],
                rooms: pgForm.rooms.map((r, i) => ({ id: `r-${Date.now()}-${i}`, ...r, available: true })),
                surveyResponses: { cleanliness: 3, social: 3, sleep: 3, guestPolicy: 3 }
            };
            await api.post('/pgs/add', payload);
            // Re-fetch all PGs to reflect server state accurately
            const freshPgs = await api.get('/pgs');
            setPgs(freshPgs.data);
            setPgForm({ name: '', location: '', description: '', amenities: [], imageUrl: '', rooms: [] });
            setShowAddPG(false);
        } catch (err) {
            alert('Failed to add PG. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    /* ── Add Room to form ── */
    const addRoomToPgForm = () => {
        if (!roomForm.price) return alert('Please enter room price!');
        setPgForm(prev => ({
            ...prev,
            rooms: [...prev.rooms, { ...roomForm, id: `temp-${Date.now()}` }]
        }));
        setRoomForm({ type: 'Single', beds: 1, price: '' });
    };

    /* ── Add Room to Existing PG ── */
    const handleAddRoomToExistingPg = async (pgId) => {
        if (!roomForm.price) return alert('Please enter room price!');
        try {
            const res = await api.post(`/pgs/${pgId}/rooms`, roomForm);
            
            // Update local state
            setPgs(prev => prev.map(pg => {
                if (pg.id === pgId) {
                    return { ...pg, rooms: [...pg.rooms, res.data.room] };
                }
                return pg;
            }));

            // Reset form and close
            setRoomForm({ type: 'Single', beds: 1, price: '' });
            setAddingRoom(null);
        } catch (err) {
            console.error(err);
            alert('Failed to add room. Please try again.');
        }
    };

    /* ── Toggle Amenity ── */
    const toggleAmenity = (a) => {
        setPgForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(a)
                ? prev.amenities.filter(x => x !== a)
                : [...prev.amenities, a]
        }));
    };

    /* ── Toggle Room Availability ── */
    const handleToggleRoom = async (pgId, roomId, current) => {
        try {
            await api.patch(`/pgs/${pgId}/room/${roomId}`, { available: !current });
            setPgs(prev => prev.map(pg => pg.id === pgId
                ? { ...pg, rooms: pg.rooms.map(r => r.id === roomId ? { ...r, available: !current } : r) }
                : pg
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-14">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 text-primary text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Admin Panel</div>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Owner Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Welcome back, {user.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddPG(true)}
                        className="flex items-center gap-2 bg-primary text-white px-7 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:scale-105 transition"
                    >
                        <Plus className="w-5 h-5" /> Add New PG
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 bg-gray-100 px-5 py-4 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-14">
                <StatCard icon={Home} label="Total Properties" value={pgs.length} color="bg-indigo-50 text-indigo-600" />
                <StatCard icon={Bed} label="Total Rooms" value={totalRooms} color="bg-blue-50 text-blue-600" />
                <StatCard icon={CheckCircle} label="Available Rooms" value={availableRooms} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={Users} label="Full Rooms" value={totalRooms - availableRooms} color="bg-rose-50 text-rose-500" />
                <StatCard icon={UserCheck} label="Registered Users" value={allUsers.filter(u => u.role === 'user').length} color="bg-purple-50 text-purple-600" />
            </div>

            {/* ── PG Cards ── */}
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Your Properties</h2>
            {pgs.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                    <p className="text-2xl font-bold text-gray-300 mb-4">No properties listed yet.</p>
                    <button onClick={() => setShowAddPG(true)} className="text-primary font-bold hover:underline">+ Add your first PG</button>
                </div>
            )}

            <div className="space-y-8">
                {pgs.map(pg => (
                    <div key={pg.id} className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                        {/* PG Header */}
                        <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-72 h-52 flex-shrink-0">
                                <img src={pg.images?.[0]} className="w-full h-full object-cover" alt={pg.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                            <div className="p-8 flex-grow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{pg.name}</h3>
                                        <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                                            <MapPin className="w-4 h-4" /> {pg.location}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/pg/${pg.id}`} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition" title="View Public Page">
                                            <Eye className="w-5 h-5" />
                                        </Link>
                                        <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition" title="Edit">
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Amenity Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {pg.amenities?.map(a => (
                                        <span key={a} className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-xl">{a}</span>
                                    ))}
                                </div>

                                {/* Room summary counts */}
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="font-bold text-gray-500">{pg.rooms.length} rooms total</span>
                                    <span className="font-bold text-emerald-500">{pg.rooms.filter(r => r.available).length} available</span>
                                    <span className="font-bold text-red-400">{pg.rooms.filter(r => !r.available).length} full</span>
                                </div>

                                <button
                                    onClick={() => setExpandedPg(expandedPg === pg.id ? null : pg.id)}
                                    className="mt-5 flex items-center gap-2 text-primary font-black text-sm hover:underline"
                                >
                                    {expandedPg === pg.id ? 'Hide Rooms' : 'Manage Rooms'}
                                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedPg === pg.id ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Expandable Rooms Section */}
                        {expandedPg === pg.id && (
                            <div className="border-t border-gray-50 p-8 bg-gray-50/50">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-xl font-bold text-gray-900">Room Management</h4>
                                    <button
                                        onClick={() => setAddingRoom(addingRoom === pg.id ? null : pg.id)}
                                        className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-primary hover:text-white transition text-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Add Room
                                    </button>
                                </div>

                                {/* Existing Rooms */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                                    {pg.rooms.map(room => (
                                        <div key={room.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-bold text-gray-900">{room.type} Sharing</p>
                                                    <p className="text-sm text-gray-400">{room.beds} bed{room.beds > 1 ? 's' : ''}</p>
                                                </div>
                                                <span className="font-black text-primary">₹{room.price}/mo</span>
                                            </div>
                                            <button
                                                onClick={() => handleToggleRoom(pg.id, room.id, room.available)}
                                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
                                                    room.available
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                                                }`}
                                            >
                                                {room.available
                                                    ? <><ToggleRight className="w-4 h-4" /> Available</>
                                                    : <><ToggleLeft className="w-4 h-4" /> Mark Available</>}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Room Form (inline) */}
                                {addingRoom === pg.id && (
                                    <div className="bg-white p-8 rounded-3xl border border-primary/20 shadow-lg">
                                        <h5 className="font-black text-gray-900 mb-6 text-lg">Add New Room</h5>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Room Type</label>
                                                <select
                                                    value={roomForm.type}
                                                    onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                >
                                                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">No. of Beds</label>
                                                <input
                                                    type="number" min="1" max="6" value={roomForm.beds}
                                                    onChange={e => setRoomForm({ ...roomForm, beds: parseInt(e.target.value) })}
                                                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price / Month (₹)</label>
                                                <input
                                                    type="number" placeholder="e.g. 9000" value={roomForm.price}
                                                    onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-6">
                                            <button onClick={() => handleAddRoomToExistingPg(pg.id)} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-indigo-100">
                                                Add Room
                                            </button>
                                            <button onClick={() => setAddingRoom(null)} className="text-gray-400 font-bold hover:text-gray-600 transition">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Registered Users Table ── */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Registered Users</h2>
                    <span className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-black text-sm">
                        {allUsers.length} Total
                    </span>
                </div>
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                    {allUsers.length === 0 ? (
                        <div className="text-center py-20 text-gray-300 font-bold text-xl">No users registered yet.</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
                                    <th className="text-left px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Email</th>
                                    <th className="text-left px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
                                    <th className="text-left px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Profile Survey</th>
                                    <th className="text-left px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((u, i) => (
                                    <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/20'}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 font-medium text-sm">{u.email}</td>
                                        <td className="px-6 py-5">
                                            {u.role === 'admin' ? (
                                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 w-fit">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-black w-fit flex items-center gap-1.5">
                                                    <UserCheck className="w-3.5 h-3.5" /> Tenant
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            {u.survey ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                                    <CheckCircle className="w-4 h-4" /> Complete
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                                                    <XCircle className="w-4 h-4" /> Incomplete
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-black">Active</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── ADD PG MODAL ── */}
            {showAddPG && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
                    <div className="bg-white w-full max-w-3xl rounded-[4rem] shadow-2xl p-12 relative">
                        <button onClick={() => setShowAddPG(false)} className="absolute top-8 right-8 p-3 bg-gray-100 rounded-2xl text-gray-500 hover:bg-gray-200 transition">
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Add New PG</h2>
                        <p className="text-gray-500 font-medium mb-10">Fill in the details to list your property.</p>

                        <div className="space-y-7">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">PG Name *</label>
                                <input
                                    type="text" placeholder="e.g. Sunrise PG"
                                    value={pgForm.name}
                                    onChange={e => setPgForm({ ...pgForm, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Location *</label>
                                <input
                                    type="text" placeholder="e.g. Koramangala, Bangalore"
                                    value={pgForm.location}
                                    onChange={e => setPgForm({ ...pgForm, location: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                                <textarea
                                    rows={3} placeholder="Describe your PG..."
                                    value={pgForm.description}
                                    onChange={e => setPgForm({ ...pgForm, description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image URL (optional)</label>
                                <input
                                    type="url" placeholder="https://..."
                                    value={pgForm.imageUrl}
                                    onChange={e => setPgForm({ ...pgForm, imageUrl: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Amenities</label>
                                <div className="flex flex-wrap gap-3">
                                    {AMENITY_OPTIONS.map(a => (
                                        <button
                                            key={a}
                                            onClick={() => toggleAmenity(a)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                                                pgForm.amenities.includes(a)
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-indigo-100'
                                                    : 'bg-white text-gray-500 border-gray-100 hover:border-primary/50'
                                            }`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rooms */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Rooms</label>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <select
                                            value={roomForm.type}
                                            onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                                        >
                                            {ROOM_TYPES.map(t => <option key={t} value={t}>{t} Sharing</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            type="number" min="1" max="6" placeholder="Beds"
                                            value={roomForm.beds}
                                            onChange={e => setRoomForm({ ...roomForm, beds: parseInt(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number" placeholder="Price / month"
                                            value={roomForm.price}
                                            onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl font-semibold text-gray-700 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <button onClick={addRoomToPgForm} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add room to list
                                </button>

                                {pgForm.rooms.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                                        {pgForm.rooms.map((r, i) => (
                                            <div key={i} className="bg-indigo-50 px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-bold text-indigo-700">
                                                <span>{r.type} · {r.beds}B · ₹{r.price}</span>
                                                <button onClick={() => setPgForm(prev => ({ ...prev, rooms: prev.rooms.filter((_, idx) => idx !== i) }))}
                                                    className="text-indigo-300 hover:text-red-400 ml-2">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                            <button
                                onClick={handleAddPG}
                                disabled={saving}
                                className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-xl hover:bg-opacity-90 transition shadow-2xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {saving ? 'Publishing...' : 'Publish Property'}
                            </button>
                            <button onClick={() => setShowAddPG(false)} className="text-gray-400 font-bold hover:text-gray-600 transition px-6">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
