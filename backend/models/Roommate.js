const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number },
    occupation: { type: String },
    bio: { type: String },
    interests: [{ type: String }],
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
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
    pgId: { type: String },  // references PG.id
}, { timestamps: true });

module.exports = mongoose.model('Roommate', roommateSchema);
