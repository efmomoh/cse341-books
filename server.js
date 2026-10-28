// Import the Express app instance
import app from './app.js';

// Set up a PORT constant using the PORT environment variable. If the PORT environment variable is not set, default to port 3000.
const PORT = process.env.PORT || 3000;

// Throw an error if PORT is missing so you know immediately if the .env file is not being read.
if (!PORT) {
    throw new Error('PORT environment variable is not set');
}

// Start the server and have it listen on the specified port.
app.listen(PORT, () => {
    console.log(`Server is listening at http://127.0.0.1:${PORT}`);
});

