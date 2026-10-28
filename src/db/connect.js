import { MongoClient } from 'mongodb';

let db;

export const connectToDb = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is missing. Add it to your .env file.');
    }

    const client = new MongoClient(uri);
    await client.connect();

    db = client.db(process.env.MONGODB_DB_NAME || 'practice');
    console.log(`Connected to database: ${db.databaseName}`);

    return db;
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database is not connected. Call connectToDb() first.');
    }

    return db;
};
