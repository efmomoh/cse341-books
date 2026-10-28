// Import Express
import express from 'express';

// create an instance of express
const app = express();

// add a JSON request body middleware with express.json() to parse incoming JSON requests
app.use(express.json());

// Add a root route (GET /) that returns a short JSON response with a status code of 200
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to the Express server! The server is running.' });
});

// Export the app instance for use in other files
export default app;