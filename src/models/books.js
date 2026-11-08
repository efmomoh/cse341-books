import { getDb } from "../db/connect.js";

// Get all books from the database
const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
};

// Get a single book by its Custom ID
const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id: bookId });
    return book;
};

// Create a new book
const createBook = async (book) => {
    const db = getDb();
    const collection = db.collection('books');

    await collection.insertOne(book);

    return book;
};

// Update an existing book
const updateBook = async (bookId, bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.findOneAndUpdate(
        { id: bookId },
        { $set: bookData },
        { returnDocument: 'after' }
    );

    return result;
};

// Delete an existing book
const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.deleteOne({ id: bookId });

    return result.deletedCount > 0;
};

// Export the functions for use in controller and other modules
export {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};