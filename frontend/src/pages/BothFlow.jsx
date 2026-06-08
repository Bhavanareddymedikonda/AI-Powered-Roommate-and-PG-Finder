import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Home, Bed, Users, CreditCard, Percent } from 'lucide-react';
import api from '../api';

const BothFlow = () => {
    const [step, setStep] = useState(1);
    const [pgs, setPgs] = useState([]);
    const [selectedPg, setSelectedPg] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roommates, setRoommates] = useState([]);
    const [selectedRoommate, setSelectedRoommate] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        api.get('/pgs').then(res => setPgs(res.data));
    }, []);

    const handlePgSelect = (pg) => {
        setSelectedPg(pg);
        setStep(2);
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        // Load roommates for this PG
        api.get(`/pgs/roommates/${user.id}`).then(res => {
            setRoommates(res.data.filter(rm => rm.pgId === selectedPg.id));
            setStep(3);
        });
    };

    const handleConfirm = async () => {
        try {
            await api.post('/pgs/book', { 
                pgId: selectedPg.id, 
                roomId: selectedRoom.id, 
                userId: user.id,
                roommateId: selectedRoommate?.id 
            });
            navigate('/booking-success'); // We can use the success view in Booking.jsx or simple alert
        } catch (err) {
            alert('Booking failed.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Multi-step progress bar */}
            <div className="flex items-center justify-between mb-16 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>
                {[
                    { id: 1, label: 'Select PG', icon: Home },
                    { id: 2, label: 'Select Room', icon: Bed },
                    { id: 3, label: 'Find Roommate', icon: Users },
                    { id: 4, label: 'Confirm & Pay', icon: CreditCard }
                ].map((s) => (
                    <div key={s.id} className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                            step >= s.id ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'bg-white border-gray-100 text-gray-300'
                        }`}>
                            <s.icon className="w-6 h-6" />
                        </div>
                        <span className={`mt-3 font-bold text-sm ${step >= s.id ? 'text-gray-900' : 'text-gray-300'}`}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Step 1: PG selection */}
            {step === 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pgs.map(pg => (
                        <div key={pg.id} onClick={() => handlePgSelect(pg)} className="cursor-pointer group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 hover:scale-105 transition">
                            <img src={pg.images[0]} className="h-48 w-full object-cover" alt={pg.name}/>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{pg.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{pg.location}</p>
                                <button className="text-primary font-bold">Select PG →</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Step 2: Room selection */}
            {step === 2 && (
                <div>
                    <button onClick={() => setStep(1)} className="mb-8 flex items-center gap-2 text-gray-500 font-bold hover:text-primary transition">
                        <ChevronLeft className="w-5 h-5" /> Back to PGs
                    </button>
                    <div className="grid md:grid-cols-3 gap-8">
                        {selectedPg.rooms.map(room => (
                            <div key={room.id} onClick={() => handleRoomSelect(room)} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl cursor-pointer hover:border-primary transition group">
                                <h4 className="text-2xl font-bold mb-2">{room.type} Sharing</h4>
                                <p className="text-3xl font-black text-primary mb-6">₹{room.price}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                                <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-2xl font-bold group-hover:bg-primary group-hover:text-white transition">Choose Room</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Roommate matching */}
            {step === 3 && (
                <div>
                    <button onClick={() => setStep(2)} className="mb-8 flex items-center gap-2 text-gray-500 font-bold hover:text-primary transition">
                        <ChevronLeft className="w-5 h-5" /> Back to Rooms
                    </button>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {roommates.map(rm => (
                            <div key={rm.id} onClick={() => { setSelectedRoommate(rm); setStep(4); }} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl cursor-pointer hover:border-emerald-400 transition flex gap-6 items-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-200">
                                    {rm.name[0]}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-2xl font-bold">{rm.name}</h4>
                                    <p className="text-gray-500 italic mb-2">"{rm.bio}"</p>
                                    <div className="flex items-center gap-1 text-emerald-600 font-black">
                                        <Percent className="w-4 h-4" /> {rm.matchPercentage}% Compatibility
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300" />
                            </div>
                        ))}
                        {roommates.length === 0 && <p className="col-span-2 text-center py-20 text-gray-400">No roommates currently in this PG. You can be the first!</p>}
                        <button onClick={() => setStep(4)} className="col-span-2 text-primary font-bold hover:underline">Skip and proceed alone</button>
                    </div>
                </div>
            )}

            {/* Step 4: Final confirmation */}
            {step === 4 && (
                <div className="max-w-2xl mx-auto bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl text-center">
                    <h2 className="text-4xl font-black mb-8">Almost There!</h2>
                    <div className="bg-gray-50 rounded-[2.5rem] p-8 text-left mb-10 space-y-4">
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-gray-500 font-medium">Property</span>
                            <span className="font-bold">{selectedPg.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-gray-500 font-medium">Room Type</span>
                            <span className="font-bold">{selectedRoom.type} Sharing</span>
                        </div>
                        {selectedRoommate && (
                            <div className="flex justify-between border-b pb-4">
                                <span className="text-gray-500 font-medium font-bold text-emerald-600">Matched Roommate</span>
                                <span className="font-bold">{selectedRoommate.name}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-2xl font-black mt-6">
                            <span>Total Payable</span>
                            <span className="text-primary">₹2,000</span>
                        </div>
                    </div>
                    <button onClick={handleConfirm} className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:scale-105 transition">
                        Confirm & Pay Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default BothFlow;
