import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const pgQuestions = [
    { id: 'cleanliness', label: 'How important is property hygiene?', options: ['Basic', 'Good', 'Regular', 'Very Clean', 'Clinical'] },
    { id: 'social', label: 'Preferred atmosphere?', options: ['Quiet Study', 'Peaceful', 'Friendly', 'Social', 'Happening'] },
    { id: 'sleep', label: 'Electricity/AC usage?', options: ['Minimal', 'Daytime', 'Night Only', 'Split', '24/7'] },
    { id: 'guestPolicy', label: 'Visitor frequency allowed?', options: ['Strict No', 'Parents Only', 'Occasional', 'Regular', 'Open'] }
];

const roommateQuestions = [
    { id: 'cleanliness', label: 'Your personal cleanliness level?', options: ['Messy', 'Casual', 'Neat', 'Organized', 'OCD'] },
    { id: 'social', label: 'How often do you like social interactions?', options: ['Rarely', 'Occasional', 'Often', 'Daily', 'Socialite'] },
    { id: 'sleep', label: 'Your sleep routine?', options: ['Morning Lark', 'Early', 'Neutral', 'Late Night', 'Night Owl'] },
    { id: 'guestPolicy', label: 'Will you have friends over?', options: ['Never', 'Rarely', 'Weekends', 'Often', 'Daily'] }
];

const Survey = () => {
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const mode = localStorage.getItem('mode') || 'pg';
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.id) navigate('/login');
    }, [user, navigate]);

    const activeQuestions = mode === 'pg' ? pgQuestions : roommateQuestions;

    const handleOptionSelect = (qId, index) => {
        setResponses({ ...responses, [qId]: index + 1 });
    };

    const handleSubmit = async () => {
        if (Object.keys(responses).length < activeQuestions.length) {
            alert('Please answer all questions!');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post(`/pgs/survey/${user.id}`, { responses, mode });
            
            if (mode === 'roommate') {
                const rmRes = await api.get(`/pgs/roommates/${user.id}`);
                localStorage.setItem('roommateMatches', JSON.stringify(rmRes.data));
                navigate('/roommates');
            } else if (mode === 'both') {
                navigate('/both');
            } else {
                localStorage.setItem('matches', JSON.stringify(data.matches));
                navigate('/pgs');
            }
        } catch (err) {
            console.error('Survey failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100">
                <h2 className="text-4xl font-black mb-2 text-gray-900 capitalize tracking-tight">{mode === 'pg' ? 'Space Search' : 'Roomie Search'}</h2>
                <p className="text-lg text-gray-500 mb-12 font-medium">Tell us about your mindset so we can match your vibe.</p>

                <div className="space-y-12">
                    {activeQuestions.map((q) => (
                        <div key={q.id}>
                            <p className="text-xl font-bold text-gray-800 mb-6">{q.label}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                {q.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(q.id, idx)}
                                        className={`px-4 py-4 rounded-2xl text-sm font-bold transition duration-300 border-2 ${
                                            responses[q.id] === idx + 1
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-indigo-100'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-primary/50'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-20 w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xl hover:bg-opacity-90 transition shadow-2xl shadow-indigo-100 disabled:opacity-50"
                >
                    {loading ? 'Analyzing Your Vibe...' : 'Find Matches →'}
                </button>
            </div>
        </div>
    );
};

export default Survey;
