// // server.js - The main backend file for the application

// // Import required packages
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware to parse incoming request bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from the 'public' directory
// // We'll place our HTML files in this directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Set up the database connection
// // IMPORTANT: Replace 'mongodb://localhost:27017/user_auth_db' with your MongoDB connection string
// const dbURI = 'mongodb+srv://georgeortman19_db_user:lPcV6yRWZCIsvyTJ@cluster0.8llntck.mongodb.net/';
// mongoose.connect(dbURI)
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Define the User Schema using Mongoose
// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true, // Ensures usernames are unique
//         trim: true // Removes whitespace from the beginning and end
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// // Create a Mongoose model from the schema
// const User = mongoose.model('User', userSchema);

// // ---- API Routes for Authentication ----

// // Route to handle user registration
// app.post('/api/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Check if the username already exists
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(409).json({ message: 'Username already exists' });
//         }

//         // Hash the password for security before saving it to the database
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user instance
//         const newUser = new User({
//             username,
//             password: hashedPassword
//         });

//         // Save the new user to the database
//         await newUser.save();

//         // Send a success response
//         res.status(201).json({ message: 'User registered successfully' });

//     } catch (err) {
//         console.error('Signup error:', err);
//         res.status(500).json({ message: 'Server error during registration' });
//     }
// });

// // Route to handle user login
// app.post('/api/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Find the user by username
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         // Compare the provided password with the hashed password in the database
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         // If the password matches, login is successful
//         res.status(200).json({ message: 'Login successful' });

//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ message: 'Server error during login' });
//     }
// });

// // ---- New Route for the Homepage ----
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'signup.html'));
// });

// // Route to serve the signup page
// app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'signup.html'));
// });

// // Route to serve the dashboard page
// app.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });




// server.js - The main backend file for the application

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's PORT environment variable

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// We'll place our HTML files in this directory
console.log('Serving static files from:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public'), { index: 'signup.html' }));

// Set up the database connection
// IMPORTANT: Replace 'mongodb://localhost:27017/user_auth_db' with your MongoDB connection string
const dbURI = 'mongodb+srv://georgeortman19_db_user:lPcV6yRWZCIsvyTJ@cluster0.8llntck.mongodb.net/';
console.log('Attempting to connect to MongoDB at:', dbURI);
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the User Schema using Mongoose
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures usernames are unique
        trim: true // Removes whitespace from the beginning and end
    },
    password: {
        type: String,
        required: true
    }
});

// Create a Mongoose model from the schema
const User = mongoose.model('User', userSchema);

// ---- API Routes for Authentication ----

// Route to handle user registration
app.post('/api/signup', async (req, res) => {
    console.log('Received signup request.');
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Signup failed: Username already exists.');
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash the password for security before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();
        console.log('User registered successfully:', username);

        // Send a success response
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
    console.log('Received login request.');
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Login failed: Invalid username or password for user:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        console.log('Login successful for user:', username);

        // If the password matches, login is successful
        res.status(200).json({ message: 'Login successful' });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// ---- New Route for the Homepage ----
app.get('/', (req, res) => {
    console.log('GET request to / received.');
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route to serve the signup page
app.get('/signup', (req, res) => {
    console.log('GET request to /signup received.');
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route to serve the dashboard page
app.get('/dashboard', (req, res) => {
    console.log('GET request to /dashboard received.');
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Catch-all route to handle 404 errors
app.use((req, res, next) => {
    console.log(`404 Not Found: Request for ${req.originalUrl} failed.`);
    res.status(404).send('Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
