const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    survey: {
        cleanliness: Number,
        social: Number,
        sleep: Number,
        guestPolicy: Number,
        noise: Number,
        cooking: Number,
        workSchedule: Number,
        petFriendly: Number
    },
    mode: { type: String },  // 'pg', 'roommate', or 'both'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
