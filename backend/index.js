// Import required modules
const express = require('express'); // Import express module for creating server
const dotenv = require('dotenv'); // Import dotenv module for loading environment variables
const mongoDB = require('./db'); // Import custom module to connect to MongoDB

// Load environment variables from a .env file
dotenv.config({ path: './config.env' });

const app = express(); // Initialize an express application

// Middleware to set CORS headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from this origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept" // Allow these headers in requests
    );
    next(); // Pass control to the next middleware function
});

const port = process.env.PORT || 5000; // Set the port from environment variables or default to 5000

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api', require('./Routes/CreateUser')); // Use the routes defined in the CreateUser module for '/api' endpoint
app.use('/api', require('./Routes/DisplayData'));

// Define a simple GET route
app.get('/', (req, res) => {
    res.send('Hello World!'); // Send 'Hello World!' when the root URL is accessed
});

// Initialize database connection and start server
mongoDB().then(() => { // Connect to the database
    app.listen(port, () => { // Start the server after a successful database connection
        console.log(`Server is running on port ${port}`); // Log that the server is running
    });
}).catch(err => { // Handle database connection errors
    console.error("Failed to connect to the database. Server not started.", err); // Log an error message if the connection fails
});
