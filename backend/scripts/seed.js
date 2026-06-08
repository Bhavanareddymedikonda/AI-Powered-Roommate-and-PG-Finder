require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await connectDB();

        // Only create an admin account if one doesn't exist
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            process.exit();
        }

        console.log('Creating Admin User...');
        const hashedPw = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Super Admin',
            email: 'admin@unstop.com',
            password: hashedPw,
            role: 'admin'
        });

        console.log('Admin created successfully!');
        console.log('  Email:    admin@unstop.com');
        console.log('  Password: admin123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
