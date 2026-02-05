import mongoose from 'mongoose';

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':***@'));
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!');
        console.log('Database:', mongoose.connection.name);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('bad auth')) {
            console.log('\n💡 Solutions:');
            console.log('1. Check username and password are correct in MongoDB Atlas');
            console.log('2. If password has special characters, URL encode them:');
            console.log('   @ → %40');
            console.log('   : → %3A');
            console.log('   / → %2F');
            console.log('   ? → %3F');
            console.log('   # → %23');
            console.log('   [ → %5B');
            console.log('   ] → %5D');
            console.log('   $ → %24');
            console.log('3. Make sure Database User exists in MongoDB Atlas');
            console.log('4. Check Network Access allows your IP address');
        }
        
        process.exit(1);
    }
};

// Load env
import dotenv from 'dotenv';
dotenv.config();

testConnection();
