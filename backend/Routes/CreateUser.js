const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const { body, validationResult } = require('express-validator'); // Import validation functions from express-validator
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT

const JWT_SECRET = 'qwertyuiopasdfghjklzxcvbnbnm'; // Replace with your own secret key



// Code for signup
router.post('/createuser', [
    // Validate and sanitize input
    body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the provided and hashed information
        const user = await User.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
            location: req.body.location
        });

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        // Respond with success and the token
        res.json({ success: true, authToken:authToken});
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});



// Code for login
router.post('/loginuser', [
    // Validate and sanitize input
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    try {
        // Find the user by email
        let userData = await User.findOne({ email });
        if (!userData) {
            // If user is not found, respond with an error
            return res.status(400).json({ errors: "Try logging in with correct email id" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(req.body.password, userData.password);
        if (!isMatch) {
            // If passwords do not match, respond with an error
            return res.status(400).json({ errors: "Try logging in with correct password" });
        }

        // Generate JWT token
        const data = {
            user: {
                id: userData.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        // If login is successful, respond with success and the token
        return res.json({ success: true, authToken });

    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

module.exports = router;
