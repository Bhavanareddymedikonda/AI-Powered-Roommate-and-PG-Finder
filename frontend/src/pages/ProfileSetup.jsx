import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, ArrowRight, Check } from 'lucide-react';
import api from '../api';

const questions = [
    {
        id: 'cleanliness',
        label: 'Your personal cleanliness level?',
        emoji: '🧹',
        options: ['Messy', 'Casual', 'Neat', 'Organized', 'OCD']
    },
    {
        id: 'social',
        label: 'How social are you at home?',
        emoji: '🤝',
        options: ['Full Introvert', 'Mostly Quiet', 'Balanced', 'Social', 'Party Person']
    },
    {
        id: 'sleep',
        label: 'What is your sleep schedule?',
        emoji: '🌙',
        options: ['Before 9PM', 'By 11PM', 'Midnight', 'Past 1AM', 'Night Owl']
    },
    {
        id: 'guestPolicy',
        label: 'How often will you have guests over?',
        emoji: '🚪',
        options: ['Never', 'Rarely', 'Weekends', 'Often', 'Every Day']
    },
    {
        id: 'noise',
        label: 'Your preferred noise level at home?',
        emoji: '🔊',
        options: ['Silence Only', 'Very Quiet', 'Minimal OK', 'Background OK', 'Music Loud']
    },
    {
        id: 'cooking',
        label: 'Do you cook at home?',
        emoji: '🍳',
        options: ['Never', 'Rarely', 'Weekends', 'Most Days', 'Daily Chef']
    },
    {
        id: 'workSchedule',
        label: 'What is your work / study schedule?',
        emoji: '💼',
        options: ['Remote Night', 'Remote Day', 'Office 9-5', 'Shift Work', 'Freelance']
    },
    {
        id: 'petFriendly',
        label: 'Are you okay with pets?',
        emoji: '🐾',
        options: ['No Pets', 'Cats OK', 'Dogs OK', 'All Pets', 'I Have Pets']
    }
];

const ProfileSetup = () => {
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.id) navigate('/login');
    }, [user, navigate]);

    const handleOptionSelect = (qId, index) => {
        setResponses({ ...responses, [qId]: index + 1 });
    };

    const handleNext = () => {
        const currentQ = questions[currentStep];
        if (!responses[currentQ.id]) {
            alert('Please select an option before continuing!');
            return;
        }
        if (currentStep < questions.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/pgs/survey/${user.id}`, { responses, mode: 'profile' });
            const updatedUser = { ...user, profileComplete: true, survey: responses };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            navigate('/mode-selection');
        } catch (err) {
            console.error('Profile setup failed', err);
        } finally {
            setLoading(false);
        }
    };

    const progress = ((currentStep) / questions.length) * 100;
    const currentQ = questions[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-16">
            <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden">
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-10 md:p-14">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">
                                Question {currentStep + 1} of {questions.length}
                            </p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
                                Build Your <span className="text-primary italic">Living Profile</span>
                            </h2>
                        </div>
                        <div className="text-5xl">{currentQ.emoji}</div>
                    </div>

                    {/* Answered pills */}
                    <div className="flex flex-wrap gap-2 mb-8 min-h-[32px]">
                        {questions.slice(0, currentStep).map(q => (
                            responses[q.id] && (
                                <span key={q.id} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                                    <Check className="w-3 h-3" /> {q.options[responses[q.id] - 1]}
                                </span>
                            )
                        ))}
                    </div>

                    {/* Current Question */}
                    <div className="mb-10">
                        <p className="text-2xl font-bold text-gray-800 mb-8">{currentQ.label}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {currentQ.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(currentQ.id, idx)}
                                    className={`relative px-5 py-5 rounded-3xl text-sm font-bold transition-all duration-200 border-2 text-left ${
                                        responses[currentQ.id] === idx + 1
                                            ? 'bg-primary border-primary text-white shadow-xl shadow-indigo-100 scale-105'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-primary/40 hover:bg-indigo-50/50'
                                    }`}
                                >
                                    <span className="block text-xs font-black opacity-50 mb-1">{idx + 1}</span>
                                    {option}
                                    {responses[currentQ.id] === idx + 1 && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(s => s - 1)}
                                className="px-8 py-4 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition"
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-opacity-90 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? 'Creating Profile...' : currentStep === questions.length - 1 ? 'Complete Profile 🎉' : 'Next Question →'}
                        </button>
                    </div>

                    {/* Step dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-300 ${
                                    i === currentStep ? 'w-8 h-2 bg-primary' :
                                    i < currentStep ? 'w-2 h-2 bg-emerald-400' : 'w-2 h-2 bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
