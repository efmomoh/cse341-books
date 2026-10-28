// Import the Express app instance
import app from './app.js';
import { connectToDb } from './src/db/connect.js';

// Set up a PORT constant using the PORT environment variable. If the PORT environment variable is not set, default to port 3000.
const PORT = process.env.PORT || 3000;

// Throw an error if PORT is missing so you know immediately if the .env file is not being read.
if (!PORT) {
    throw new Error('PORT environment variable is not set');
}

// Start the server inside an async function to ensure the database connection is established first.
// Move the app.listen(...) code inside an async startServer function
const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server is listening on http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

await startServer();

