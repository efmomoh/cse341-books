
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
    // Check if the name is a non-empty string and birthYear is a valid integer within a reasonable range
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
        // Fetch all authors from the database
        const authors = await getAllAuthors();
        // Return the list of authors as a JSON response
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
        // Fetch the author by ID
        const author = await getAuthorById(req.params.id);

        // If the author does not exist, return a 404 Not Found response
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
    // Destructure the request body to get the author details
    const { id, name, birthYear } = req.body || {};

    // Validate input
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
        // Check if an author with the same ID already exists
        const existingAuthor = await getAuthorById(id.trim());

        // If an author with the same ID already exists, return a 400 Bad Request response
        if (existingAuthor) {
            return res.status(400).json({
                message: 'An author with this ID already exists.'
            });
        }

        // Create a new author object
        const author = {
            id: id.trim(),
            name: name.trim(),
            birthYear
        };

        // Create the new author
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
    const { name, birthYear } = req.body || {};

    // Validate input
    if (!validateAuthor(name, birthYear)) {
        return res.status(400).json({
            message: 'A valid name and birth year are required.'
        });
    }

    try {
        // Check if the author exists
        const existingAuthor = await getAuthorById(req.params.id);

        if (!existingAuthor) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        // Update the author
        const updatedAuthor = await updateAuthor(
            req.params.id,
            {
                name: name.trim(),
                birthYear
            }
        );

        // Check if the update was successful
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

        // If the author does not exist, return a 404 Not Found response
        if (!author) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        // Check if books reference this author
        const hasBooks = await authorHasBooks(authorId);

        // If the author has associated books, return a 409 Conflict response
        if (hasBooks) {
            return res.status(409).json({
                message: 'Cannot delete author because books are associated with this author.'
            });
        }

        // Delete the author
        const result = await deleteAuthor(authorId);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Author not found.'
            });
        }

        // Return a 204 No Content response to indicate successful deletion
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
