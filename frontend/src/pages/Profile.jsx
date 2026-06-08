import React, { useState } from 'react';
import { User, Mail, Shield, CheckCircle, Edit3, Save, X } from 'lucide-react';
import api from '../api';

const SURVEY_QUESTIONS = [
    {
        id: 'cleanliness',
        label: 'Cleanliness Level',
        options: ['Messy', 'Casual', 'Neat', 'Organized', 'OCD Clean']
    },
    {
        id: 'social',
        label: 'Social Interaction',
        options: ['Full Introvert', 'Mostly Quiet', 'Balanced', 'Social', 'Party Person']
    },
    {
        id: 'sleep',
        label: 'Sleep Routine',
        options: ['Before 9PM', 'By 11PM', 'Midnight', 'Past 1AM', 'Night Owl']
    },
    {
        id: 'guestPolicy',
        label: 'Guests at Home',
        options: ['Never', 'Rarely', 'Weekends Only', 'Often', 'Daily']
    },
    {
        id: 'noise',
        label: 'Noise Level',
        options: ['Silence Only', 'Very Quiet', 'Minimal OK', 'Background OK', 'Music Loud']
    },
    {
        id: 'cooking',
        label: 'Cooking Frequency',
        options: ['Never', 'Rarely', 'Weekends', 'Most Days', 'Daily Chef']
    },
    {
        id: 'workSchedule',
        label: 'Work/Study Schedule',
        options: ['Remote Night', 'Remote Day', 'Office 9-5', 'Shift Work', 'Freelance']
    },
    {
        id: 'petFriendly',
        label: 'Pet Friendly',
        options: ['No Pets', 'Cats OK', 'Dogs OK', 'All Pets', 'I Have Pets']
    }
];

const Profile = () => {
    const rawUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [user, setUser] = useState(rawUser);
    const [survey, setSurvey] = useState(rawUser.survey || {});
    const [editingSurvey, setEditingSurvey] = useState(!rawUser.survey);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const profileComplete = survey && Object.keys(survey).length >= 8;

    const handleSurveySubmit = async () => {
        if (Object.keys(survey).length < SURVEY_QUESTIONS.length) {
            alert('Please answer all questions to complete your profile!');
            return;
        }
        setSaving(true);
        try {
            await api.post(`/pgs/survey/${user.id}`, { responses: survey, mode: 'profile' });
            const updatedUser = { ...user, survey, profileComplete: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditingSurvey(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save profile', err);
        } finally {
            setSaving(false);
        }
    };

    const labelMap = {
        cleanliness: 'Cleanliness',
        social: 'Social',
        sleep: 'Sleep',
        guestPolicy: 'Guests',
        noise: 'Noise',
        cooking: 'Cooking',
        workSchedule: 'Schedule',
        petFriendly: 'Pets'
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter">My Profile</h2>

            {/* Profile Card */}
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-primary to-indigo-400 h-36 w-full relative">
                    <div className="absolute -bottom-16 left-12 w-32 h-32 rounded-[2.5rem] bg-white border-8 border-white shadow-xl flex items-center justify-center">
                        <User className="w-20 h-20 text-indigo-200" />
                    </div>
                </div>

                <div className="pt-20 px-12 pb-12">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{user.name}</h3>
                            <p className="text-gray-500 font-medium capitalize">{user.role === 'admin' ? 'PG Owner' : 'Tenant'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {profileComplete && (
                                <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm">
                                    <CheckCircle className="w-4 h-4" /> Profile Complete
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</p>
                                <p className="font-bold text-gray-800 truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Type</p>
                                <p className="font-bold text-gray-800 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Living Profile / Survey Section */}
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 p-10 md:p-14">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
                            Living <span className="text-primary italic">Profile</span>
                        </h3>
                        <p className="text-gray-500 mt-1 font-medium">Your lifestyle answers help us match PGs and roommates.</p>
                    </div>
                    {profileComplete && !editingSurvey && (
                        <button
                            onClick={() => setEditingSurvey(true)}
                            className="flex items-center gap-2 bg-gray-50 border border-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white hover:border-primary transition"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Answers
                        </button>
                    )}
                </div>

                {/* Incomplete banner */}
                {!profileComplete && !editingSurvey && (
                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-10 flex items-start gap-4">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-black text-amber-800 mb-1">Profile Incomplete</p>
                            <p className="text-amber-700 text-sm">Complete the survey below to unlock PG booking and get personalized recommendations.</p>
                        </div>
                    </div>
                )}

                {/* Display Current Answers (View Mode) */}
                {profileComplete && !editingSurvey && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {SURVEY_QUESTIONS.map(q => {
                            const val = survey[q.id];
                            const label = q.options[val - 1] || '—';
                            return (
                                <div key={q.id} className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">{labelMap[q.id]}</p>
                                    <p className="text-lg font-black text-primary">{label}</p>
                                    <div className="flex justify-center gap-1 mt-3">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className={`h-1.5 w-5 rounded-full ${i <= val ? 'bg-primary' : 'bg-indigo-100'}`} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Survey Form (Edit/Create Mode) */}
                {editingSurvey && (
                    <div>
                        <div className="space-y-10">
                            {SURVEY_QUESTIONS.map(q => (
                                <div key={q.id}>
                                    <p className="text-lg font-bold text-gray-800 mb-5">{q.label}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                        {q.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSurvey({ ...survey, [q.id]: idx + 1 })}
                                                className={`px-3 py-4 rounded-2xl text-sm font-bold transition-all duration-200 border-2 ${
                                                    survey[q.id] === idx + 1
                                                        ? 'bg-primary border-primary text-white shadow-xl shadow-indigo-100 scale-105'
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-primary/50 hover:text-primary'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-12">
                            <button
                                onClick={handleSurveySubmit}
                                disabled={saving}
                                className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-opacity-90 transition shadow-2xl shadow-indigo-100 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                            {profileComplete && (
                                <button
                                    onClick={() => { setEditingSurvey(false); setSurvey(user.survey); }}
                                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700 transition"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {saved && (
                    <div className="mt-8 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl font-bold border border-emerald-100">
                        <CheckCircle className="w-5 h-5" /> Profile saved successfully! Your matches will be updated.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
