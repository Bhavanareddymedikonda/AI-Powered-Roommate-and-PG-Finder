import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Bed, Users, User, Sparkles } from 'lucide-react';
import api from '../api';

const STEPS = ['Select Room', 'Find Roommate', 'Confirm Booking'];

const Booking = () => {
    const { pgId, roomId: preselectedRoomId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(preselectedRoomId ? 1 : 0);
    const [pg, setPg] = useState(null);
    const [roommates, setRoommates] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(preselectedRoomId || null);
    const [selectedRoommate, setSelectedRoommate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [success, setSuccess] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const surveyComplete = user.survey && Object.keys(user.survey).length >= 4;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pgRes = await api.get(`/pgs/${pgId}`);
                setPg(pgRes.data);

                // Fetch roommate matches
                if (user.id) {
                    const rmRes = await api.get(`/pgs/roommates/${user.id}`);
                    setRoommates(rmRes.data || []);
                }
            } catch (err) {
                console.error('Failed to load data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [pgId, user.id]);

    const handleConfirm = async () => {
        setBooking(true);
        try {
            await api.post('/pgs/book', {
                pgId,
                roomId: selectedRoom,
                userId: user.id,
                roommateId: selectedRoommate || null,
            });
            setSuccess(true);
        } catch (err) {
            alert('Booking failed. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    // ---------- SUCCESS ----------
    if (success) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center p-14 bg-white rounded-[4rem] shadow-2xl border border-emerald-100">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle className="w-14 h-14" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-4 text-lg">Your room has been reserved successfully.</p>
                {selectedRoommate && (
                    <p className="text-primary font-bold mb-6">
                        🤝 Roommate request sent!
                    </p>
                )}
                <button
                    onClick={() => navigate('/mode-selection')}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-xl shadow-indigo-100"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    // ---------- SURVEY REQUIRED ----------
    if (!surveyComplete) {
        return (
            <div className="max-w-lg mx-auto mt-20 text-center">
                <div className="bg-white p-14 rounded-[4rem] shadow-2xl border border-amber-100">
                    <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <AlertTriangle className="w-14 h-14" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Profile Required</h2>
                    <p className="text-gray-500 text-lg mb-10">
                        Complete your Living Profile to book a room and find the perfect roommate match.
                    </p>
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-opacity-90 transition shadow-2xl shadow-indigo-100"
                    >
                        Complete Profile <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) return <div className="p-20 text-center text-primary font-bold text-xl">Loading booking details...</div>;
    if (!pg) return <div className="p-20 text-center text-gray-500">PG not found</div>;

    const selectedRoomObj = pg.rooms?.find(r => r.id === selectedRoom);
    const isSingleRoom = selectedRoomObj && selectedRoomObj.type && selectedRoomObj.type.toLowerCase() === 'single';
    const selectedRoommateObj = roommates.find(r => (r.id || r._id) === selectedRoommate);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-12">
                {STEPS.map((label, i) => (
                    <React.Fragment key={i}>
                        <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                                i < step ? 'bg-emerald-100 text-emerald-600' :
                                i === step ? 'bg-primary text-white shadow-lg shadow-indigo-100 scale-110' :
                                'bg-gray-100 text-gray-400'
                            }`}>
                                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                            </div>
                            <span className={`text-sm font-bold hidden sm:inline ${
                                i === step ? 'text-primary' : 'text-gray-400'
                            }`}>{label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`w-12 h-0.5 ${i < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 p-10 md:p-14">
                {/* ========== STEP 0: Select Room ========== */}
                {step === 0 && (
                    <>
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Select a Room</h2>
                            <p className="text-gray-500 font-medium">Choose a room at <span className="text-primary font-bold">{pg.name}</span></p>
                        </div>

                        {pg.rooms && pg.rooms.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6 mb-10">
                                {pg.rooms.map(room => {
                                    const isAvailable = room.available !== false;
                                    return (
                                        <button
                                            key={room.id}
                                            onClick={() => isAvailable && setSelectedRoom(room.id)}
                                            disabled={!isAvailable}
                                            className={`text-left p-8 rounded-3xl border-2 transition-all duration-200 relative overflow-hidden ${
                                                !isAvailable
                                                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                    : selectedRoom === room.id
                                                        ? 'border-primary bg-indigo-50 shadow-xl shadow-indigo-100 scale-[1.02]'
                                                        : 'border-gray-100 bg-white hover:border-primary/40 hover:shadow-lg'
                                            }`}
                                        >
                                            {!isAvailable && (
                                                <div className="absolute top-4 right-4 bg-red-50 text-red-500 px-3 py-1 rounded-xl text-xs font-black">FULL</div>
                                            )}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-2xl ${selectedRoom === room.id ? 'bg-primary text-white' : 'bg-indigo-50 text-primary'}`}>
                                                    <Bed className="w-6 h-6" />
                                                </div>
                                                <span className="text-2xl font-black text-gray-900">
                                                    ₹{room.price}<span className="text-xs font-normal text-gray-400">/mo</span>
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-bold mb-1">{room.type} Sharing</h4>
                                            <p className="text-gray-500 text-sm">{room.beds} {room.beds === 1 ? 'Bed' : 'Beds'} • Furnished • Private Desk</p>
                                            {selectedRoom === room.id && (
                                                <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                                                    <CheckCircle className="w-4 h-4" /> Selected
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-10 text-center">
                                <p className="text-amber-700 font-bold">No rooms available at the moment</p>
                                <p className="text-amber-600 text-sm mt-2">Contact the PG admin to check for upcoming availabilities.</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to PG
                            </button>
                            <button
                                onClick={() => {
                                    // Skip roommate step for Single rooms
                                    const room = pg.rooms?.find(r => r.id === selectedRoom);
                                    if (room && room.type && room.type.toLowerCase() === 'single') {
                                        setStep(2);
                                    } else {
                                        setStep(1);
                                    }
                                }}
                                disabled={!selectedRoom}
                                className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-xl shadow-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {(() => {
                                    const room = pg.rooms?.find(r => r.id === selectedRoom);
                                    return room && room.type && room.type.toLowerCase() === 'single'
                                        ? 'Next: Confirm Booking'
                                        : 'Next: Find Roommate';
                                })()} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}

                {/* ========== STEP 1: Find Roommate ========== */}
                {step === 1 && (
                    <>
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Find a Roommate</h2>
                            <p className="text-gray-500 font-medium">Choose a roommate based on ML compatibility — or skip this step.</p>
                        </div>

                        {roommates.length > 0 ? (
                            <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-2">
                                {roommates.slice(0, 8).map(rm => {
                                    const rmId = rm.id || rm._id;
                                    return (
                                        <button
                                            key={rmId}
                                            onClick={() => setSelectedRoommate(selectedRoommate === rmId ? null : rmId)}
                                            className={`w-full text-left flex items-center gap-6 p-6 rounded-3xl border-2 transition-all duration-200 ${
                                                selectedRoommate === rmId
                                                    ? 'border-primary bg-indigo-50 shadow-lg shadow-indigo-100'
                                                    : 'border-gray-100 bg-white hover:border-primary/40'
                                            }`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                                selectedRoommate === rmId ? 'bg-primary text-white' : 'bg-indigo-50 text-primary'
                                            }`}>
                                                <User className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-gray-900 text-lg">{rm.name}</h4>
                                                    {rm.age && <span className="text-gray-400 text-sm">{rm.age} yrs</span>}
                                                </div>
                                                <p className="text-gray-500 text-sm truncate">{rm.bio || rm.occupation || 'No bio available'}</p>
                                                {rm.interests && rm.interests.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {rm.interests.slice(0, 3).map(tag => (
                                                            <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-xs font-medium">{tag}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className={`text-2xl font-black ${
                                                    rm.matchPercentage >= 80 ? 'text-emerald-500' :
                                                    rm.matchPercentage >= 60 ? 'text-primary' :
                                                    'text-amber-500'
                                                }`}>
                                                    {rm.matchPercentage}%
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                    <Sparkles className="w-3 h-3" /> ML Match
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 mb-10 text-center">
                                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                                <p className="text-gray-700 font-bold">No roommates available yet</p>
                                <p className="text-gray-500 text-sm mt-1">You can book a room solo and we'll match you when someone joins!</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setStep(0)}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Change Room
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-xl shadow-indigo-100"
                            >
                                {selectedRoommate ? 'Next: Confirm' : 'Skip & Confirm'} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}

                {/* ========== STEP 2: Confirm Booking ========== */}
                {step === 2 && (
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Confirm Your Booking</h2>
                            <p className="text-gray-500 font-medium">Review the details below before confirming.</p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 mb-8 border border-gray-100 space-y-5">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                                <span className="text-gray-500 font-medium">Tenant</span>
                                <span className="font-bold text-gray-900">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                                <span className="text-gray-500 font-medium">PG</span>
                                <span className="font-bold text-gray-900">{pg.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                                <span className="text-gray-500 font-medium">Room</span>
                                <span className="font-bold text-gray-900">{selectedRoomObj ? `${selectedRoomObj.type} Sharing` : selectedRoom}</span>
                            </div>
                            {selectedRoomObj && (
                                <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                                    <span className="text-gray-500 font-medium">Monthly Rent</span>
                                    <span className="font-bold text-gray-900">₹{selectedRoomObj.price}/mo</span>
                                </div>
                            )}
                            {!isSingleRoom && (
                            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                                <span className="text-gray-500 font-medium">Roommate</span>
                                <span className="font-bold text-gray-900">
                                    {selectedRoommateObj ? (
                                        <span className="flex items-center gap-2">
                                            {selectedRoommateObj.name}
                                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-bold">
                                                {selectedRoommateObj.matchPercentage}% Match
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Solo (no roommate selected)</span>
                                    )}
                                </span>
                            </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-800 font-black text-xl">Security Deposit</span>
                                <span className="font-black text-primary text-2xl">₹2,000 <span className="text-xs text-gray-400 font-normal">(Refundable)</span></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl mb-8 border border-emerald-100">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-bold text-sm">Profile verified — you're ready to book!</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setStep(isSingleRoom ? 0 : 1)}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={booking}
                                className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-opacity-90 transition shadow-xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {booking ? 'Processing...' : 'Confirm & Reserve'}
                            </button>
                        </div>

                        <p className="mt-8 text-center text-xs text-gray-400">By confirming, you agree to our terms and conditions.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Booking;
