require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PG = require('../models/PG');
const Roommate = require('../models/Roommate');

// ───────────── HELPERS ─────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

// ───────────── PG DATA ─────────────
const PG_DATA = [
    {
        name: 'Sunrise PG',
        location: 'Koramangala, Bangalore',
        description: 'Modern PG with excellent connectivity near IT parks. Fully furnished rooms with stunning city views.',
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'CCTV'],
        surveyResponses: { cleanliness: 4, social: 3, sleep: 3, guestPolicy: 2, noise: 2, cooking: 3, workSchedule: 4, petFriendly: 2 },
        rooms: [
            { id: 'sr-r1', type: 'Single', beds: 1, price: 12000, available: true },
            { id: 'sr-r2', type: 'Double', beds: 2, price: 8000, available: true },
            { id: 'sr-r3', type: 'Triple', beds: 3, price: 6000, available: false },
            { id: 'sr-r4', type: 'Double', beds: 2, price: 8500, available: true },
        ]
    },
    {
        name: 'Green Valley PG',
        location: 'HSR Layout, Bangalore',
        description: 'Peaceful PG surrounded by greenery. Perfect for professionals seeking a quiet work-from-home environment.',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Gym', 'Parking', 'Hot Water'],
        surveyResponses: { cleanliness: 5, social: 2, sleep: 4, guestPolicy: 3, noise: 1, cooking: 4, workSchedule: 3, petFriendly: 4 },
        rooms: [
            { id: 'gv-r1', type: 'Single', beds: 1, price: 14000, available: true },
            { id: 'gv-r2', type: 'Double', beds: 2, price: 9000, available: true },
            { id: 'gv-r3', type: 'Single', beds: 1, price: 13500, available: true },
            { id: 'gv-r4', type: 'Triple', beds: 3, price: 6500, available: false },
        ]
    },
    {
        name: 'Urban Nest',
        location: 'Indiranagar, Bangalore',
        description: 'Trendy PG in the heart of Indiranagar. Walking distance to top cafes, pubs, and metro station.',
        images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Security', 'CCTV', 'Laundry'],
        surveyResponses: { cleanliness: 3, social: 5, sleep: 2, guestPolicy: 4, noise: 4, cooking: 2, workSchedule: 2, petFriendly: 3 },
        rooms: [
            { id: 'un-r1', type: 'Double', beds: 2, price: 9500, available: true },
            { id: 'un-r2', type: 'Double', beds: 2, price: 9500, available: true },
            { id: 'un-r3', type: 'Triple', beds: 3, price: 7000, available: true },
            { id: 'un-r4', type: 'Quad', beds: 4, price: 5500, available: false },
        ]
    },
    {
        name: 'Tech Hub PG',
        location: 'Electronic City, Bangalore',
        description: 'Designed for tech professionals. High-speed internet, co-working space, and proximity to major IT companies.',
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Gym', 'Parking', 'Security', 'CCTV'],
        surveyResponses: { cleanliness: 4, social: 3, sleep: 4, guestPolicy: 2, noise: 2, cooking: 3, workSchedule: 5, petFriendly: 1 },
        rooms: [
            { id: 'th-r1', type: 'Single', beds: 1, price: 11000, available: true },
            { id: 'th-r2', type: 'Double', beds: 2, price: 7500, available: true },
            { id: 'th-r3', type: 'Double', beds: 2, price: 7500, available: true },
            { id: 'th-r4', type: 'Triple', beds: 3, price: 5500, available: true },
        ]
    },
    {
        name: 'Comfort Stay PG',
        location: 'Whitefield, Bangalore',
        description: 'Homely atmosphere with all modern amenities near Whitefield IT corridor. Meals included.',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Laundry', 'Hot Water', 'Security'],
        surveyResponses: { cleanliness: 5, social: 3, sleep: 3, guestPolicy: 3, noise: 3, cooking: 5, workSchedule: 3, petFriendly: 3 },
        rooms: [
            { id: 'cs-r1', type: 'Single', beds: 1, price: 13000, available: true },
            { id: 'cs-r2', type: 'Double', beds: 2, price: 8500, available: false },
            { id: 'cs-r3', type: 'Triple', beds: 3, price: 6500, available: true },
            { id: 'cs-r4', type: 'Double', beds: 2, price: 8000, available: true },
        ]
    },
    {
        name: 'Sky View PG',
        location: 'Bellandur, Bangalore',
        description: 'Rooftop garden and terrace with stunning views. Premium PG with 24/7 security and power backup.',
        images: ['https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Gym', 'Parking', 'CCTV', 'Hot Water'],
        surveyResponses: { cleanliness: 5, social: 4, sleep: 3, guestPolicy: 3, noise: 3, cooking: 2, workSchedule: 4, petFriendly: 2 },
        rooms: [
            { id: 'sv-r1', type: 'Single', beds: 1, price: 15000, available: true },
            { id: 'sv-r2', type: 'Double', beds: 2, price: 10000, available: true },
            { id: 'sv-r3', type: 'Double', beds: 2, price: 10000, available: true },
            { id: 'sv-r4', type: 'Triple', beds: 3, price: 7500, available: false },
        ]
    },
    {
        name: 'Metro Junction PG',
        location: 'Marathahalli, Bangalore',
        description: 'Conveniently located right next to Marathahalli metro station. Budget-friendly with all essentials.',
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'Laundry', 'Security', 'Hot Water'],
        surveyResponses: { cleanliness: 3, social: 4, sleep: 3, guestPolicy: 4, noise: 4, cooking: 3, workSchedule: 2, petFriendly: 3 },
        rooms: [
            { id: 'mj-r1', type: 'Double', beds: 2, price: 7000, available: true },
            { id: 'mj-r2', type: 'Triple', beds: 3, price: 5000, available: true },
            { id: 'mj-r3', type: 'Quad', beds: 4, price: 4000, available: true },
            { id: 'mj-r4', type: 'Double', beds: 2, price: 7500, available: false },
        ]
    },
    {
        name: 'Lakeside PG',
        location: 'Ulsoor, Bangalore',
        description: 'Serene PG next to Ulsoor Lake with a natural, calming environment. Great for those who love morning walks.',
        images: ['https://images.unsplash.com/photo-1416340306710-8d4f42041b95?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Parking', 'Security', 'CCTV'],
        surveyResponses: { cleanliness: 4, social: 2, sleep: 5, guestPolicy: 2, noise: 1, cooking: 4, workSchedule: 3, petFriendly: 5 },
        rooms: [
            { id: 'ls-r1', type: 'Single', beds: 1, price: 16000, available: true },
            { id: 'ls-r2', type: 'Double', beds: 2, price: 11000, available: true },
            { id: 'ls-r3', type: 'Single', beds: 1, price: 15500, available: false },
            { id: 'ls-r4', type: 'Double', beds: 2, price: 10500, available: true },
        ]
    },
    {
        name: 'Central Park PG',
        location: 'MG Road, Bangalore',
        description: 'Premium PG in the heart of the city on iconic MG Road. All luxury amenities and premium interiors.',
        images: ['https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Gym', 'Parking', 'Security', 'CCTV', 'Hot Water', 'Laundry'],
        surveyResponses: { cleanliness: 5, social: 5, sleep: 3, guestPolicy: 4, noise: 4, cooking: 2, workSchedule: 3, petFriendly: 2 },
        rooms: [
            { id: 'cp-r1', type: 'Single', beds: 1, price: 20000, available: true },
            { id: 'cp-r2', type: 'Double', beds: 2, price: 14000, available: true },
            { id: 'cp-r3', type: 'Single', beds: 1, price: 19000, available: true },
            { id: 'cp-r4', type: 'Double', beds: 2, price: 13500, available: false },
        ]
    },
    {
        name: 'Garden View PG',
        location: 'JP Nagar, Bangalore',
        description: 'Lush garden surroundings in the peaceful JP Nagar residential area. Family-like environment with home-cooked meals.',
        images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'],
        amenities: ['WiFi', 'AC', 'Laundry', 'Hot Water', 'Parking', 'Security'],
        surveyResponses: { cleanliness: 5, social: 3, sleep: 4, guestPolicy: 3, noise: 2, cooking: 5, workSchedule: 4, petFriendly: 4 },
        rooms: [
            { id: 'gd-r1', type: 'Single', beds: 1, price: 12500, available: true },
            { id: 'gd-r2', type: 'Double', beds: 2, price: 8500, available: true },
            { id: 'gd-r3', type: 'Triple', beds: 3, price: 6000, available: true },
            { id: 'gd-r4', type: 'Double', beds: 2, price: 8000, available: false },
        ]
    }
];

