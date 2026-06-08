const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        console.log("Check if your MongoDB Server is RUNNING at the URI above.");
        // We don't exit(1) anymore so the server stays up and we can see logs
    }
};

module.exports = connectDB;
