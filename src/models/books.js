import { getDb } from '../db/connect.js';

export const getAllBooks = async () => {
    const db = getDb();
    const books = await db.collection('books').find({}).toArray();

    return books;
};

export const getBookById = async (bookId) => {
    const db = getDb();
    const book = await db.collection('books').findOne({ id: bookId });

    return book;
};
