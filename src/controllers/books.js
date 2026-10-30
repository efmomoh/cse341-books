import { getAllBooks } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
       return res.status(200).json(books);
    } catch (error) {
       return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export { getBooksHandler };