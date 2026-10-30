import { getDb } from "../db/connect.js";

// Get all books from the database
const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
};

export { getAllBooks };