import { getDb } from '../db/connect.js';

const BOOKS_COLLECTION = 'books';
const WITHOUT_MONGO_ID = { projection: { _id: 0 } };

export const getAllBooks = async () => {
    const db = getDb();
    const books = await db.collection(BOOKS_COLLECTION).find({}, WITHOUT_MONGO_ID).toArray();

    return books;
};

export const getBookById = async (bookId) => {
    const db = getDb();
    const book = await db.collection(BOOKS_COLLECTION).findOne({ id: bookId }, WITHOUT_MONGO_ID);

    return book;
};

export const createBook = async (book) => {
    const db = getDb();
    await db.collection(BOOKS_COLLECTION).insertOne({
        id: book.id,
        authorId: book.authorId,
        title: book.title,
        publicationDate: book.publicationDate
    });

    return getBookById(book.id);
};

export const updateBook = async (bookId, book) => {
    const db = getDb();
    await db.collection(BOOKS_COLLECTION).updateOne(
        { id: bookId },
        {
            $set: {
                authorId: book.authorId,
                title: book.title,
                publicationDate: book.publicationDate
            }
        }
    );

    return getBookById(bookId);
};

export const deleteBook = async (bookId) => {
    const db = getDb();
    const result = await db.collection(BOOKS_COLLECTION).deleteOne({ id: bookId });

    return result.deletedCount;
};
