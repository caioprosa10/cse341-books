import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    authorHasBooks
} from '../models/authors.js';
import { isNonEmptyString, isValidBirthYear } from '../validation.js';

const INVALID_FIELDS_MESSAGE =
    'Missing or invalid author fields: id and name must be non-empty strings.';
const INVALID_NAME_MESSAGE = 'Missing or invalid author fields: name must be a non-empty string.';
const INVALID_BIRTH_YEAR_MESSAGE =
    'birthYear must be an integer year no later than the current year.';

export const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();

        return res.status(200).json(authors);
    } catch (error) {
        console.error('Failed to retrieve authors:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAuthorByIdHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Failed to retrieve the author:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createAuthorHandler = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body;

        if (!isNonEmptyString(id) || !isNonEmptyString(name)) {
            return res.status(400).json({ message: INVALID_FIELDS_MESSAGE });
        }

        if (!isValidBirthYear(birthYear)) {
            return res.status(400).json({ message: INVALID_BIRTH_YEAR_MESSAGE });
        }

        const newAuthor = {
            id: id.trim(),
            name: name.trim(),
            birthYear
        };

        const duplicateAuthor = await getAuthorById(newAuthor.id);

        if (duplicateAuthor) {
            return res.status(400).json({ message: 'An author with that id already exists.' });
        }

        const createdAuthor = await createAuthor(newAuthor);

        return res.status(201).json(createdAuthor);
    } catch (error) {
        console.error('Failed to create the author:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAuthorHandler = async (req, res) => {
    try {
        const { name, birthYear } = req.body;

        if (!isNonEmptyString(name)) {
            return res.status(400).json({ message: INVALID_NAME_MESSAGE });
        }

        if (!isValidBirthYear(birthYear)) {
            return res.status(400).json({ message: INVALID_BIRTH_YEAR_MESSAGE });
        }

        const existingAuthor = await getAuthorById(req.params.id);

        if (!existingAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const updatedAuthor = await updateAuthor(req.params.id, {
            name: name.trim(),
            birthYear
        });

        return res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error('Failed to update the author:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAuthorHandler = async (req, res) => {
    try {
        const authorId = req.params.id;
        const existingAuthor = await getAuthorById(authorId);

        if (!existingAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        if (await authorHasBooks(authorId)) {
            return res.status(409).json({
                message: 'Author cannot be deleted because they still have books.'
            });
        }

        await deleteAuthor(authorId);

        return res.status(204).send();
    } catch (error) {
        console.error('Failed to delete the author:', error.message);

        return res.status(500).json({ message: 'Internal server error' });
    }
};
