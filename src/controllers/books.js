import { getAllBooks, getBookById } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
       return res.status(200).json(books);
    } catch (error) {
       return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const reqBookId = req.params.id;
    try {
        const book = await getBookById(reqBookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { getBooksHandler, getBookByIdHandler };