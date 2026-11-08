
import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    authorHasBooks
} from "../models/authors.js";

// Validate author information
const validateAuthor = (name, birthYear) => {
    if (
        typeof name !== 'string' ||
        name.trim().length === 0 ||
        !Number.isInteger(birthYear) ||
        birthYear < 1 ||
        birthYear > new Date().getFullYear()
    ) {
        return false;
    }

    return true;
};

// Get all authors: GET /authors
const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error("GET /authors failed:", error.message);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

// Get one author: GET /authors/:id
const getAuthorByIdHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);

        if (!author) {
            return res.status(404).json({
                message: "Author not found"
            });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error("GET /authors/:id failed:", error.message);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

// Create an author: POST /authors
const createAuthorHandler = async (req, res) => {
    const { id, name, birthYear } = req.body;

    if (
        typeof id !== 'string' ||
        id.trim().length === 0 ||
        !validateAuthor(name, birthYear)
    ) {
        return res.status(400).json({
            message: 'A valid ID, name, and birth year are required.'
        });
    }

    try {
        const existingAuthor = await getAuthorById(id.trim());

        if (existingAuthor) {
            return res.status(400).json({
                message: 'An author with this ID already exists.'
            });
        }

        const author = {
            id: id.trim(),
            name: name.trim(),
            birthYear
        };

        const newAuthor = await createAuthor(author);

        return res.status(201).json(newAuthor);
    } catch (error) {
        console.error('POST /authors failed:', error.message);

        // Handle duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'An author with this ID already exists.'
            });
        }

        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Update an author: PUT /authors/:id
const updateAuthorHandler = async (req, res) => {
    const { name, birthYear } = req.body;

    if (!validateAuthor(name, birthYear)) {
        return res.status(400).json({
            message: 'A valid name and birth year are required.'
        });
    }

    try {
        const updatedAuthor = await updateAuthor(
            req.params.id,
            {
                name: name.trim(),
                birthYear
            }
        );

        if (!updatedAuthor) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        return res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error('PUT /authors/:id failed:', error.message);

        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Delete an author: DELETE /authors/:id
const deleteAuthorHandler = async (req, res) => {
    try {
        const authorId = req.params.id;

        // Check if the author exists
        const author = await getAuthorById(authorId);

        if (!author) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        // Check if books reference this author
        const hasBooks = await authorHasBooks(authorId);

        if (hasBooks) {
            return res.status(409).json({
                message: 'Cannot delete author because books are associated with this author.'
            });
        }

        // Delete the author
        await deleteAuthor(authorId);

        return res.status(204).send();

    } catch (error) {
        console.error('DELETE /authors/:id failed:', error.message);

        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

export {
    getAuthorsHandler,
    getAuthorByIdHandler,
    createAuthorHandler,
    updateAuthorHandler,
    deleteAuthorHandler
};