// ───────────── NAME DATA ─────────────
const FIRST_NAMES = [
    'Aarav','Aditya','Akash','Amit','Ananya','Anjali','Ankit','Anshul','Arjun','Aryan',
    'Ashish','Astha','Bhavya','Deepak','Deepika','Divya','Gaurav','Harshita','Ishaan','Ishita',
    'Karan','Kavya','Kunal','Lakshmi','Manish','Meera','Mihir','Monika','Naman','Neha',
    'Nikhil','Nikita','Piyush','Pooja','Pradeep','Priya','Rahul','Rajan','Ritu','Rohan',
    'Rohit','Sakshi','Sandeep','Sanjay','Sara','Shikha','Shivam','Shruti','Siddharth','Simran',
    'Sneha','Suraj','Tanishi','Tanmay','Tushar','Udit','Vaibhav','Vikas','Vipul','Yash'
];
const LAST_NAMES = [
    'Agarwal','Bhatia','Chauhan','Desai','Dubey','Garg','Gupta','Iyer','Jain','Joshi',
    'Kapoor','Khanna','Kumar','Mehta','Mishra','Nair','Pandey','Patel','Rao','Saxena',
    'Shah','Sharma','Singh','Sinha','Srinivasan','Tiwari','Trivedi','Upadhyay','Verma','Yadav'
];
const OCCUPATIONS = [
    'Software Engineer','Data Scientist','Product Manager','UI/UX Designer','DevOps Engineer',
    'Business Analyst','Marketing Executive','Financial Analyst','Graphic Designer','MBA Student',
    'Research Scholar','Mechanical Engineer','Civil Engineer','HR Manager','Content Writer'
];
const INTERESTS = [
    'Coding','Gaming','Cooking','Reading','Traveling','Fitness','Music','Movies','Photography',
    'Dance','Art','Cricket','Football','Yoga','Meditation','Cycling','Swimming','Hiking',
    'Blogging','Volunteering','Startups','Machine Learning','Chess','Badminton','Tennis'
];
const BIOS = [
    'Passionate about tech and coffee. Love weekend hikes and good conversations.',
    'Fitness enthusiast and foodie. Always up for exploring new restaurants.',
    'Night owl who loves coding and binge-watching sci-fi series.',
    'Early bird, yoga practitioner, and avid reader of self-help books.',
    'Social person who loves making new friends. Cricket and gaming are my therapy.',
    'Minimalist lifestyle lover. Into deep work and mindful living.',
    'Creative soul exploring design, music, and photography in spare time.',
    'Data-driven thinker who unwinds with a good book or a long run.',
    'Travel junkie, have visited 12+ states. Love trying local cuisines everywhere.',
    'Quiet and focused. Enjoy board games and cooking for friends on weekends.',
];

