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
// app.get('/trails', async (req, res) => {
//   try {
//     const trails = await getDb()
//       .collection('trails')
//       .find({})
//       .toArray();

//     return res.status(200).json(trails);
//   } catch (error) {
//     console.error('Failed to retrieve trails:', error.message);
//     return res.status(500).json({ message: 'Failed to retrieve trails' });
//   }
// });

// Export the app instance for use in other files
export default app;