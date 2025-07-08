import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectMongo(): Promise<void> {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student-management';
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
}
