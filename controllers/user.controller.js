const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/userModel');

const userRegister = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        const newUser = new User({
            name,
            email,
            password // No need to hash here, it's handled in the model
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {

    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if user exists with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, "JWT_SECRET", { expiresIn: '1h' });

        // Send the token to the user
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const userProfile = async (req, res) => {
    try {
        // Fetch the authenticated user using the user ID from the JWT
        const user = await User.findById(req.user.userId).select('-password');  // Exclude password

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user's name, email, and registration date
        res.status(200).json({
            name: user.name,
            email: user.email,
            registrationDate: user.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { userRegister, userLogin, userProfile };