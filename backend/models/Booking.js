const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    pgId: { type: String, required: true },
    roomId: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
