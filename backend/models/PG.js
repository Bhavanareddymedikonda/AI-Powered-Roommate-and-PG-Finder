const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },      // Single, Double, Triple, Quad
    beds: { type: Number, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
});

const pgSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    amenities: [{ type: String }],
    rooms: [roomSchema],
    surveyResponses: {
        cleanliness: { type: Number, default: 3 },
        social: { type: Number, default: 3 },
        sleep: { type: Number, default: 3 },
        guestPolicy: { type: Number, default: 3 },
        noise: { type: Number, default: 3 },
        cooking: { type: Number, default: 3 },
        workSchedule: { type: Number, default: 3 },
        petFriendly: { type: Number, default: 3 },
    },
}, { timestamps: true });

module.exports = mongoose.model('PG', pgSchema);
