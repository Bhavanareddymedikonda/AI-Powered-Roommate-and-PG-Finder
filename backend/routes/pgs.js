const express = require('express');
const axios = require('axios');
const PG = require('../models/PG');
const User = require('../models/User');
const Roommate = require('../models/Roommate');
const Booking = require('../models/Booking');
const router = express.Router();

// Get all PGs
router.get('/', async (req, res) => {
    try {
        const pgs = await PG.find();
        res.json(pgs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Save Survey & Calculate Match Percentage
router.post('/survey/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { responses, mode } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.survey = responses;
        user.mode = mode;
        await user.save();

        const pgs = await PG.find();
        
        const matches = pgs.map(pg => {
            let score = 0;
            const keys = Object.keys(responses);
            keys.forEach(key => {
                if (pg.surveyResponses && pg.surveyResponses[key]) {
                    const diff = Math.abs(pg.surveyResponses[key] - responses[key]);
                    score += (5 - diff);
                }
            });
            const matchPercentage = Math.round((score / (keys.length * 5)) * 100);
            return { ...pg.toObject(), matchPercentage };
        });

        res.json({ 
            message: 'Survey saved', 
            matches: matches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 4) 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Roommate Matches (limited + parallel ML scoring)
router.get('/roommates/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        let user;
        if (userId !== 'guest') {
            user = await User.findById(userId);
        }

        const userResponses = (user && user.survey) ? user.survey : {
            cleanliness: 3, social: 3, sleep: 3, guestPolicy: 3,
            noise: 3, cooking: 3, workSchedule: 3, petFriendly: 3
        };

        // Sample max 50 roommates randomly from the DB to keep response fast
        const roommates = await Roommate.aggregate([{ $sample: { size: 50 } }]);
        const pgs = await PG.find({}, 'id name location').lean();

        const mlApiUrl = process.env.ML_API_URL || 'http://localhost:5001';

        // Helper: ML prediction with 2s timeout, falls back to math
        const predictScore = async (rm) => {
            const survey = rm.survey || {};
            const payload = {
                cleanliness_diff:  Math.abs((survey.cleanliness  || 3) - (userResponses.cleanliness  || 3)),
                social_diff:       Math.abs((survey.social       || 3) - (userResponses.social       || 3)),
                sleep_diff:        Math.abs((survey.sleep        || 3) - (userResponses.sleep        || 3)),
                guestPolicy_diff:  Math.abs((survey.guestPolicy  || 3) - (userResponses.guestPolicy  || 3)),
                noise_diff:        Math.abs((survey.noise        || 3) - (userResponses.noise        || 3)),
                cooking_diff:      Math.abs((survey.cooking      || 3) - (userResponses.cooking      || 3)),
                workSchedule_diff: Math.abs((survey.workSchedule || 3) - (userResponses.workSchedule || 3)),
                petFriendly_diff:  Math.abs((survey.petFriendly  || 3) - (userResponses.petFriendly  || 3)),
            };

            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 2000);
                const response = await axios.post(`${mlApiUrl}/predict`, payload, {
                    signal: controller.signal,
                    timeout: 2000
                });
                clearTimeout(timeout);
                return Math.round(response.data.score);
            } catch {
                // Fallback: linear math score
                const diffs = Object.values(payload);
                const maxScore = diffs.length * 4;
                const score = maxScore - diffs.reduce((a, b) => a + b, 0);
                return Math.round((score / maxScore) * 100);
            }
        };

        // Run all predictions in parallel
        const matches = await Promise.all(
            roommates.map(async (rm) => {
                const matchPercentage = await predictScore(rm);
                const pg = pgs.find(p => p.id === rm.pgId);
                return {
                    ...rm,
                    id: rm._id?.toString() || rm.id,
                    matchPercentage,
                    pg
                };
            })
        );

        res.json(matches.sort((a, b) => b.matchPercentage - a.matchPercentage));
    } catch (err) {
        console.error('Roommates error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get PG by ID
router.get('/:id', async (req, res) => {
    try {
        const pg = await PG.findOne({ id: req.params.id });
        if (!pg) {
            // fallback to _id
            const p = await PG.findById(req.params.id);
            if (!p) return res.status(404).json({ message: 'PG not found' });
            return res.json(p);
        }
        res.json(pg);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Add PG
router.post('/add', async (req, res) => {
    try {
        const newPg = new PG({
            id: `pg-${Date.now()}`,
            ...req.body
        });
        await newPg.save();
        res.status(201).json(newPg);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Admin: Update Availability
router.patch('/:pgId/room/:roomId', async (req, res) => {
    try {
        const { pgId, roomId } = req.params;
        const { available } = req.body;

        const pg = await PG.findOne({ id: pgId }) || await PG.findById(pgId);
        if (!pg) return res.status(404).json({ message: 'PG not found' });

        const room = pg.rooms.find(r => r.id === roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.available = available;
        await pg.save();
        res.json({ message: 'Availability updated', room });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Add Room to Existing PG
router.post('/:pgId/rooms', async (req, res) => {
    try {
        const { pgId } = req.params;
        const { type, beds, price } = req.body;

        const pg = await PG.findOne({ id: pgId }) || await PG.findById(pgId);
        if (!pg) return res.status(404).json({ message: 'PG not found' });

        const newRoom = {
            id: `r-${Date.now()}-${pg.rooms.length}`,
            type,
            beds,
            price,
            available: true
        };

        pg.rooms.push(newRoom);
        await pg.save();
        res.status(201).json({ message: 'Room added successfully', room: newRoom });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Booking
router.post('/book', async (req, res) => {
    try {
        const booking = new Booking({
            ...req.body
        });
        await booking.save();
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
