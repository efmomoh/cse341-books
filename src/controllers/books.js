
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from "../models/books.js";

import {
    getAuthorById
} from "../models/authors.js";

// Validate book information
const validateBook = (authorId, title, publicationDate) => {
    if (
        typeof authorId !== 'string' ||
        authorId.trim().length === 0 ||
        typeof title !== 'string' ||
        title.trim().length === 0 ||
        typeof publicationDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)
    ) {
        return false;
    }

    const date = new Date(`${publicationDate}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === publicationDate
    );
};

// Get all books: GET /books
const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Get one book by ID: GET /books/:id
const getBookByIdHandler = async (req, res) => {
    const reqBookId = req.params.id;

    try {
        const book = await getBookById(reqBookId);

        // Check if the book exists
        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Create a new book: POST /books
const createBookHandler = async (req, res) => {
    const { id, authorId, title, publicationDate } = req.body;

    if (
        typeof id !== 'string' ||
        id.trim().length === 0 ||
        !validateBook(authorId, title, publicationDate)
    ) {
        return res.status(400).json({
            message: 'Valid ID, authorId, title, and publicationDate are required.'
        });
    }

    try {
        const existingBook = await getBookById(id.trim());

        if (existingBook) {
            return res.status(400).json({
                message: 'A book with this ID already exists.'
            });
        }

        // Check if the author exists
        const author = await getAuthorById(authorId.trim());

        if (!author) {
            return res.status(400).json({
                message: 'The specified author does not exist.'
            });
        }

        const book = {
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate
        };

        const newBook = await createBook(book);

        return res.status(201).json(newBook);
    } catch (error) {
        console.error('POST /books failed:', error.message);

        // Handle duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'A book with this ID already exists.'
            });
        }

        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Update an existing book: PUT /books/:id
const updateBookHandler = async (req, res) => {
    const { authorId, title, publicationDate } = req.body;

    if (!validateBook(authorId, title, publicationDate)) {
        return res.status(400).json({
            message: 'Valid authorId, title, and publicationDate are required.'
        });
    }

    try {
        // Check if the book exists before attempting to update
        const existingBook = await getBookById(req.params.id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        // Check if the specified author exists
        const author = await getAuthorById(authorId.trim());

        if (!author) {
            return res.status(400).json({
                message: 'The specified author does not exist.'
            });
        }

        // Update the existing book
        const updatedBook = await updateBook(
            req.params.id,
            {
                authorId: authorId.trim(),
                title: title.trim(),
                publicationDate
            }
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);

        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Delete an existing book: DELETE /books/:id
const deleteBookHandler = async (req, res) => {
    try {
        const deleted = await deleteBook(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);

        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

// Export the handlers for use in the router
export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};