// ───────────── MAIN SEED ─────────────
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing (except admin users)
        await PG.deleteMany({});
        console.log('🗑️  Cleared PGs');
        await Roommate.deleteMany({});
        console.log('🗑️  Cleared Roommates');

        // ── Create Admin if missing ──
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (!existingAdmin) {
            const hashed = await bcrypt.hash('admin123', 10);
            await User.create({ name: 'Super Admin', email: 'admin@unstop.com', password: hashed, role: 'admin' });
            console.log('👤 Admin created: admin@unstop.com / admin123');
        } else {
            console.log('👤 Admin already exists, skipping.');
        }

        // ── Seed PGs ──
        const createdPGs = [];
        for (let i = 0; i < PG_DATA.length; i++) {
            const pgData = PG_DATA[i];
            const pg = await PG.create({
                id: `pg-${Date.now()}-${i}`,
                ...pgData
            });
            createdPGs.push(pg);
            console.log(`🏠 Created PG [${i + 1}/10]: ${pg.name}`);
        }

        // ── Seed Roommates (40-50 per PG) ──
        let totalRoommates = 0;
        for (const pg of createdPGs) {
            const count = rand(40, 50);
            const roommatesForPg = [];

            for (let j = 0; j < count; j++) {
                const firstName = pick(FIRST_NAMES);
                const lastName = pick(LAST_NAMES);
                const gender = pick(['Male', 'Female', 'Other']);

                roommatesForPg.push({
                    id: `rm-${pg.id}-${j}-${Date.now()}`,
                    name: `${firstName} ${lastName}`,
                    age: rand(20, 32),
                    occupation: pick(OCCUPATIONS),
                    bio: pick(BIOS),
                    interests: pickN(INTERESTS, rand(2, 5)),
                    gender,
                    pgId: pg.id,
                    survey: {
                        cleanliness: rand(1, 5),
                        social: rand(1, 5),
                        sleep: rand(1, 5),
                        guestPolicy: rand(1, 5),
                        noise: rand(1, 5),
                        cooking: rand(1, 5),
                        workSchedule: rand(1, 5),
                        petFriendly: rand(1, 5),
                    }
                });
            }

            await Roommate.insertMany(roommatesForPg);
            totalRoommates += count;
            console.log(`   👥 Added ${count} roommates to ${pg.name}`);
        }

        console.log('\n🎉 Seeding Complete!');
        console.log(`   🏠 PGs created:       ${createdPGs.length}`);
        console.log(`   👥 Roommates created: ${totalRoommates}`);
        console.log(`   🔑 Admin Login:       admin@unstop.com / admin123`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed Error:', err.message);
        console.error(err);
        process.exit(1);
    }
};

seed();
