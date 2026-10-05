const { MongoClient } = require('mongoose').mongo;
require('dotenv').config();

console.log('Testing connection to MongoDB Atlas with MongoClient...');
const client = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
});

async function run() {
  try {
    await client.connect();
    console.log('MongoClient: SUCCESSFULLY CONNECTED TO MONGO!');
    const db = client.db('handmade-craft');
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
  } catch (err) {
    console.error('MongoClient CONNECTION FAILED:', err);
  } finally {
    await client.close();
  }
}

run();
