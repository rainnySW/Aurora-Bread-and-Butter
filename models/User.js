import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    accountInfo: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
            // cannot be edited later as requested by user
        }
    },
    userPreference: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        language: {
            type: String,
            enum: ['en', 'th'],
            default: 'en'
        }
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
