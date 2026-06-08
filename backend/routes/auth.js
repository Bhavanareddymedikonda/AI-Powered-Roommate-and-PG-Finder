const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// User/Admin Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // role: 'user' or 'admin'
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            survey: null
        });

        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// User/Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role, survey: user.survey } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all users (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        // Map _id to id for frontend compatibility
        const formattedUsers = users.map(u => ({
            ...u.toObject(),
            id: u._id.toString()
        }));
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
