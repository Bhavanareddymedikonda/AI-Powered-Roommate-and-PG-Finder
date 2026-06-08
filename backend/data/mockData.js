const users = [];
const pgs = [
    {
        id: "pg-1",
        name: "Luxe Living PG",
        location: "Koramangala, Bangalore",
        description: "Premium PG with high-speed internet and home-cooked meals.",
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400"],
        amenities: ["WiFi", "AC", "Laundry", "Gym"],
        rooms: [
            { id: "r1", type: "Single", beds: 1, price: 15000, available: true },
            { id: "r2", type: "Double", beds: 2, price: 9000, available: true }
        ],
        surveyResponses: { cleanliness: 5, social: 3, sleep: 4, guestPolicy: 2 }
    },
    {
        id: "pg-2",
        name: "Cozy Corner PG",
        location: "Indiranagar, Bangalore",
        description: "A peaceful place for students and working professionals.",
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=400"],
        amenities: ["WiFi", "Laundry", "Security"],
        rooms: [
            { id: "r3", type: "Double", beds: 2, price: 8500, available: true },
            { id: "r4", type: "Triple", beds: 3, price: 6500, available: false }
        ],
        surveyResponses: { cleanliness: 4, social: 5, sleep: 3, guestPolicy: 4 }
    },
    {
        id: "pg-3",
        name: "Urban Nest PG",
        location: "HSR Layout, Bangalore",
        description: "Modern coworking-style PG for startups and freelancers.",
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400"],
        amenities: ["WiFi", "AC", "Gym", "Security"],
        rooms: [
            { id: "r5", type: "Single", beds: 1, price: 18000, available: true },
            { id: "r6", type: "Double", beds: 2, price: 10500, available: true }
        ],
        surveyResponses: { cleanliness: 4, social: 4, sleep: 3, guestPolicy: 3 }
    }
];

const roommates = [
    {
        id: "u1",
        name: "Rahul Sharma",
        age: 24,
        occupation: "Software Engineer",
        bio: "Late night coder, loves quiet surroundings and good food.",
        interests: ["Coding", "Gaming", "Anime"],
        gender: "Male",
        survey: { cleanliness: 5, social: 2, sleep: 5, guestPolicy: 1 },
        pgId: "pg-1"
    },
    {
        id: "u2",
        name: "Ananya Iyer",
        age: 22,
        occupation: "UX Designer",
        bio: "Extrovert, loves weekend parties and movie nights.",
        interests: ["Music", "Travel", "Cooking"],
        gender: "Female",
        survey: { cleanliness: 3, social: 5, sleep: 2, guestPolicy: 5 },
        pgId: "pg-2"
    },
    {
        id: "u3",
        name: "Siddharth Malhotra",
        age: 26,
        occupation: "Product Manager",
        bio: "Fitness freak, disciplined and early riser. Weekends at the gym.",
        interests: ["Fitness", "Startups", "Reading"],
        gender: "Male",
        survey: { cleanliness: 5, social: 3, sleep: 1, guestPolicy: 2 },
        pgId: "pg-1"
    },
    {
        id: "u4",
        name: "Priya Nair",
        age: 23,
        occupation: "Data Analyst",
        bio: "Calm and collected. Loves cooking and binge-watching shows.",
        interests: ["Cooking", "Netflix", "Yoga"],
        gender: "Female",
        survey: { cleanliness: 4, social: 2, sleep: 4, guestPolicy: 2 },
        pgId: "pg-3"
    },
    {
        id: "u5",
        name: "Arjun Mehta",
        age: 25,
        occupation: "Full Stack Developer",
        bio: "Balanced lifestyle. Works hard, parties smart.",
        interests: ["Coding", "Badminton", "Music"],
        gender: "Male",
        survey: { cleanliness: 4, social: 4, sleep: 3, guestPolicy: 3 },
        pgId: "pg-3"
    },
    {
        id: "u6",
        name: "Kavya Reddy",
        age: 21,
        occupation: "MBA Student",
        bio: "Social butterfly with a love for chai and intellectual debates.",
        interests: ["Business", "Reading", "Travel"],
        gender: "Female",
        survey: { cleanliness: 3, social: 5, sleep: 3, guestPolicy: 4 },
        pgId: "pg-2"
    },
    {
        id: "u7",
        name: "Rohan Gupta",
        age: 27,
        occupation: "DevOps Engineer",
        bio: "Night owl. Terminal > IDE. Coffee addict.",
        interests: ["Open Source", "Linux", "Coffee"],
        gender: "Male",
        survey: { cleanliness: 3, social: 2, sleep: 5, guestPolicy: 1 },
        pgId: "pg-1"
    },
    {
        id: "u8",
        name: "Sneha Pillai",
        age: 22,
        occupation: "Graphic Designer",
        bio: "Artsy and free-spirited. Music is life.",
        interests: ["Art", "Music", "Photography"],
        gender: "Female",
        survey: { cleanliness: 4, social: 4, sleep: 3, guestPolicy: 4 },
        pgId: "pg-3"
    }
];

const bookings = [];

module.exports = { users, pgs, roommates, bookings };
