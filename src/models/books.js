import { getDb } from '../db/connect.js';

export const getAllBooks = async () => {
    const db = getDb();
    const books = await db.collection('books').find({}).toArray();

    return books;
};
