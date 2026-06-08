import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ModeSelection from './pages/ModeSelection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Survey from './pages/Survey';
import RoommateMatching from './pages/RoommateMatching';
import BothFlow from './pages/BothFlow';
import PGListing from './pages/PGListing';
import PGDetail from './pages/PGDetail';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Saved from './pages/Saved';

import ProfileSetup from './pages/ProfileSetup';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mode-selection" element={<ModeSelection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile-setup" element={<ProfileSetup />} />
                    <Route path="/survey" element={<Survey />} />
                    <Route path="/roommates" element={<RoommateMatching />} />
                    <Route path="/both" element={<BothFlow />} />
                    <Route path="/pgs" element={<PGListing />} />
                    <Route path="/pg/:id" element={<PGDetail />} />
                    <Route path="/booking/:pgId" element={<Booking />} />
                    <Route path="/booking/:pgId/:roomId" element={<Booking />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/saved" element={<Saved />} />
                </Routes>
            </Layout>
        </Router>
    );
};


const BookingSuccess = () => (
    <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-3xl shadow-2xl border border-emerald-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">Redirecting you home soon...</p>
    </div>
);

export default App;
