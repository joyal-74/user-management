import { connectMongo } from './mongodb';
import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB(): Promise<void> {
    const dbType = process.env.DB_TYPE;

    if (dbType === 'mongodb') {
        await connectMongo();
    } else {
        try {
            await pool.connect();
            console.log('✅ PostgreSQL connected');
        } catch (err) {
            console.error('❌ PostgreSQL connection failed:', err);
            process.exit(1);
        }
    }
}
