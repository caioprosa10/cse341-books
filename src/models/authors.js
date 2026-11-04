import { getDb } from '../db/connect.js';

const AUTHORS_COLLECTION = 'authors';
const BOOKS_COLLECTION = 'books';
const WITHOUT_MONGO_ID = { projection: { _id: 0 } };

export const getAllAuthors = async () => {
    const db = getDb();
    const authors = await db.collection(AUTHORS_COLLECTION).find({}, WITHOUT_MONGO_ID).toArray();

    return authors;
};

export const getAuthorById = async (authorId) => {
    const db = getDb();
    const author = await db.collection(AUTHORS_COLLECTION).findOne({ id: authorId }, WITHOUT_MONGO_ID);

    return author;
};

export const authorExists = async (authorId) => {
    const db = getDb();
    const matchingAuthors = await db
        .collection(AUTHORS_COLLECTION)
        .countDocuments({ id: authorId }, { limit: 1 });

    return matchingAuthors > 0;
};

export const createAuthor = async (author) => {
    const db = getDb();
    await db.collection(AUTHORS_COLLECTION).insertOne({
        id: author.id,
        name: author.name,
        birthYear: author.birthYear
    });

    return getAuthorById(author.id);
};

export const updateAuthor = async (authorId, author) => {
    const db = getDb();
    await db.collection(AUTHORS_COLLECTION).updateOne(
        { id: authorId },
        { $set: { name: author.name, birthYear: author.birthYear } }
    );

    return getAuthorById(authorId);
};

export const deleteAuthor = async (authorId) => {
    const db = getDb();
    const result = await db.collection(AUTHORS_COLLECTION).deleteOne({ id: authorId });

    return result.deletedCount;
};

/**
 * Counts the books that reference this author, stopping at the first match.
 * The count answers the question without loading any book document.
 */
export const authorHasBooks = async (authorId) => {
    const db = getDb();
    const matchingBooks = await db
        .collection(BOOKS_COLLECTION)
        .countDocuments({ authorId }, { limit: 1 });

    return matchingBooks > 0;
};
