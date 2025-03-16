require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

connect();

module.exports = {
    query: async (collectionName, query, options = {}) => {
        const db = client.db('CyberSecureHealthDB'); // Ensure this matches your database name
        const collection = db.collection(collectionName);
        return await collection.find(query, options).toArray();
    },
};
