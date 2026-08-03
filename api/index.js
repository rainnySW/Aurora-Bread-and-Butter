import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// Load .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---

// 1. Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ 'accountInfo.username': username }, { 'accountInfo.email': email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            accountInfo: {
                username,
                email,
                password: hashedPassword
            },
            userPreference: {
                theme: 'light',
                language: 'en'
            }
        });

        await newUser.save();
        
        // Don't send password back
        const userToReturn = {
            id: newUser._id,
            username: newUser.accountInfo.username,
            email: newUser.accountInfo.email,
            preferences: newUser.userPreference
        };
        
        res.status(201).json({ message: 'User created successfully', user: userToReturn });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        const user = await User.findOne({
            $or: [
                { 'accountInfo.email': identifier },
                { 'accountInfo.username': identifier }
            ]
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.accountInfo.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const userToReturn = {
            id: user._id,
            username: user.accountInfo.username,
            email: user.accountInfo.email,
            preferences: user.userPreference
        };

        res.json({ message: 'Logged in successfully', user: userToReturn });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// 3. Update Preferences
app.put('/api/preferences/:id', async (req, res) => {
    try {
        const { theme, language } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (theme) user.userPreference.theme = theme;
        if (language) user.userPreference.language = language;

        await user.save();

        res.json({ message: 'Preferences updated', preferences: user.userPreference });
    } catch (error) {
        console.error('Update Prefs Error:', error);
        res.status(500).json({ error: 'Server error updating preferences' });
    }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
    });
}

export default app;
