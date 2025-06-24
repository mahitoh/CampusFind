const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection URI:', process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Successfully connected to MongoDB!');
        
        // Test database operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Connection closed');
    }
}

testConnection(); 