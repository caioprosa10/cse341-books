import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../models/books.js';
import { authorExists } from '../models/authors.js';
import { isNonEmptyString, isValidDateString } from '../validation.js';

const INVALID_FIELDS_MESSAGE =
    'Missing or invalid book fields: id, authorId, title and publicationDate must be non-empty strings.';
const INVALID_UPDATE_FIELDS_MESSAGE =
    'Missing or invalid book fields: authorId, title and publicationDate must be non-empty strings.';
const INVALID_DATE_MESSAGE = 'publicationDate must be a valid date in YYYY-MM-DD format.';
const UNKNOWN_AUTHOR_MESSAGE = 'authorId does not match an existing author.';

export const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();

        return res.status(200).json(books);
    } catch (error) {
        console.error('Failed to retrieve books:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Failed to retrieve the book:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body;

        if (
            !isNonEmptyString(id) ||
            !isNonEmptyString(authorId) ||
            !isNonEmptyString(title) ||
            !isNonEmptyString(publicationDate)
        ) {
            return res.status(400).json({ message: INVALID_FIELDS_MESSAGE });
        }

        if (!isValidDateString(publicationDate)) {
            return res.status(400).json({ message: INVALID_DATE_MESSAGE });
        }

        const newBook = {
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim()
        };

        const duplicateBook = await getBookById(newBook.id);

        if (duplicateBook) {
            return res.status(400).json({ message: 'A book with that id already exists.' });
        }

        if (!(await authorExists(newBook.authorId))) {
            return res.status(400).json({ message: UNKNOWN_AUTHOR_MESSAGE });
        }

        const createdBook = await createBook(newBook);

        return res.status(201).json(createdBook);
    } catch (error) {
        console.error('Failed to create the book:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBookHandler = async (req, res) => {
    try {
        const { authorId, title, publicationDate } = req.body;

        if (
            !isNonEmptyString(authorId) ||
            !isNonEmptyString(title) ||
            !isNonEmptyString(publicationDate)
        ) {
            return res.status(400).json({ message: INVALID_UPDATE_FIELDS_MESSAGE });
        }

        if (!isValidDateString(publicationDate)) {
            return res.status(400).json({ message: INVALID_DATE_MESSAGE });
        }

        const existingBook = await getBookById(req.params.id);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!(await authorExists(authorId.trim()))) {
            return res.status(400).json({ message: UNKNOWN_AUTHOR_MESSAGE });
        }

        const updatedBook = await updateBook(req.params.id, {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim()
        });

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Failed to update the book:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBookHandler = async (req, res) => {
    try {
        const existingBook = await getBookById(req.params.id);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await deleteBook(req.params.id);

        return res.status(204).send();
    } catch (error) {
        console.error('Failed to delete the book:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};
