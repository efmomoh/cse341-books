// Import Express
import express from 'express';
// import { getDb } from './src/db/connect.js';

// create an instance of express
const app = express();

// add a JSON request body middleware with express.json() to parse incoming JSON requests
app.use(express.json());

// Add a root route (GET /) that returns a short JSON response with a status code of 200
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to the Express server! The server is running.' });
});

// Add a route to get data from the database -- this will be removed later
// app.get('/books', async (req, res) => {
//   try {
//     // Retrieve all books from the database, excluding the MongoDB auto generated _id field and including id, author, title, and publicationDate fields.
//     const books = await getDb().collection('books').find({}, { projection: { _id: 0, id: 1, author: 1, title: 1, publicationDate: 1 } }).toArray();

//     return res.status(200).json(books);
//   } catch (error) {
//     console.error('Failed to retrieve books:', error.message);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// });

// // GET / books /: id  - Description: Return one book by id.
// app.get('/books/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Retrieve the book with the specified id from the database, excluding the MongoDB auto generated _id field and including id, author, title, and publicationDate fields.
//     const book = await getDb().collection('books').findOne({ id }, { projection: { _id: 0, id: 1, author: 1, title: 1, publicationDate: 1 } });

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found.' });
//     }

//     return res.status(200).json(book);
//   } catch (error) {
//     console.error('Failed to retrieve book:', error.message);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// });

// Export the app instance for use in other files
export default app;